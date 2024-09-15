package com.zendrive.api;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

public class S3UrlParser {

	public static class ParsedS3Url {
		private final String bucket;
		private final String key;
		private final String endpoint;

		public ParsedS3Url(String bucket, String key, String endpoint) {
			this.bucket = bucket;
			this.key = key;
			this.endpoint = endpoint;
		}

		public String getBucket() {
			return bucket;
		}

		public String getKey() {
			return key;
		}

		public String getEndpoint() {
			return endpoint;
		}

		@Override
		public String toString() {
			return "ParsedS3Url{" +
						 "bucket='" + bucket + '\'' +
						 ", key='" + key + '\'' +
						 ", endpoint='" + endpoint + '\'' +
						 '}';
		}
	}

	public static Optional<ParsedS3Url> parseS3Url(String s3Url) {
		try {
			URI uri = new URI(s3Url);

			String endpoint = uri.getHost();
			String bucket = endpoint;
			String key = uri.getPath();

			if (endpoint.contains(".")) {
				bucket = key.substring(1, endpoint.indexOf("/", 1));
				key = uri.resolve(".").getPath().toString();
			} else {
				endpoint = "s3.amazonaws.com";
			}

			return Optional.of(new ParsedS3Url(bucket, key, endpoint));

		} catch (URISyntaxException e) {
			e.printStackTrace();
			return Optional.empty();
		}
	}

	public static void main(String[] args) {
		String s3Url1 = "s3://minio.local/zendrive/zendrive-ui";
		String s3Url2 = "s3://zendrive/zendrive-ui";

		Optional<ParsedS3Url> parsed1 = parseS3Url(s3Url1);
		Optional<ParsedS3Url> parsed2 = parseS3Url(s3Url2);

		parsed1.ifPresent(System.out::println);
		parsed2.ifPresent(System.out::println);
	}
}
