package com.zendrive.api.rest.models.dto.task;

import com.zendrive.api.core.model.task.SyncConfig;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class EditRecurringTaskDto {
	@Valid
	@NotNull(message = "Sync config must not be null")
	private SyncConfig syncConfig;
}
