package com.zendrive.api.core.model.metafile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileStats {
	public int fileCount = 0;
	public int directoryCount = 0;
	public long totalSize = 0;
}
