package com.zendrive.api.core.task.handler;

import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.task.ConflictStrategy;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.parameters.tesseract.TesseractParameters;
import com.zendrive.api.core.task.model.request.TesseractOcrTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.io.InputStream;
import java.util.List;

@Component
public class TesseractOcrTaskRequestHandler extends JobHandler<TesseractOcrTaskRequest> {
	private final MetafileRepository metafileRepository;
	private final MetafileService metafileService;

	public TesseractOcrTaskRequestHandler(
		MetafileRepository metafileRepository,
		MetafileService metafileService
	) {
		this.metafileRepository = metafileRepository;
		this.metafileService = metafileService;
	}

	@Override
	public void execute(TesseractOcrTaskRequest jobRequest) {
		try {
			String directoryId = jobRequest.parameters().getDirectoryId();
			String destinationKey = jobRequest.parameters().getDestinationKey();
			ConflictStrategy keyConflictStrategy = jobRequest.parameters().getConflictStrategy();
			List<String> extensionsWhitelist = jobRequest.parameters().getExtensionsWhitelist();
			TesseractParameters tesseractParameters = jobRequest.parameters().getTesseractParameters();

			LOGGER.info("Initializing 'Tesseract OCR task' for directory: " + directoryId);

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

			LOGGER.info("Got %s metafiles after file.".formatted(metaFiles.size()));
			long progressPerFile = calculateProgressPerFile(metaFiles.size(), 10, 90);
			setProgress(10);

			Tesseract tesseract = new Tesseract();
			tesseract.setDatapath("/usr/local/Cellar/tesseract/5.4.1/share/tessdata/");
			tesseract.setLanguage(tesseractParameters.getLanguage());
			//			tesseract.setPageSegMode(tesseractParameters.getPageSegModel());
			//			tesseract.setOcrEngineMode(tesseractParameters.getOcrEngineModel());
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

					String result = tesseract.doOCR(ImageIO.read(inputStream));

					System.out.println(result);
				} catch (Exception ex) {
					LOGGER.error("Got exception while processing %s.\nMessage: %s".formatted(metaFile.getId(), ex.getMessage()));
				}

				incrementProgress(progressPerFile);
			}

			LOGGER.info("Metadata successfully generated. Saving to elastic...");
			setProgress(95);

			//			metafileRepository.saveAll(metaFiles);

			setProgress(100);
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		}
	}
}
