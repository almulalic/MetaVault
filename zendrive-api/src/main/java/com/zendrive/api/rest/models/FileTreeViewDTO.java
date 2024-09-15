package com.zendrive.api.rest.models;

import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileTreeViewDTO {
	private List<MetaFile> previousView;
	private MetaFile current;
	private List<MetaFile> currentView;
	private List<MetaFile> nextView;
}
