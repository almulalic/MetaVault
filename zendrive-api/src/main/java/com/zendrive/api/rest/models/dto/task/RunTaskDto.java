package com.zendrive.api.rest.models.dto.task;

import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class RunTaskDto {
	@NotEmpty(message = "Definition ID must not be empty!")
	private String definitionId;

	@NotEmpty(message = "Name must not be empty!")
	private String name;

	@NotNull(message = "Parameters must not be null!")
	private ObjectNode parameters;
}
