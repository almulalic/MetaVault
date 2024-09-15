package com.zendrive.api.rest.models.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EditUserDto {
	private Long id;
	private List<String> roles;
	private boolean enabled;
	private boolean locked;
}
