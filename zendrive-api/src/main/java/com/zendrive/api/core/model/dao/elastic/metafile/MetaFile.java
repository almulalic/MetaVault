package com.zendrive.api.core.model.dao.elastic.metafile;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.configuration.elastic.ElasticObjectNodeConverter;
import com.zendrive.api.core.model.metafile.Breadcrumb;
import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.ValueConverter;

import java.util.List;

@Data
@ToString
@AllArgsConstructor
@Document(indexName = "file_tree")
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class MetaFile {
	@Id
	private String id;
	private String name;
	private String contentType;
	private Long size;
	private Long lastModifiedMs;
	private Long lastSyncMs;
	private String blobPath;
	private String previous;
	private MetaFileConfig config;
	private Permissions permissions;
	private List<String> children;
	private List<Breadcrumb> breadcrumbs;
	private List<String> grants;
	@ValueConverter(ElasticObjectNodeConverter.class)
	private ObjectNode metadata;

	public String getShortString() {
		return String.format("%s:%s:%s", id, name, blobPath);
	}

	public boolean isDirectory() {
		return !isFile();
	}

	public boolean isFile() {
		return children == null;
	}
}
