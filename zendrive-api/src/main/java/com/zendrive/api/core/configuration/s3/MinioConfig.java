package com.zendrive.api.core.configuration.s3;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "aws.s3.minio")
public class MinioConfig {
	@Value("aws.s3.minio.accessKey")
	private String accessKey;
	@Value("aws.s3.minio.secretKey")
	private String secretKey;
	@Value("aws.s3.minio.bucketName")
	private String bucketName;
}
