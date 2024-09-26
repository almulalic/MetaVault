package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.service.user.UserService;
import com.zendrive.api.rest.models.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import com.zendrive.api.rest.models.dto.user.UpdateUserDto;
import com.zendrive.api.rest.models.dto.user.UserFavoriteDTO;
import com.zendrive.api.rest.models.dto.user.UserFavoriteView;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/user")
@RequiredArgsConstructor
public class UserController extends Controller {
	private final UserService userService;

	@RequestMapping(method = RequestMethod.GET, path = "/metafile/favorite")
	public ResponseEntity<List<UserFavoriteView>> getFavorites() {
		return ResponseEntity.ok(userService.getUserFavorites(getCurrentUser().getId()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite")
	public ResponseEntity<List<UserFavoriteView>> addToFavorites(
		@Valid
		@RequestBody
		UserFavoriteDTO userFavoriteDto
	) {
		return ResponseEntity.ok(userService.addToFavorites(getCurrentUser().getId(), userFavoriteDto.getMetafiles()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite/remove")
	public ResponseEntity<List<UserFavoriteView>> removeFromFavorites(
		@Valid
		@RequestBody
		UserFavoriteDTO userFavoriteDto
	) {
		return ResponseEntity.ok(userService.removeFromFavorites(getCurrentUser().getId(), userFavoriteDto.getMetafiles()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/create")
	public ResponseEntity<UserDto> create(
		@Valid
		@RequestBody
		CreateUserRequest dto
	) {
		return ResponseEntity.ok(new UserDto(userService.createUser(getCurrentUser().getId(), dto)));
	}

	@RequestMapping(method = RequestMethod.PUT, path = "/update")
	public ResponseEntity<UserDto> update(
		@Valid
		@RequestBody
		UpdateUserDto dto
	) {
		return ResponseEntity.ok(new UserDto(userService.updateUser(getCurrentUser().getId(), dto)));
	}
}
