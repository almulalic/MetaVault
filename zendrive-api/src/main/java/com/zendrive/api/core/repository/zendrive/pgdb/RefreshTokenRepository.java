package com.zendrive.api.core.repository.zendrive.pgdb;

import com.zendrive.api.core.model.dao.pgdb.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	/**
	 * Finds a refresh token by its token string.
	 *
	 * @param token The token string.
	 * @return The optional refresh token object.
	 */
	Optional<RefreshToken> findByToken(String token);

	/**
	 * Deletes refresh tokens by user ID.
	 *
	 * @param userId The ID of the user associated with the refresh token.
	 */
	void deleteByUserId(Long userId);
}
