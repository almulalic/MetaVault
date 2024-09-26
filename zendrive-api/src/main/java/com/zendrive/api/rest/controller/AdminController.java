package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.service.admin.AdminService;
import com.zendrive.api.rest.models.dto.admin.EditUserDto;
import com.zendrive.api.rest.models.dto.admin.SearchUsersDto;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminController extends Controller {
	private final AdminService adminService;

	@RequestMapping(method = RequestMethod.POST, path = "/user/search")
	public ResponseEntity<List<User>> searchUser(
		@RequestBody
		@Valid SearchUsersDto dto
	) {
		return ResponseEntity.ok(adminService.searchUsers(dto.getQuery()));
	}

	@RequestMapping(method = RequestMethod.PUT, path = "/user/edit")
	public ResponseEntity<UserDto> editUser(
		@RequestBody
		@Valid EditUserDto dto
	) {
		return ResponseEntity.ok(adminService.editUser(dto));
	}
}
