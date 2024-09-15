package com.zendrive.api.core.task.handler;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.StorageType;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.request.ImageMetadataExtractTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import org.jobrunr.jobs.context.JobDashboardLogger;
import org.jobrunr.jobs.context.JobDashboardProgressBar;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

@Component
public class ImageMetadataExtractTaskRequestHandler implements JobRequestHandler<ImageMetadataExtractTaskRequest> {
	private final MetafileRepository metafileRepository;
	private final MetafileService metafileService;

	private JobDashboardLogger LOGGER;
	private JobDashboardProgressBar progressBar;

	public ImageMetadataExtractTaskRequestHandler(
		MetafileRepository metafileRepository,
		MetafileService metafileService
	) {
		super();
		this.metafileRepository = metafileRepository;
		this.metafileService = metafileService;
	}

	public void run(ImageMetadataExtractTaskRequest jobRequest) {
		try {
			String directoryId = jobRequest.parameters().getDirectoryId();
			String destinationKey = jobRequest.parameters().getDestinationKey();
			boolean override = jobRequest.parameters().isOverride();

			this.LOGGER = jobContext().logger();
			this.progressBar = jobContext().progressBar(10000);

			LOGGER.info("Initializing 'Metadata Extract Task' for directory: " + directoryId);

			MetaFile start = metafileService.get(directoryId)
																			.orElseThrow(() -> new BadRequestException("Start not found"));
			LOGGER.info("Starting from %s".formatted(start.getId()));
			progressBar.setProgress(500);

			List<MetaFile> metaFiles = metafileService.recursiveList(directoryId)
																								.stream()
																								.filter(x -> x.getChildren() == null)
																								.toList();
			long progressPerFile = calculateProgressPerFile(metaFiles.size(), 1000, 9000);
			LOGGER.info("Got %s metafiles.".formatted(metaFiles.size()));
			progressBar.setProgress(1000);

			LOGGER.info("Generating metadata...");
			for (MetaFile metaFile : metaFiles) {
				// If metadata contains the key and override is set to false, skip it
				if (metaFile.getMetadata().has(destinationKey) && !override) {
					continue;
				}

				try {
					InputStream inputStream = getInputStream(metaFile.getBlobPath(), metaFile.getConfig()
																																									 .getStorageConfig()
																																									 .getType());

					Metadata metadata = ImageMetadataReader.readMetadata(inputStream);

					for (Directory directory : metadata.getDirectories()) {
						for (Tag tag : directory.getTags()) {
							System.out.println(tag);
						}
					}

					//					metaFile.getMetadata().set(
					//						destinationKey,
					//						ImageMetadataReader.readMetadata(inputStream).toString()
					//					);
				} catch (Exception ex) {
					LOGGER.error("Got exception while processing %s.\nMessage: %s".formatted(metaFile.getId(), ex.getMessage()));
				}

				progressBar.setProgress(progressBar.getProgress() + progressPerFile);
			}

			LOGGER.info("Metadata successfully generated. Saving to elastic...");
			progressBar.setProgress(9500);

			//			metafileRepository.saveAll(metaFiles);

			progressBar.setProgress(10000);
		} catch (Exception ex) {
			LOGGER.error("An unexpected error occurred!");
			LOGGER.error("Message: %s!".formatted(ex.getMessage()));
			LOGGER.error("Stack Trace: %s!".formatted(Arrays.toString(ex.getStackTrace())));
			progressBar.setProgress(10000);

			throw ex;
		}
	}

	private static InputStream getInputStream(String path, StorageType storageType) throws FileNotFoundException {
		switch (storageType) {
			case LOCAL:
				return new FileInputStream(path);
			default:
				throw new IllegalArgumentException();
		}
	}

	private static long calculateProgressPerFile(int totalFiles, int startProgress, int endProgress) {
		return Math.round((float) totalFiles / (endProgress - startProgress));
	}
}
