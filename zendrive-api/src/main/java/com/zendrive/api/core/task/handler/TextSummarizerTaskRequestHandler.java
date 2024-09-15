package com.zendrive.api.core.task.handler;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.task.ConflictStrategy;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.parameters.tesseract.TesseractParameters;
import com.zendrive.api.core.task.model.request.TesseractOcrTaskRequest;
import com.zendrive.api.core.task.model.request.TextSummarizerTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Component
public class TextSummarizerTaskRequestHandler extends JobHandler<TextSummarizerTaskRequest> {
	private final MetafileRepository metafileRepository;
	private final MetafileService metafileService;

	public TextSummarizerTaskRequestHandler(
		MetafileRepository metafileRepository,
		MetafileService metafileService
	) {
		this.metafileRepository = metafileRepository;
		this.metafileService = metafileService;
	}

	@Override
	public void execute(TextSummarizerTaskRequest jobRequest) throws IOException, InterruptedException {
		try {
			String directoryId = jobRequest.parameters().getDirectoryId();
			String destinationKey = jobRequest.parameters().getDestinationKey();
			ConflictStrategy keyConflictStrategy = jobRequest.parameters().getConflictStrategy();
			List<String> extensionsWhitelist = jobRequest.parameters().getExtensionsWhitelist()
																									 .stream()
																									 .filter(x -> !x.isEmpty())
																									 .toList();

			LOGGER.info("Initializing 'Text Summarizer Task' for directory: " + directoryId);

			MetaFile start = metafileService.get(directoryId)
																			.orElseThrow(() -> new BadRequestException("Start not found"));
			LOGGER.info("Starting from %s".formatted(start.getId()));
			progressBar.setProgress(5);

			List<MetaFile> metaFiles = metafileService.recursiveList(directoryId)
																								.stream()
																								.filter(x -> x.getChildren() == null)
																								.toList();

			LOGGER.info("Got %s metafiles before filter.".formatted(metaFiles.size()));

			if (extensionsWhitelist.size() > 0) {
				LOGGER.info("Applying extension whitelist filter. Allowed extensions: %s".formatted(extensionsWhitelist));

				metaFiles = metaFiles.stream()
														 .filter(x -> extensionsWhitelist.contains(StringUtils.getFilenameExtension(x.getBlobPath())))
														 .toList();
			}

			if (keyConflictStrategy == ConflictStrategy.PANIC) {
				ensureDestinationKeyUnique(metaFiles, destinationKey);
			}

			LOGGER.info("Got %s metafiles after filter.".formatted(metaFiles.size()));
			long progressPerFile = calculateProgressPerFile(metaFiles.size(), 10, 50);
			setProgress(10);

			LOGGER.info("Initialized Text Summarizer with parameters %s.".formatted(jobRequest.parameters()));

			LOGGER.info("Running Text Summarizer extracting...");
			List<InputStreamResource> inputStreamResources = new ArrayList<>();

			for (MetaFile metaFile : metaFiles) {
				try {
					if (metaFile.getMetadata().has(destinationKey) && keyConflictStrategy == ConflictStrategy.IGNORE) {
						continue;
					}

					inputStreamResources.add(
						new InputStreamResource(
							getInputStream(metaFile.getBlobPath(), metaFile.getConfig().getStorageConfig().getType()),
							metaFile
						)
					);
				} catch (Exception ex) {
					LOGGER.error("Got exception while processing %s.\nMessage: %s".formatted(metaFile.getId(), ex.getMessage()));
				}

				incrementProgress(progressPerFile);
			}

			progressPerFile = calculateProgressPerFile(inputStreamResources.size(), 50, 90);
			for (InputStreamResource inputStreamResource : inputStreamResources) {
				try {
					String input = new String(inputStreamResource.inputStream.readAllBytes(), StandardCharsets.UTF_8);
					String summary = summarizeText(input);

					ObjectNode metadata = inputStreamResource.metaFile.getMetadata().put(destinationKey, summary);
					inputStreamResource.metaFile.setMetadata(metadata);
				} finally {
					incrementProgress(progressPerFile);
				}
			}

			LOGGER.info("Metadata successfully generated. Saving to elastic...");
			setProgress(95);

			metafileRepository.saveAll(inputStreamResources.stream().map(x -> x.metaFile).toList());

			setProgress(100);
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		}
	}

	@Data
	@AllArgsConstructor
	private class InputStreamResource {
		private InputStream inputStream;
		private MetaFile metaFile;
	}

	private static final Runtime runtime = Runtime.getRuntime();

	public static String summarizeText(String text) throws InterruptedException, IOException {
		String[] shellCmd = new String[] {
			"/bin/bash",
			"-c",
			String.join(" ", new String[] {
				"/Users/admin/.pyenv/shims/python3",
				"/Users/admin/Desktop/fagz/Semestar_VI/sdp/zencloud/zendrive-api/lib/python/text_summarizer/summarizer.py",
				Base64.getEncoder().encodeToString(text.getBytes())
			})
		};

		Process process = runtime.exec(shellCmd);
		process.waitFor();

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
