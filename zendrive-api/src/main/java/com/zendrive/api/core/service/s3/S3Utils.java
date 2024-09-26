package com.zendrive.api.core.service.s3;

import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class S3Utils {
	private static final Pattern URL_PATTERN = Pattern.compile(
		"s3:\\/\\/(?<endpoint>[a-zA-Z0-9\\.\\-]+)\\/(?<bucket>[a-z\\-0-9\\.]+)\\/(?<key>.*)?");

	private record S3ObjectInfo(String endpoint, String bucketName, String key) {
	}

	public static Resource getResource(
		S3Client s3Client,
		String url
	) throws IOException {
		S3ObjectInfo objectInfo = parseS3Url(url);

		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
																												.bucket(objectInfo.bucketName)
																												.key(objectInfo.key)
																												.build();

		return new ByteArrayResource(s3Client.getObject(getObjectRequest).readAllBytes());
	}

	public static InputStream getInputStream(
		S3Client s3Client,
		String url
	) throws IOException {
		S3ObjectInfo objectInfo = parseS3Url(url);

		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
																												.bucket(objectInfo.bucketName)
																												.key(objectInfo.key)
																												.build();

		return new ByteArrayInputStream(s3Client.getObject(getObjectRequest).readAllBytes());
	}

	private static S3ObjectInfo parseS3Url(String s3Url) {
		Matcher matcher = URL_PATTERN.matcher(s3Url);

		if (matcher.matches()) {
			return new S3ObjectInfo(
				matcher.group("endpoint"),
				matcher.group("bucket"),
				matcher.group("key")
			);
		} else {
			throw new ZendriveException(
				"Invalid S3 URL. Make sure its in the full format (with region and endpoint).",
				ZendriveErrorCode.INVALID_ARGUMENTS
			);
		}
	}
}
