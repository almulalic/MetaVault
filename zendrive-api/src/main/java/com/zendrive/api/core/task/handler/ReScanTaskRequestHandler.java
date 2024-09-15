package com.zendrive.api.core.task.handler;

import com.zendrive.api.core.configuration.vfs.FileSystemOptionsConfig;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.FileStats;
import com.zendrive.api.core.model.task.ConflictStrategy;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.request.ReScanTaskRequest;
import com.zendrive.api.core.utils.MetafileUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.*;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import static com.zendrive.api.core.utils.FormatUtil.convertBytes;

@Component
@RequiredArgsConstructor
public class ReScanTaskRequestHandler extends JobHandler<ReScanTaskRequest> {
	private final MetafileRepository metafileRepository;
	private final MetafileService metafileService;
	private final FileSystemOptionsConfig fileSystemOptionsConfig;

	@Override
	public void execute(ReScanTaskRequest jobRequest) throws Exception {
		try {
			LOGGER.info("Initializing 'Re-Scan Task'");

			String directoryId = jobRequest.parameters().getDirectoryId();
			ConflictStrategy fileConflictStrategy = jobRequest.parameters().getFileConflictStrategy();

			validateParameters(directoryId);

			MetaFile parentMetafile = getStartMetafile(directoryId)
																	.orElseThrow(() -> new RuntimeException("Parent not found!"));

			FileSystemManager fsManager = VFS.getManager();
			FileSystemOptions fsOptions = getFileSystemOptions(
				parentMetafile.getConfig().getStorageConfig(),
				fileSystemOptionsConfig
			);

			LOGGER.info("VFS Manager initialized.");
			setProgress(2);

			List<MetaFile> existingMetafiles = metafileService.recursiveList(directoryId);

			LOGGER.info("Start Metafile: %s.".formatted(parentMetafile.getShortString()));
			setProgress(4);

			FileObject startDir = fsManager.resolveFile(
				parentMetafile.getConfig().getInputPath(),
				fsOptions
			);
			LOGGER.info("Start Directory: '%s'.".formatted(startDir.getPath()));
			setProgress(10);

			URI inputUri = new URI(parentMetafile.getBlobPath());
			FileStats fileStats = MetafileUtil.calculateFileStats(startDir);
			LOGGER.info("Existing metafiles count: %s.".formatted(existingMetafiles.size()));
			LOGGER.info("File count: %s.".formatted(fileStats.fileCount));
			LOGGER.info("Directory count %s.".formatted(fileStats.directoryCount));
			LOGGER.info("Total size: %s.".formatted(convertBytes(fileStats.totalSize)));

			LOGGER.info("Starting recursive traversal...");

			ConcurrentHashMap<String, MetaFile> metaFileMap = new ConcurrentHashMap<>();
			ConcurrentHashMap<String, String> pathToIdMap = new ConcurrentHashMap<>();
			CopyOnWriteArrayList<MetaFile> outputMetafiles = new CopyOnWriteArrayList<>();

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
							Optional<MetaFile> existingMetafile = existingMetafiles.stream()
																																		 .filter(x -> x.getBlobPath()
																																									 .equals(file.toString())
																																		 )
																																		 .findFirst();

							if (existingMetafile.isPresent() &&
									(
										fileConflictStrategy == ConflictStrategy.IGNORE ||
										existingMetafile.get().getChildren() != null ||
										existingMetafile.get().getId().equals(parentMetafile.getId())
									)
							) {
								MetaFile metaFile = existingMetafile.get();
								metaFile.setSize(null); //todo fix recalculating
								outputMetafiles.add(metaFile);
								metaFileMap.put(metaFile.getId(), metaFile);
								pathToIdMap.put(file.toString(), metaFile.getId());
								return;
							}

							try {
								MetaFile metaFile = MetafileUtil.processSingleFile(
									file,
									inputUri,
									parentMetafile.getId(),
									parentMetafile.getConfig(),
									parentMetafile.getPermissions()
								);

								existingMetafile.ifPresent(value -> {
									metaFile.setId(value.getId());
									metaFile.setMetadata(value.getMetadata());
								});

								outputMetafiles.add(metaFile);
								metaFileMap.put(metaFile.getId(), metaFile);
								pathToIdMap.put(file.toString(), metaFile.getId());
							} catch (FileSystemException | URISyntaxException e) {
								throw new RuntimeException(e);
							} finally {
								incrementProgress(progressPerFile);
							}
						});

			MetafileUtil.createParentChildRelations(pathToIdMap, metaFileMap, outputMetafiles, inputUri);
			MetafileUtil.calculateFolderSizes(metaFileMap);
			MetafileUtil.associateChildrenWithParent(parentMetafile, outputMetafiles);
			MetafileUtil.buildBreadcrumbs(pathToIdMap, outputMetafiles, inputUri);

			setProgress(90);
			LOGGER.info("Recursive traversal done.");

			LOGGER.info("Saving to ElasticSearch...");
			metafileRepository.saveAll(outputMetafiles);
			LOGGER.info("Done saving to ElasticSearch.");

			setProgress(100);
			LOGGER.info("Completed.");
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		}
	}

	private void validateParameters(String directoryId) {
		Optional<MetaFile> optionalMetaFile = metafileRepository.findById(directoryId);

		if (optionalMetaFile.isEmpty()) {
			throw new IllegalArgumentException("This path was not scanned before. Run a scan task first");
		}

		MetaFile startMetafile = optionalMetaFile.get();

		if (startMetafile.isFile()) {
			throw new IllegalArgumentException("Provided path must be a directory");
		}
	}

	private Optional<MetaFile> getStartMetafile(String parentId) {
		return parentId != null ?
					 metafileRepository.findById(parentId) :
					 metafileRepository.getRootNode();
	}
}
