package com.zendrive.api.core.service.user;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.dao.pgdb.user.UserFavorite;
import com.zendrive.api.core.repository.zendrive.pgdb.UserRepository;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.UserFavoriteRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.exception.repository.UserNotFoundException;
import com.zendrive.api.rest.models.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import com.zendrive.api.rest.models.dto.user.UpdateUserDto;
import com.zendrive.api.rest.models.dto.user.UserFavoriteView;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final UserFavoriteRepository userFavoriteRepository;
	private final RoleRepository roleRepository;
	private final MetafileRepository metafileRepository;

	public List<UserFavoriteView> getUserFavorites(Long userId) {
		List<UserFavorite> userFavorites = userFavoriteRepository.findAllByUserId(userId);
		List<UserFavoriteView> userFavoriteResponse = new ArrayList<>();

		if (userFavorites.size() > 0) {
			for (UserFavorite userFavorite : userFavorites) {
				metafileRepository.findById(userFavorite.getMetafileId())
													.ifPresent(metaFile -> userFavoriteResponse.add(
														new UserFavoriteView(
															userFavorite,
															metaFile
														)
													));
			}
		}

		return userFavoriteResponse;
	}

	public List<UserFavoriteView> addToFavorites(Long userId, List<String> metafileIds) {
		List<UserFavoriteView> successful = new ArrayList<>();

		for (String metafileId : metafileIds) {
			Optional<MetaFile> optionalMetaFile = metafileRepository.findById(metafileId);

			if (optionalMetaFile.isEmpty()) {
				throw new BadRequestException(String.format("Metafile with ID: %s was not found.", metafileId));
			}

			if (userFavoriteRepository.findUsersFavoriteByMetafileId(userId, metafileId).isPresent()) {
				throw new BadRequestException(String.format("Metafile with ID: %s is already favorite.", metafileId));
			}

			UserFavorite userFavorite = userFavoriteRepository.save(
				UserFavorite.Builder()
										.withMetafileId(metafileId)
										.withUserId(userId)
										.build()
			);

			successful.add(new UserFavoriteView(userFavorite, optionalMetaFile.get()));
		}

		return successful;
	}

	public List<UserFavoriteView> removeFromFavorites(Long userId, List<String> metafileIds)
		throws BadRequestException {
		List<UserFavoriteView> successful = new ArrayList<>();

		for (String metafileId : metafileIds) {
			Optional<UserFavorite> userFavorite = userFavoriteRepository.findUsersFavoriteByMetafileId(
				userId,
				metafileId
			);

			if (userFavorite.isEmpty()) {
				throw new BadRequestException(String.format(
					"Metafile with ID: %s was not found in favorites.",
					metafileId
				));
			}

			successful.add(new UserFavoriteView(userFavorite.get(), metafileRepository.findById(metafileId).get()));
			userFavoriteRepository.delete(userFavorite.get());
		}

		return successful;
	}

	/**
	 * Retrieves all users.
	 *
	 * @return List of UserDTOs representing the users.
	 */
	public List<UserDto> getUsers() {
		List<User> users = userRepository.findAll();

		return users.stream()
								.map(UserDto::new)
								.collect(Collectors.toList());
	}

	/**
	 * Retrieves a user by ID.
	 *
	 * @param id The ID of the user.
	 * @return UserDTO representing the user.
	 * @throws UserNotFoundException if the user with the given ID does not exist.
	 */
	public UserDto getUserById(Long id) {
		Optional<User> user = userRepository.findById(id);

		if (user.isEmpty()) {
			throw new UserNotFoundException("The user with the given ID does not exist.");
		}

		return new UserDto(user.get());
	}

	/**
	 * Retrieves a user by username or email.
	 *
	 * @param identifier The username or email of the user.
	 * @return The User object representing the user.
	 * @throws UserNotFoundException if the user with the given username or email does not exist.
	 */
	public User getUser(String identifier) {
		Optional<User> user = userRepository.findByUsernameOrEmail(identifier, identifier);

		if (user.isEmpty()) {
			throw new UserNotFoundException("The user with the given ID does not exist.");
		}

		return user.get();
	}

	/**
	 * Checks if a user with the given username or email exists.
	 *
	 * @param username The username of the user.
	 * @param email    The email address of the user.
	 * @return The User object representing the user.
	 * @throws UserNotFoundException if the user with the given username or email does not exist.
	 */
	public User isUniqueUser(String username, String email) {
		Optional<User> user = userRepository.findByUsernameOrEmail(username, email);

		if (user.isEmpty()) {
			throw new UserNotFoundException("The user with the given ID does not exist.");
		}

		return user.get();
	}

	/**
	 * Adds a new user.
	 *
	 * @param dto The CreateUserRequest object representing the user to be added.
	 * @return The UserDTO representing the added user.
	 */
	public UserDto createUser(Long id, CreateUserRequest dto) {
		if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
			throw new BadRequestException("User with that email already exists");
		}

		User user = dto.toEntity();

		try {
			user.setRoles(roleRepository.getRoles(dto.getRoles()));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}

		user.setCreatedBy(userRepository.findById(id).get());
		user.setUsername(dto.getEmail());
		user.setPassword("");

		userRepository.save(user);

		return new UserDto(user);
	}

	/**
	 * Updates an existing user.
	 *
	 * @param id  The ID of the user to be updated.
	 * @param dto The EditUserDto object representing the updated user information.
	 * @return The UserDTO representing the updated user.
	 * @throws UserNotFoundException if the user with the given ID does not exist.
	 */
	public UserDto updateUser(Long id, UpdateUserDto dto) {
		Optional<User> optionalUser = userRepository.findById(id);

		if (optionalUser.isEmpty()) {
			throw new UserNotFoundException("The user with the given ID does not exist.");
		}

		User user = optionalUser.get();

		if (
			!user.getEmail().equals(dto.getEmail()) &&
			userRepository.findByEmail(dto.getEmail()).isPresent()
		) {
			throw new BadRequestException("Email must be unique!");
		}

		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setDisplayName(dto.getDisplayName());
		user.setEmail(dto.getEmail());

		userRepository.save(user);

		return new UserDto(user);
	}

	/**
	 * Deletes a user by ID.
	 *
	 * @param id The ID of the user to be deleted.
	 */
	public void deleteUser(Long id) {
		Optional<User> user = userRepository.findById(id);
		user.ifPresent(userRepository::delete);
	}

	/**
	 * Provides a UserDetailsService implementation for Spring Security.
	 *
	 * @return The UserDetailsService instance.
	 */
	public UserDetailsService userDetailsService() {
		return identifier -> userRepository.findByUsernameOrEmail(identifier, identifier)
																			 .orElseThrow(() -> new UsernameNotFoundException("User not found."));
	}

}
