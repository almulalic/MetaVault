package com.zendrive.api.core.service.auth;

import com.zendrive.api.core.model.auth.RefreshToken;
import com.zendrive.api.core.model.auth.Role;
import com.zendrive.api.core.model.auth.User;
import com.zendrive.api.core.repository.AuthRepository;
import com.zendrive.api.core.repository.UserRoleRepository;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.exception.auth.TokenRefreshException;
import com.zendrive.api.exception.auth.UnauthorizedException;
import com.zendrive.api.exception.repository.UserExistsException;
import com.zendrive.api.exception.repository.UserNotFoundException;
import com.zendrive.api.rest.model.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.model.dto.auth.EditRoleRequest;
import com.zendrive.api.rest.model.dto.token.GenerateTokenRequest;
import com.zendrive.api.rest.model.dto.token.RefreshTokenRequest;
import com.zendrive.api.rest.model.dto.token.RefreshTokenResponse;
import com.zendrive.api.rest.model.dto.token.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for managing authentication.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthRepository authRepository;
    private final UserRoleRepository userRoleRepository;
    private final RefreshTokenService refreshTokenService;

    /**
     * Retrieves users based on search criteria.
     * Requires ADMIN authority.
     *
     * @param search The search criteria.
     * @return The list of users.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getUsers(String search) {
        return authRepository.search(search);
    }

    /**
     * Creates a new user.
     *
     * @param dto The user creation request.
     * @return The created user.
     */
    public User createUser(CreateUserRequest dto) {
        if (authRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserExistsException("User with this email already exists");
        }

        List<Role> roles = dto.getRoles().stream()
                             .map(id ->
                                    userRoleRepository
                                      .findById(id)
                                      .orElseThrow(() -> new BadRequestException("Role with ID %s does not exist.".formatted(
                                        id)))
                             )
                             .toList();

        User user = dto.toEntity();
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return authRepository.save(user);
    }

    /**
     * Edits the roles of a user.
     *
     * @param dto The edit role request.
     * @return The updated user.
     */
    public User editUserRoles(EditRoleRequest dto) {
        Optional<User> possibleUser = authRepository.findById(dto.getUserId());
        if (possibleUser.isEmpty()) {
            throw new UserNotFoundException("User with this ID does not exist");
        }

        if (dto.getRoles() == null || dto.getRoles().isEmpty()) {
            throw new BadRequestException("Role must be specified.");
        }

        User user = possibleUser.get();
        //    user.setAssignedRoles(dto.getRoles().stream().toList());

        return authRepository.save(user);
    }

    /**
     * Generates authentication tokens.
     *
     * @param dto The token generation request.
     * @return The token response.
     */
    public TokenResponse generateToken(GenerateTokenRequest dto) {
        try {
            authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Username or password is incorrect!");
        }

        User user = authRepository
                      .findByEmail(dto.getEmail())
                      .orElseThrow(() -> new UserNotFoundException(
                        String.format("User with email '%s' not found.", dto.getEmail())
                      ));

        return TokenResponse.Builder()
                 .withUser(user)
                 .withAccessToken(jwtService.generateToken(user))
                 .withRefreshToken(
                   dto.isRememberMe() ? refreshTokenService.createRefreshToken(user.getId()).getToken() : null)
                 .build();
    }

    /**
     * Refreshes authentication tokens.
     *
     * @param dto The token refresh request.
     * @return The refresh token response.
     */
    public RefreshTokenResponse refreshToken(RefreshTokenRequest dto) {
        String requestRefreshToken = dto.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                 .map(refreshTokenService::verifyExpiration)
                 .map(RefreshToken::getUser)
                 .map(user -> RefreshTokenResponse.Builder()
                                .withAccessToken(jwtService.generateToken(user))
                                .withRefreshToken(requestRefreshToken)
                                .build())
                 .orElseThrow(() -> new TokenRefreshException(
                   requestRefreshToken,
                   "Refresh token is not in database!"
                 ));
    }
}
