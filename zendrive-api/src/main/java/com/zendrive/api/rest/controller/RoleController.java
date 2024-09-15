package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import com.zendrive.api.core.service.role.RoleService;
import com.zendrive.api.exception.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@ApiVersion(1)
@RequestMapping("api/role")
public class RoleController {
	private final RoleService roleService;

	public RoleController(RoleService roleService) {
		this.roleService = roleService;
	}

	@RequestMapping(method = RequestMethod.GET, path = "")
	public ResponseEntity<List<Role>> getAll() {
		return ResponseEntity.ok(roleService.getAll());
	}

	@RequestMapping(method = RequestMethod.GET, path = "/{id}")
	public ResponseEntity<Role> getById(
		@PathVariable String id
	) {
		return ResponseEntity.ok(
			roleService.getById(id)
								 .orElseThrow(() -> new BadRequestException("Role does not exist"))
		);
	}
}