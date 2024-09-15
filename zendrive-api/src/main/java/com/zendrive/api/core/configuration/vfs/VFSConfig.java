package com.zendrive.api.core.configuration.vfs;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.github.vfss3.S3FileSystemOptions;
import com.github.vfss3.shaded.com.amazonaws.auth.AnonymousAWSCredentials;
import com.github.vfss3.shaded.com.amazonaws.auth.BasicAWSCredentials;
import com.zendrive.api.core.configuration.s3.MinioConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.FileSystemOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@RequiredArgsConstructor
public class VFSConfig {
	private final MinioConfig minioConfig;

	@Bean
	public FileSystemOptions localFsOptions() {
		return new FileSystemOptions();
	}

	@Bean
	public FileSystemOptions s3FsMinioOptions() {
		S3FileSystemOptions s3FsOptions = new S3FileSystemOptions();

		s3FsOptions.setUseHttps(false);
		s3FsOptions.setServerSideEncryption(false);
		s3FsOptions.setCreateBucket(true);
		s3FsOptions.setCredentialsProvider(
			new AWSStaticCredentialsProvider(
				new BasicAWSCredentials(minioConfig.getAccessKey(), minioConfig.getSecretKey())
			)
		);

		return s3FsOptions.toFileSystemOptions();
	}

	@Bean
	public FileSystemOptions s3FsAnonymousOptions() {
		S3FileSystemOptions s3FsOptions = new S3FileSystemOptions();

		s3FsOptions.setUseHttps(true);
		s3FsOptions.setServerSideEncryption(false);
		s3FsOptions.setCreateBucket(true);
		s3FsOptions.setCredentialsProvider(new AWSStaticCredentialsProvider(new AnonymousAWSCredentials()));

		return s3FsOptions.toFileSystemOptions();
	}
}
