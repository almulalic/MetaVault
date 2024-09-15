package com.zendrive.api.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.github.vfss3.S3FileSystemOptions;
import com.github.vfss3.shaded.com.amazonaws.auth.BasicAWSCredentials;
import org.apache.commons.vfs2.FileSystemOptions;

public class MinioConfig {
	public static FileSystemOptions s3FsMinioOptions() {
		S3FileSystemOptions s3FsOptions = new S3FileSystemOptions();

		s3FsOptions.setUseHttps(false);
		s3FsOptions.setServerSideEncryption(false);
		s3FsOptions.setCreateBucket(true);
		s3FsOptions.setCredentialsProvider(
			new AWSStaticCredentialsProvider(
				new BasicAWSCredentials("minioadmin", "minioadmin")
			)
		);

		return s3FsOptions.toFileSystemOptions();
	}
}
