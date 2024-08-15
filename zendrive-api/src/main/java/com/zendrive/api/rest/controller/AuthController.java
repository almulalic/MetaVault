package com.zendrive.api.rest.controller;

import com.zendrive.api.core.service.auth.AuthService;
import com.zendrive.api.rest.model.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.model.dto.auth.EditRoleRequest;
import com.zendrive.api.rest.model.dto.metafile.UserDTO;
import com.zendrive.api.rest.model.dto.token.GenerateTokenRequest;
import com.zendrive.api.rest.model.dto.token.RefreshTokenRequest;
import com.zendrive.api.rest.model.dto.token.RefreshTokenResponse;
import com.zendrive.api.rest.model.dto.token.TokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling authentication-related requests.
 */
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @RequestMapping(method = RequestMethod.GET, path = "/user/search")
  public ResponseEntity<List<UserDTO>> searchUsers(
    @RequestParam(required = false) String searchText
  ) {
    return ResponseEntity.ok(this.authService.getUsers(searchText).stream().map(UserDTO::new).toList());
  }

  @RequestMapping(method = RequestMethod.PUT, path = "/user/edit/role")
  public ResponseEntity<UserDTO> editUserRole(
    @Valid @RequestBody
    EditRoleRequest dto
  ) {
    return ResponseEntity.ok(new UserDTO(this.authService.editUserRoles(dto)));
  }

  @RequestMapping(method = RequestMethod.POST, path = "/create")
  public ResponseEntity<UserDTO> createUser(
    @Valid @RequestBody
    CreateUserRequest dto
  ) {
    return ResponseEntity.ok(new UserDTO(this.authService.createUser(dto)));
  }

  @RequestMapping(method = RequestMethod.POST, path = "/token/generate")
  public ResponseEntity<TokenResponse> generateToken(
    @Valid @RequestBody
    GenerateTokenRequest dto
  ) {
    return ResponseEntity.ok(this.authService.generateToken(dto));
  }

  @RequestMapping(method = RequestMethod.POST, path = "/token/refresh")
  public ResponseEntity<RefreshTokenResponse> refreshToken(
    @Valid @RequestBody
    RefreshTokenRequest dto
  ) {
    return ResponseEntity.ok(this.authService.refreshToken(dto));
  }
}
