package com.zendrive.api.core.task.handler;

import com.zendrive.api.core.configuration.vfs.FileSystemOptionsConfig;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.StorageConfig;
import com.zendrive.api.core.model.metafile.StorageType;
import com.zendrive.api.core.service.s3.S3Utils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemOptions;
import org.apache.commons.vfs2.Selectors;
import org.jobrunr.jobs.context.JobContext;
import org.jobrunr.jobs.context.JobDashboardLogger;
import org.jobrunr.jobs.context.JobDashboardProgressBar;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.FileInputStream;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import static com.zendrive.api.core.utils.StringUtil.removeLeadingSlash;
import static com.zendrive.api.core.utils.StringUtil.removeTrailingSlash;

@Component
@RequiredArgsConstructor
public class JobHandler<T extends JobRequest> implements JobRequestHandler<T> {
	protected String name;
	protected JobDashboardLogger LOGGER;
	protected JobDashboardProgressBar progressBar;
	protected JobContext jobContext;
	protected long PROGRESS_MAX = 10000;
	protected long PROGRESS_MULTIPLIER = PROGRESS_MAX / 100;
	protected S3Client s3Client;

	@Override
	public void run(T jobRequest) throws Exception {
		initialize(jobContext());
		execute(jobRequest);
		progressBar.setProgress(PROGRESS_MAX);
		Thread.sleep(1000);
	}

	protected void initialize(JobContext jobContext) {
		this.jobContext = jobContext;
		this.LOGGER = jobContext.logger();
		this.progressBar = jobContext.progressBar(PROGRESS_MAX);
		this.progressBar.setProgress(0);
	}

	protected void setS3Client(S3Client s3Client) {
		this.s3Client = s3Client;
	}

	protected long calculateProgressPerFile(int totalFiles, int startProgress, int endProgress) {
		return Math.round((float) totalFiles / (endProgress * PROGRESS_MULTIPLIER - startProgress * PROGRESS_MULTIPLIER));
	}

	protected void setProgress(long progress) {
		if (progress < 0 || progress > 100) {
			throw new RuntimeException("Progress must be in the 0-100 range.");
		}

		this.progressBar.setProgress(PROGRESS_MULTIPLIER * progress);
	}

	protected void incrementProgress(long increment) {
		long currentProgress = this.progressBar.getProgress();

		if (increment < 0 || increment > 100 || currentProgress + increment > 100) {
			throw new RuntimeException(
				"Increment and value after increment must be in the 0-100 range.\nIncrement: %s, Current: %s".formatted(
					increment, currentProgress
				)
			);
		}

		this.progressBar.setProgress(currentProgress + increment);
	}

	protected void ensureDestinationKeyUnique(List<MetaFile> metaFiles, String destinationKey) {
		boolean keyExists = metaFiles.stream()
																 .anyMatch(metaFile -> metaFile.getMetadata().has(destinationKey));

		if (keyExists) {
			throw new RuntimeException(
				String.format(
					"One or more files already contain the metadata key '%s' while the key strategy is set to PANIC.",
					destinationKey
				)
			);
		}
	}

	protected InputStream getInputStream(String path, StorageType storageType) throws IOException {
		switch (storageType) {
			case LOCAL:
				return new FileInputStream(path.replaceFirst("file://", ""));
			case S3:
				return S3Utils.getInputStream(s3Client, path);
			default:
				throw new IllegalArgumentException();
		}
	}

	protected void handleException(Exception ex) {
		LOGGER.error("An unexpected error occurred!");
		LOGGER.error("Message: %s!".formatted(ex.getMessage()));
		LOGGER.error("Stack Trace: %s!".formatted(Arrays.toString(ex.getStackTrace())));
	}

	protected void execute(T jobRequest) throws Exception {
	}

	public static FileObject[] getFilesFromSource(FileObject start, Comparator<FileObject> comparator)
		throws FileSystemException {
		return Arrays.stream(start.findFiles(Selectors.SELECT_ALL))
								 .sorted(comparator)
								 .toArray(FileObject[]::new);
	}

	protected FileSystemOptions getFileSystemOptions(StorageConfig storageConfig, FileSystemOptionsConfig config) {
		return switch (storageConfig.getType()) {
			case LOCAL -> config.getLocalFsOptions();
			case S3 -> config.getS3FsOptions(storageConfig.getCredentials().toLowerCase());
			default -> new FileSystemOptions();
		};
	}

	public static String generateValidUri(String input, StorageConfig storageConfig) {
		input = removeTrailingSlash(input);

		switch (storageConfig.getType()) {
			case S3 -> {
				input = removeLeadingSlash(input);

				if (!input.startsWith("s3://")) {
					input = "s3://" + input;
				}
			}
		}

		return input;
	}
}
