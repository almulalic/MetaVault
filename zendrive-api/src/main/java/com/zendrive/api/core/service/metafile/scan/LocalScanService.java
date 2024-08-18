package com.zendrive.api.core.service.metafile.scan;

import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;
import com.zendrive.api.core.model.metafile.StorageType;
import com.zendrive.api.core.repository.MetafileRepository;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.rest.model.dto.scan.ScanCheckResponse;
import org.apache.commons.vfs2.*;
import org.springframework.stereotype.Service;

@Service
public class LocalScanService implements ScanService<File> {
    private final MetafileRepository metafileRepository;

    public LocalScanService(MetafileRepository metafileRepository) {
        this.metafileRepository = metafileRepository;
    }

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

    private static List<MetaFile> parseDirectory(
      FileObject start,
      Path inputPath,
      String destinationId,
      Permissions permissions,
      MetaFileConfig config
    ) throws Exception {
        Map<String, MetaFile> metaFileMap = new HashMap<>();
        Map<String, String> pathToIdMap = new HashMap<>();
        List<MetaFile> metaFiles = new ArrayList<>();

        if (!start.exists()) {
            System.out.println("Directory does not exist.");
            return metaFiles;
        }

        FileObject[] files = start.findFiles(Selectors.SELECT_ALL);

        for (FileObject file : files) {
            FileContent content = file.getContent();
            String createdDate = content.getAttribute("creationTime") != null
                                 ? sdf.format(new Date((Long) content.getAttribute("creationTime")))
                                 : null;

            List<String> breadcrumbs = new ArrayList<>(List.of(inputPath.getFileName().toString()));
            String relativePath = file.getName().getPath().replace(inputPath.toString(), "");
            String[] pathParts = relativePath.split("/");

            for (int i = 0; i < pathParts.length; ++i) {
                if (!pathParts[i].isEmpty() && (file.isFile() && i < pathParts.length - 1)) {
                    breadcrumbs.add(pathParts[i]);
                }
            }

            // Create MetaFile instance
            MetaFile metaFile = MetaFile.Builder()
                                  .withId(UUID.randomUUID().toString())
                                  .withName(file.getName().getBaseName())
                                  .withSize(file.isFile() ? content.getSize() : null)
                                  .withCreatedDate(createdDate)
                                  .withLastModifiedMs(content.getLastModifiedTime())
                                  .withLastSyncMs(System.currentTimeMillis()) // TODO Timezone
                                  .withConfig(config)
                                  .withBlobPath(file.getName().getPath())
                                  .withPrevious(destinationId)
                                  .withChildren(file.isFolder() ? new ArrayList<>() : null)
                                  .withBreadcrumbs(breadcrumbs)
                                  .withPermissions(permissions)
                                  .build();

            metaFiles.add(metaFile);
            metaFileMap.put(metaFile.getId(), metaFile);
            pathToIdMap.put(file.getName().getPath(), metaFile.getId());
        }

        String startId = pathToIdMap.get(inputPath.toString());

        for (MetaFile metaFile : metaFiles) {
            String parentPath = new File(metaFile.getBlobPath()).getParent();
            String parentId = pathToIdMap.get(parentPath);

            if (parentId != null) {
                if (!parentPath.equals(inputPath.toString())) {
                    metaFile.setPrevious(parentId);
                } else {
                    metaFile.setPrevious(startId);
                }

                MetaFile parentMetaFile = metaFileMap.get(parentId);
                if (parentMetaFile.getChildren() == null) {
                    parentMetaFile.setChildren(new ArrayList<>());
                }

                parentMetaFile.getChildren().add(metaFile.getId());
            }
        }

        calculateFolderSizes(metaFileMap);

        return metaFiles;
    }

    private static void calculateFolderSizes(Map<String, MetaFile> metaFileMap) {
        for (MetaFile metaFile : metaFileMap.values()) {
            if (metaFile.getChildren() == null) {
                continue;
            }
            calculateFolderSize(metaFile, metaFileMap);
        }
    }

