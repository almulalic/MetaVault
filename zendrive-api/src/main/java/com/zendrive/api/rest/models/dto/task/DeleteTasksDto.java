package com.zendrive.api.rest.models.dto.task;

import lombok.*;

import java.util.List;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class DeleteTasksDto {
	private List<String> ids;
}
