package com.zendrive.api.core.utils;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.*;
import org.apache.commons.vfs2.FileContent;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;

public class MetafileUtil {
	public static List<Breadcrumb> generateBreadcrumbs(FileObject file, URI inputUri) {
		return Arrays.stream(file.getPath().toString().replaceFirst(getParent(inputUri.getPath()), "").split("/"))
								 .filter(x -> !x.isEmpty())
								 .map(x -> new Breadcrumb(null, x))
								 .collect(Collectors.toList());
	}

	public static FileStats calculateFileStats(FileObject fileObject) throws FileSystemException {
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
		} else {
			throw new IllegalArgumentException("Path doesn't exist");
		}

		return stats;
	}

	public static void calculateFolderSizes(Map<String, MetaFile> metaFileMap) {
		for (MetaFile metaFile : metaFileMap.values()) {
			if (metaFile.getChildren() == null) {
				continue;
			}

			calculateFolderSize(metaFile, metaFileMap);
		}
	}

	public static long calculateFolderSize(MetaFile folder, Map<String, MetaFile> metaFileMap) {
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

	public static void associateChildrenWithParent(
		MetaFile parentMetafile,
		List<MetaFile> metaFiles
	) {
		List<String> children = metaFiles.stream()
																		 .filter(x -> x.getPrevious().equals(parentMetafile.getId()))
																		 .map(MetaFile::getId)
																		 .toList();

		parentMetafile.setChildren(children);
	}

	public static MetaFile processSingleFile(
		FileObject file,
		URI inputPath,
		String parentId,
		MetaFileConfig config,
		Permissions permissions
	) throws FileSystemException, URISyntaxException {
		FileContent content = file.getContent();
		List<Breadcrumb> breadcrumbs = MetafileUtil.generateBreadcrumbs(file, inputPath);

		return MetaFile.Builder()
									 .withId(UUID.randomUUID().toString())
									 .withName(file.getName().getBaseName())
									 .withContentType(file.getContent().getContentInfo().getContentType())
									 .withSize(file.isFile() ? content.getSize() : null)
									 .withLastModifiedMs(content.getLastModifiedTime())
									 .withLastSyncMs(System.currentTimeMillis()) // TODO Timezone
									 .withConfig(config)
									 .withBlobPath(file.toString())
									 .withPrevious(parentId)
									 .withChildren(file.isFolder() ? new ArrayList<>() : null)
									 .withBreadcrumbs(breadcrumbs)
									 .withPermissions(permissions)
									 .withMetadata(JsonNodeFactory.instance.objectNode())
									 .build();
	}

	public static void createParentChildRelations(
		Map<String, String> pathToIdMap,
		Map<String, MetaFile> metaFileMap,
		List<MetaFile> metaFiles,
		URI inputPath
	) {
		String startId = pathToIdMap.get(inputPath.toString());

		for (MetaFile metaFile : metaFiles) {
			String parentPath = getParent(metaFile.getBlobPath());
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
	}

	public static void buildBreadcrumbs(
		Map<String, String> pathToIdMap,
		List<MetaFile> metaFiles,
		URI inputUri
	) {
		for (MetaFile metaFile : metaFiles) {
			StringBuilder breadcrumbPathBuilder = new StringBuilder(getParent(inputUri.toString()));
			for (Breadcrumb breadcrumb : metaFile.getBreadcrumbs()) {
				breadcrumbPathBuilder.append("/").append(breadcrumb.getName());
				String breadcrumbPath = breadcrumbPathBuilder.toString();
				String breadcrumbId = pathToIdMap.get(breadcrumbPath);
				breadcrumb.setId(breadcrumbId);
			}
		}
	}

	public static String getParent(String input) {
		if (input == null || input.isEmpty()) {
			throw new IllegalArgumentException("Input string cannot be null or empty");
		}

		int lastSlashIndex = input.lastIndexOf('/');
		if (lastSlashIndex == -1) {
			return input;
		}

		return input.substring(0, lastSlashIndex);
	}
}
