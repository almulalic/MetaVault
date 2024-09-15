package com.zendrive.api.core.model.dao.elastic.task;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zendrive.api.core.configuration.elastic.ElasticObjectNodeConverter;
import com.zendrive.api.core.model.metafile.Permissions;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.ValueConverter;

@Data
@ToString
@AllArgsConstructor
@Document(indexName = "task_definitions")
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class TaskDefinition {
	@Id
	private String id;
	private String name;
	private Long createdBy;
	private Permissions permissions;
	private String handlerClasspath;
	private String requestClasspath;
	private String parametersClasspath;
	private String createdAt;
	private String updatedAt;
	@ValueConverter(ElasticObjectNodeConverter.class)
	private ObjectNode properties;
}
