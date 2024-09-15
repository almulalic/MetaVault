package com.zendrive.api.rest.models.dto.auth;

import com.zendrive.api.core.model.dao.pgdb.user.User;

/**
 * Represents a JWT (Json Web Token) Authentication Token containing information about the authenticated user and the token itself.
 */
public class JwtAuthenticationToken {

	/**
	 * The authenticated user associated with the token.
	 */
	private User user;

	/**
	 * The JWT token string.
	 */
	private String token;

	/**
	 * Default constructor for JwtAuthenticationToken.
	 */
	public JwtAuthenticationToken() {
	}

	/**
	 * Gets the authenticated user associated with the token.
	 *
	 * @return The authenticated user.
	 */
	public User getUser() {
		return user;
	}

	/**
	 * Sets the authenticated user associated with the token.
	 *
	 * @param user The authenticated user.
	 */
	public void setUser(User user) {
		this.user = user;
	}

	/**
	 * Gets the JWT token string.
	 *
	 * @return The JWT token string.
	 */
	public String getToken() {
		return token;
	}

	/**
	 * Sets the JWT token string.
	 *
	 * @param token The JWT token string.
	 */
	public void setToken(String token) {
		this.token = token;
	}
}
