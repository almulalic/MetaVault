package com.zendrive.api.rest.controller;

import com.zendrive.api.core.service.auth.AuthService;
import com.zendrive.api.rest.models.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.models.dto.auth.EditRoleRequest;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import com.zendrive.api.rest.models.dto.token.GenerateTokenRequest;
import com.zendrive.api.rest.models.dto.token.RefreshTokenRequest;
import com.zendrive.api.rest.models.dto.token.RefreshTokenResponse;
import com.zendrive.api.rest.models.dto.token.TokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling authentication-related requests.
 */
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController extends Controller {

	private final AuthService authService;

	@RequestMapping(method = RequestMethod.GET, path = "/user/search")
	public ResponseEntity<List<UserDto>> searchUsers(
		@RequestParam(required = false) String searchText
	) {
		return ResponseEntity.ok(
			this.authService.getUsers(searchText)
											.stream()
											.map(UserDto::new)
											.toList()
		);
	}

	@RequestMapping(method = RequestMethod.PUT, path = "/user/edit/role")
	public ResponseEntity<UserDto> editUserRole(
		@Valid
		@RequestBody
		EditRoleRequest dto
	) {
		return ResponseEntity.ok(new UserDto(this.authService.editUserRoles(dto)));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/create")
	public ResponseEntity<UserDto> createUser(
		@Valid
		@RequestBody
		CreateUserRequest dto
	) {
		return ResponseEntity.ok(new UserDto(this.authService.createUser(dto)));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/token/validate")
	public ResponseEntity<Boolean> validateToken() {
		return ResponseEntity.ok(true);
	}

	@RequestMapping(method = RequestMethod.POST, path = "/token/generate")
	public ResponseEntity<TokenResponse> generateToken(
		@Valid
		@RequestBody
		GenerateTokenRequest dto
	) {
		return ResponseEntity.ok(this.authService.generateToken(dto));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/token/refresh")
	public ResponseEntity<RefreshTokenResponse> refreshToken(
		@Valid
		@RequestBody
		RefreshTokenRequest dto
	) {
		return ResponseEntity.ok(this.authService.refreshToken(dto));
	}
}
