package com.zendrive.api.core.repository.zendrive.pgdb;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	/**
	 * Searches for users based on the provided search criteria.
	 *
	 * @param search The search criteria.
	 * @return List of users matching the search criteria.
	 */
	@Query(
		"""
		SELECT u FROM User u WHERE
		LOWER(u.email) LIKE LOWER(CONCAT('%', ?1, '%')) OR
		LOWER(u.username) LIKE LOWER(CONCAT('%', ?1, '%')) OR
		LOWER(u.firstName) LIKE LOWER(CONCAT('%', ?1, '%')) OR
		LOWER(u.lastName) LIKE LOWER(CONCAT('%', ?1, '%'))
		"""
	)
	List<User> search(String search);

	/**
	 * Finds a user by username or email.
	 *
	 * @param username The username of the user.
	 * @param email    The email address of the user.
	 * @return The optional user object.
	 */
	Optional<User> findByUsernameOrEmail(String username, String email);

	/**
	 * Finds a user by email.
	 *
	 * @param email The email address of the user.
	 * @return The optional user object.
	 */
	Optional<User> findByEmail(String email);
}
