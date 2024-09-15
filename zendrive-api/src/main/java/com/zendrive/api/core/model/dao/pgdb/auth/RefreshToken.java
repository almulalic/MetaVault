package com.zendrive.api.core.model.dao.pgdb.auth;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Model class representing a refresh token.
 */
@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
public class RefreshToken {

	/**
	 * Unique identifier for the refresh token.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Reference to the user associated with the refresh token.
	 */
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	/**
	 * The refresh token string.
	 */
	private String token;

	/**
	 * The expiry date of the refresh token.
	 */
	private Instant expiryDate;
}
