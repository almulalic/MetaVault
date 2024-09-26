package com.zendrive.api.core.task.handler;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.task.ConflictStrategy;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.parameters.tesseract.TesseractParameters;
import com.zendrive.api.core.task.model.request.TesseractOcrTaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.*;
import java.util.*;

@Component
@RequiredArgsConstructor
public class TesseractOcrTaskRequestHandler extends JobHandler<TesseractOcrTaskRequest> {
	private final MetafileService metafileService;
	private final MetafileRepository metafileRepository;
	private final List<String> extensionsWhitelist = new ArrayList<>(Arrays.asList("pdf", "png", "jpg", "jpeg"));

	@Override
	public void execute(TesseractOcrTaskRequest jobRequest) {
		try {
			String directoryId = jobRequest.parameters().getDirectoryId();
			String destinationKey = jobRequest.parameters().getDestinationKey();
			ConflictStrategy keyConflictStrategy = jobRequest.parameters().getConflictStrategy();
			//			List<String> extensionsWhitelist = jobRequest.parameters().getExtensionsWhitelist();
			TesseractParameters tesseractParameters = jobRequest.parameters().getTesseractParameters();

			LOGGER.info("Initializing 'Tesseract OCR task' for directory: " + directoryId);

			MetaFile start = metafileService.get(directoryId);
			LOGGER.info("Starting from %s".formatted(start.getId()));
			progressBar.setProgress(5);

			List<MetaFile> metaFiles = metafileService.recursiveList(directoryId)
																								.stream()
																								.filter(x -> x.getChildren() == null)
																								.toList();

			LOGGER.info("Got %s metafiles before filter.".formatted(metaFiles.size()));

			if (extensionsWhitelist.size() > 0) {
				metaFiles = applyExtensionsWhitelist(metaFiles, extensionsWhitelist);
			}

			if (keyConflictStrategy == ConflictStrategy.PANIC) {
				ensureDestinationKeyUnique(metaFiles, destinationKey);
			}

			LOGGER.info("Got %s metafiles after file.".formatted(metaFiles.size()));
			long progressPerFile = calculateProgressPerFile(metaFiles.size(), 10, 90);
			setProgress(10);

			LOGGER.info("Initialized tesseract with parameters %s.".formatted(tesseractParameters.toString()));

			LOGGER.info("Running Tesseract OCR extracting...");
			for (MetaFile metaFile : metaFiles) {
				try {
					if (metaFile.getMetadata().has(destinationKey) && keyConflictStrategy == ConflictStrategy.IGNORE) {
						continue;
					}

					InputStream inputStream = getInputStream(metaFile.getBlobPath(), metaFile.getConfig()
																																									 .getStorageConfig()
																																									 .getType());

					String result = runOcr(inputStream, StringUtils.getFilenameExtension(metaFile.getBlobPath()));

					ObjectNode metadata = metaFile.getMetadata().put(destinationKey, result);
					metaFile.setMetadata(metadata);
				} catch (Exception ex) {
					LOGGER.error("Got exception while processing %s.\nMessage: %s".formatted(
						metaFile.getShortString(),
						ex.getMessage()
					));
				}

				incrementProgress(progressPerFile);
			}

			LOGGER.info("Metadata successfully generated. Saving to elastic...");
			setProgress(95);

			metafileRepository.saveAll(metaFiles);

			setProgress(100);
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		}
	}

	private static final Runtime runtime = Runtime.getRuntime();

	public static String runOcr(InputStream fileInputStream, String extension) throws InterruptedException, IOException {
		String randomFileName = "ocr_input_" + UUID.randomUUID() + ".tmp." + extension;

		File tempFile = new File("/tmp", randomFileName);
		try (OutputStream outStream = new FileOutputStream(tempFile)) {
			fileInputStream.transferTo(outStream);
		}

		String filePath = tempFile.getAbsolutePath();
		String base64EncodedPath = Base64.getEncoder().encodeToString(filePath.getBytes());

		String[] shellCmd = new String[] {
			"/bin/bash",
			"-c",
			String.join(" ", new String[] {
				"/Users/admin/.pyenv/shims/python3",
				"/Users/admin/Desktop/fagz/Semestar_VI/sdp/zencloud/zendrive-api/lib/python/tesseract/tesseract.py",
				base64EncodedPath
			})
		};

		Process process = runtime.exec(shellCmd);
		process.waitFor();

		tempFile.delete();

		if (process.exitValue() != 0) {
			throw new RuntimeException("Error: " + new String(process.getErrorStream().readAllBytes()));
		} else {
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder output = new StringBuilder();
			String line;

			while ((line = stdInput.readLine()) != null) {
				output.append(line);
			}

			stdInput.close();
			return new String(Base64.getDecoder().decode(output.toString().trim()));
		}
	}
}
