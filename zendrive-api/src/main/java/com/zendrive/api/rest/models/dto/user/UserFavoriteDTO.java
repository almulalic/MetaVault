package com.zendrive.api.rest.models.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteDTO {
	@NotEmpty
	private List<String> metafiles;
}
