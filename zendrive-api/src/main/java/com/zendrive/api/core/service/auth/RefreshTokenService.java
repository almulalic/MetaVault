package com.zendrive.api.core.service.auth;

import com.zendrive.api.core.model.dao.pgdb.auth.RefreshToken;
import com.zendrive.api.core.repository.zendrive.pgdb.UserRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RefreshTokenRepository;
import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing refresh tokens.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	@Value("${security.jwt.jwtRefreshExpirationMs}")
	private Long refreshTokenDurationMs;

	private final RefreshTokenRepository refreshTokenRepository;
	private final UserRepository userRepository;

	/**
	 * Retrieves a refresh token by its token string.
	 *
	 * @param token The token string to search for.
	 * @return An optional containing the refresh token, or empty if not found.
	 */
	public Optional<RefreshToken> findByToken(String token) {
		return refreshTokenRepository.findByToken(token);
	}

	/**
	 * Creates a new refresh token for the given user ID.
	 *
	 * @param userId The ID of the user for whom the refresh token is created.
	 * @return The newly created refresh token.
	 */
	public RefreshToken createRefreshToken(Long userId) {
		RefreshToken refreshToken = new RefreshToken();

		refreshToken.setUser(userRepository.findById(userId).get());
		refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
		refreshToken.setToken(UUID.randomUUID().toString());

		return refreshTokenRepository.save(refreshToken);
	}

	/**
	 * Verifies if a refresh token has expired.
	 *
	 * @param token The refresh token to be verified.
	 * @return The refresh token if it has not expired.
	 */
	public RefreshToken verifyExpiration(RefreshToken token) {
		if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
			refreshTokenRepository.delete(token);
			throw new ZendriveException(
				"Refresh token was expired. Please make a new sign-in request",
				ZendriveErrorCode.JWT_TOKEN_EXPIRED
			);
		}

		return token;
	}
}
