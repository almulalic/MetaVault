package com.zendrive.api.core.configuration.vfs;

import com.zendrive.api.core.model.metafile.StorageConfig;
import com.zendrive.api.core.model.metafile.StorageType;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.FileSystemOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@Data
@Configuration
@RequiredArgsConstructor
public class FileSystemOptionsConfig {

	private final FileSystemOptions localFsOptions;
	private final FileSystemOptions s3FsMinioOptions;
	private final FileSystemOptions s3FsAnonymousOptions;

	private final Map<String, FileSystemOptions> s3FsOptionsMap;

	@Autowired
	public FileSystemOptionsConfig(
		FileSystemOptions localFsOptions,
		FileSystemOptions s3FsMinioOptions,
		FileSystemOptions s3FsAnonymousOptions
	) {
		this.localFsOptions = localFsOptions;
		this.s3FsMinioOptions = s3FsMinioOptions;
		this.s3FsAnonymousOptions = s3FsAnonymousOptions;
		this.s3FsOptionsMap = Map.ofEntries(
			Map.entry("local", localFsOptions),
			Map.entry("minio", s3FsMinioOptions),
			Map.entry("anonymous", s3FsAnonymousOptions)
		);
	}

	public FileSystemOptions getS3FsOptions(String key) {
		return s3FsOptionsMap.get(key);
	}

	public FileSystemOptions getFsOptions(StorageConfig storageConfig) {
		switch (storageConfig.getType()) {
			case LOCAL -> {
				return getLocalFsOptions();
			}
			case S3 -> {
				return getS3FsOptions(storageConfig.getCredentials());
			}
		}

		return getLocalFsOptions();
	}
}
