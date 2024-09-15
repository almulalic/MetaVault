package com.zendrive.api.rest.models.dto.task;

import com.zendrive.api.core.annotation.ValidClasspath;
import com.zendrive.api.core.model.metafile.Permissions;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class CreateTaskDefinitionDto {
	@NotEmpty(message = "Name must not be empty.")
	private String name;

	@NotNull(message = "Permissions must not be null.")
	private Permissions permissions;

	@NotEmpty(message = "Handler classpath must not be empty.")
	@Pattern(
		regexp = "^[a-zA-Z_][a-zA-Z0-9_]*(\\.[a-zA-Z_][a-zA-Z0-9_]*)*$",
		message = "Handler classpath must be a valid classpath."
	)
	@ValidClasspath(message = "Invalid handler classpath.")
	private String handlerClasspath;

	@NotEmpty(message = "Request classpath must not be empty.")
	@Pattern(
		regexp = "^[a-zA-Z_][a-zA-Z0-9_]*(\\.[a-zA-Z_][a-zA-Z0-9_]*)*$",
		message = "Request classpath must be a valid classpath."
	)
	@ValidClasspath(message = "Invalid request classpath.")
	private String requestClasspath;

	@NotEmpty(message = "Properties classpath must not be empty.")
	@Pattern(
		regexp = "^[a-zA-Z_][a-zA-Z0-9_]*(\\.[a-zA-Z_][a-zA-Z0-9_]*)*$",
		message = "Properties classpath must be a valid classpath."
	)
	@ValidClasspath(message = "Invalid parameters classpath.")
	private String parametersClasspath;
}
