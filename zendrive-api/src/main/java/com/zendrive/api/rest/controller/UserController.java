package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.service.user.UserService;
import com.zendrive.api.rest.models.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import com.zendrive.api.rest.models.dto.user.UpdateUserDto;
import com.zendrive.api.rest.models.dto.user.UserFavoriteDTO;
import com.zendrive.api.rest.models.dto.user.UserFavoriteView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@RequestMapping(method = RequestMethod.GET, path = "/metafile/favorite")
	public ResponseEntity<List<UserFavoriteView>> getFavorites(
		HttpServletRequest request
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(userService.getUserFavorites(user.getId()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite")
	public ResponseEntity<List<UserFavoriteView>> addToFavorites(
		HttpServletRequest request,
		@Valid
		@RequestBody
		UserFavoriteDTO userFavoriteDto
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(userService.addToFavorites(user.getId(), userFavoriteDto.getMetafiles()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite/remove")
	public ResponseEntity<List<UserFavoriteView>> removeFromFavorites(
		HttpServletRequest request,
		@Valid
		@RequestBody
		UserFavoriteDTO userFavoriteDto
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(userService.removeFromFavorites(user.getId(), userFavoriteDto.getMetafiles()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/create")
	public ResponseEntity<UserDto> create(
		HttpServletRequest request,
		@RequestBody
		@Valid CreateUserRequest dto
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(userService.createUser(user.getId(), dto));
	}

	@RequestMapping(method = RequestMethod.PUT, path = "/update")
	public ResponseEntity<UserDto> update(
		HttpServletRequest request,
		@RequestBody
		@Valid UpdateUserDto dto
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(userService.updateUser(user.getId(), dto));
	}
}
