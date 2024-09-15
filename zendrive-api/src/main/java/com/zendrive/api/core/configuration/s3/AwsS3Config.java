package com.zendrive.api.core.configuration.s3;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import com.zendrive.api.core.configuration.s3.MinioConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
@RequiredArgsConstructor
public class AwsS3Config {
	private final MinioConfig minioConfig;

	@Bean
	public S3Client minioS3Client() {
		return S3Client.builder()
									 .endpointOverride(URI.create("http://minio.local"))
									 .region(Region.US_EAST_1)
									 .credentialsProvider(
										 StaticCredentialsProvider.create(
											 AwsBasicCredentials.create(
												 minioConfig.getAccessKey(),
												 minioConfig.getSecretKey()
											 )
										 )
									 )
									 .forcePathStyle(true)
									 .build();
	}
}

