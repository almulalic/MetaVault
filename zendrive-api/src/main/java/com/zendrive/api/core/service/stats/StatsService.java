package com.zendrive.api.core.service.stats;

import com.zendrive.api.core.configuration.vfs.FileSystemOptionsConfig;
import com.zendrive.api.core.model.metafile.FileStats;
import com.zendrive.api.core.model.metafile.StorageConfig;
import com.zendrive.api.core.utils.MetafileUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.FileSystemOptions;
import org.apache.commons.vfs2.VFS;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {
	private final FileSystemOptionsConfig fileSystemOptionsConfig;

	public FileStats get(String path, StorageConfig storageConfig) throws FileSystemException {
		FileSystemManager fsManager = VFS.getManager();
		FileSystemOptions fsOptions = getFileSystemOptions(storageConfig, fileSystemOptionsConfig);

		return MetafileUtil.calculateFileStats(fsManager.resolveFile(path, fsOptions));
	}

	protected FileSystemOptions getFileSystemOptions(StorageConfig storageConfig, FileSystemOptionsConfig config) {
		return switch (storageConfig.getType()) {
			case LOCAL -> config.getLocalFsOptions();
			case S3 -> config.getS3FsOptions(storageConfig.getCredentials().toLowerCase());
			default -> new FileSystemOptions();
		};
	}
}