    private static long calculateFolderSize(MetaFile folder, Map<String, MetaFile> metaFileMap) {
        if (folder.getSize() != null) {
            return folder.getSize();
        }

        long totalSize = 0;
        for (String childId : folder.getChildren()) {
            MetaFile child = metaFileMap.get(childId);
            if (child.getChildren() == null) {
                totalSize += child.getSize();
            } else {
                totalSize += calculateFolderSize(child, metaFileMap);
            }
        }

        folder.setSize(totalSize);
        return totalSize;
    }

    public ScanCheckResponse check(String path) {
        try {
            FileSystemManager fsManager = VFS.getManager();
            FileObject startDir = fsManager.resolveFile(path);

            if (!startDir.exists()) {
                return ScanCheckResponse.Builder()
                         .withPath(path)
                         .withExists(false)
                         .withErrorMessage("Path does not exist or is not accessible.")
                         .build();
            }

            if (!startDir.isFolder()) {
                return ScanCheckResponse.Builder()
                         .withPath(path)
                         .withExists(false)
                         .withErrorMessage("Path is not a folder/directory.")
                         .build();
            }

            FileStats stats = calculateFileStats(startDir);

            return ScanCheckResponse.Builder()
                     .withPath(path)
                     .withExists(true)
                     .withFileCount(stats.fileCount)
                     .withDirCount(stats.directoryCount)
                     .withTotalSize(stats.totalSize)
                     .build();
        } catch (FileSystemException e) {
            throw new RuntimeException(e);
        }
    }

    private static FileStats calculateFileStats(FileObject fileObject) throws FileSystemException {
        FileStats stats = new FileStats();

        if (fileObject.exists()) {
            if (fileObject.isFile()) {
                stats.fileCount++;
                stats.totalSize += fileObject.getContent().getSize();
            } else if (fileObject.isFolder()) {
                stats.directoryCount++;
                FileObject[] children = fileObject.getChildren();
                for (FileObject child : children) {
                    FileStats childStats = calculateFileStats(child);
                    stats.fileCount += childStats.fileCount;
                    stats.directoryCount += childStats.directoryCount;
                    stats.totalSize += childStats.totalSize;
                }
            }
        }

        return stats;
    }

    private static class FileStats {
        long fileCount = 0;
        long directoryCount = 0;
        long totalSize = 0;
    }

    @Override
    public MetaFile scan(
      MetaFileConfig config,
      String destinationId,
      Permissions permissions
    ) {
        try {
            FileSystemManager fsManager = VFS.getManager();
            FileObject startDir = fsManager.resolveFile(config.getInputPath());

            if (!startDir.exists()) {
                throw new BadRequestException("Path does not exist or is not accessible to app.");
            }

            if (!startDir.isFolder()) {
                throw new BadRequestException("Path is not a folder/directory.");
            }

            if (permissions.isSufficient()) {
                throw new BadRequestException("Must have at least one read/write permission");
            }

            MetaFile root = metafileRepository.getRootNode();
            Path inputPath = Paths.get(config.getInputPath());

            List<MetaFile> metaFiles = parseDirectory(
              startDir,
              inputPath,
              destinationId != null ? destinationId : root.getId(),
              permissions,
              config
            );

            Optional<MetaFile> start = metaFiles.stream()
                                         .filter(x -> x.getBlobPath().equals(inputPath.toString()))
                                         .findFirst();

            root.getChildren().add(start.get().getId());

            metaFiles.add(root);
            metafileRepository.saveAll(metaFiles);

            return metaFiles.stream()
                     .filter(x -> x.getName().equals(startDir.getName().getBaseName()))
                     .findFirst()
                     .orElseThrow();
        } catch (FileSystemException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public MetaFile processFile(File entity) {
        return null;
    }

    @Override
    public void save(Iterable<MetaFile> metaFiles) {
        this.metafileRepository.saveAll(metaFiles);
    }

    public static void main(String[] args) {
        LocalScanService uploadService = new LocalScanService(null);

        //        uploadService.scan("/Users/admin/Desktop/fagz/Semestar_VI/sdp/zencloud/zendrive-api", "");
    }
}
