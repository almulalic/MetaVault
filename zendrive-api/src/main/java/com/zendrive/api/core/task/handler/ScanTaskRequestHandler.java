package com.zendrive.api.core.task.handler;

import com.zendrive.api.core.configuration.vfs.FileSystemOptionsConfig;
import com.zendrive.api.core.model.metafile.FileStats;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.core.task.model.request.ScanTaskRequest;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.utils.MetafileUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.*;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@RequiredArgsConstructor
public class ScanTaskRequestHandler extends JobHandler<ScanTaskRequest> {
	private final RoleRepository roleRepository;
	private final MetafileRepository metafileRepository;
	private final FileSystemOptionsConfig fileSystemOptionsConfig;

	@Override
	public void execute(ScanTaskRequest jobRequest) throws Exception {
		try {
			MetaFileConfig config = jobRequest.parameters().getConfig();
			String parentId = jobRequest.parameters().getParentId();
			Permissions permissions = jobRequest.parameters().getPermissions();
			String inputPath = generateValidUri(config.getInputPath(), config.getStorageConfig());

			validateParameters(inputPath, config, permissions);

			LOGGER.info("Initializing 'Scan Task' for directory: '%s'".formatted(inputPath));

			FileSystemManager fsManager = VFS.getManager();
			FileSystemOptions fsOptions = getFileSystemOptions(config.getStorageConfig(), fileSystemOptionsConfig);

			LOGGER.info("VFS Manager initialized.");
			setProgress(4);

			FileObject startDir = fsManager.resolveFile(inputPath, fsOptions);
			LOGGER.info("Start directory: '%s'.".formatted(startDir.getPath()));
			setProgress(6);

			MetaFile parentMetafile = getStartMetafile(parentId)
																	.orElseThrow(() -> new RuntimeException("Parent not found!"));
			LOGGER.info("Start MetaFile: %s'.".formatted(parentMetafile.getShortString()));
			setProgress(10);

			URI inputUri = new URI(inputPath);
			FileStats fileStats = MetafileUtil.calculateFileStats(startDir);
			LOGGER.info("File count: %s.".formatted(fileStats.fileCount));
			LOGGER.info("Directory count %s.".formatted(fileStats.directoryCount));
			LOGGER.info("Total size: %s.".formatted(fileStats.totalSize));

			LOGGER.info("Starting recursive traversal...");

			ConcurrentHashMap<String, MetaFile> metaFileMap = new ConcurrentHashMap<>();
			ConcurrentHashMap<String, String> pathToIdMap = new ConcurrentHashMap<>();
			CopyOnWriteArrayList<MetaFile> metaFiles = new CopyOnWriteArrayList<>();

			FileObject[] files = getFilesFromSource(
				startDir,
				Comparator
					.comparingInt((FileObject file) -> file.getName().getPath().length())
					.thenComparing(file -> file.getName().getPath())
			);

			long progressPerFile = calculateProgressPerFile(files.length, 10, 80);

			Arrays.stream(files)
						.parallel()
						.forEach(file -> {
							try {
								MetaFile metaFile = MetafileUtil.processSingleFile(
									file,
									inputUri,
									parentMetafile.getId(),
									config,
									permissions
								);

								metaFiles.add(metaFile);
								metaFileMap.put(metaFile.getId(), metaFile);
								pathToIdMap.put(file.toString(), metaFile.getId());
							} catch (FileSystemException | URISyntaxException e) {
								throw new RuntimeException(e);
							} finally {
								incrementProgress(progressPerFile);
							}
						});

			MetafileUtil.createParentChildRelations(pathToIdMap, metaFileMap, metaFiles, inputUri);
			MetafileUtil.calculateFolderSizes(metaFileMap);
			MetafileUtil.buildBreadcrumbs(pathToIdMap, metaFiles, inputUri);

			setProgress(90);
			LOGGER.info("Recursive traversal done.");

			MetaFile start = metaFiles.stream()
																.filter(x -> x.getBlobPath().equals(inputUri.toString()))
																.findFirst()
																.orElseThrow(() -> new RuntimeException("Can't find start node!"));

			LOGGER.info("Input Metafile: Name: '%s'".formatted(start.getShortString()));

			LOGGER.info("Saving to ElasticSearch...");
			parentMetafile.getChildren().add(start.getId());
			metaFiles.add(parentMetafile);
			metafileRepository.saveAll(metaFiles);
			LOGGER.info("Done saving to ElasticSearch.");

			setProgress(100);
			LOGGER.info("Completed.");
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		}
	}

	private Optional<MetaFile> getStartMetafile(String parentId) {
		return parentId != null ?
					 metafileRepository.findById(parentId) :
					 metafileRepository.getRootNode();
	}

	private void validateParameters(String inputPath, MetaFileConfig config, Permissions permissions) {
		if (metafileRepository.findByBlobPath(inputPath).isPresent()) {
			throw new IllegalArgumentException("This path is already scanned. Run a re-scan task to update.");
		}

		roleRepository.rolesExist(permissions.getAllRoles());
	}
}
