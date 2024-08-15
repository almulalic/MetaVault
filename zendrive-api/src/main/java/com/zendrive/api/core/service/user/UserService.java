package com.zendrive.api.core.service.user;

import com.zendrive.api.core.model.auth.User;
import com.zendrive.api.core.model.user.UserFavorite;
import com.zendrive.api.core.repository.AuthRepository;
import com.zendrive.api.core.repository.MetafileRepository;
import com.zendrive.api.core.repository.UserFavoriteRepository;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.exception.repository.UserNotFoundException;
import com.zendrive.api.rest.model.dto.auth.CreateUserRequest;
import com.zendrive.api.rest.model.dto.metafile.UserDTO;
import com.zendrive.api.rest.model.dto.user.UserFavoriteDTO;
import com.zendrive.api.rest.model.dto.user.UserFavoriteResponse;
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

    private final AuthRepository authRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final MetafileRepository metafileRepository;

    public List<UserFavoriteResponse> getUserFavorites(Long userId) {
        List<UserFavorite> userFavorites = userFavoriteRepository.findAllByUserId(userId);
        List<UserFavoriteResponse> userFavoriteResponses = new ArrayList<>();

        if (userFavorites.size() > 0) {
            for (UserFavorite userFavorite : userFavorites) {
                metafileRepository.findById(userFavorite.getMetafileId())
                  .ifPresent(file -> userFavoriteResponses.add(new UserFavoriteResponse(userFavorite, file)));
            }
        }

        return userFavoriteResponses;
    }

    public UserFavoriteResponse addFolderToFavorites(Long userId, UserFavoriteDTO userFavoriteDTO)
      throws BadRequestException {
        if (metafileRepository.findById(userFavoriteDTO.getMetafileId()).isEmpty()) {
            throw new BadRequestException(String.format(
              "Metafile with ID: %s was not found.",
              userFavoriteDTO.getMetafileId()
            ));
        }

        if (userFavoriteRepository.findUsersFavoriteByMetafileId(userId, userFavoriteDTO.getMetafileId()).isPresent()) {
            throw new BadRequestException(String.format(
              "Metafile with ID: %s is already favorite.",
              userFavoriteDTO.getMetafileId()
            ));
        }

        UserFavorite userFavorite = userFavoriteRepository.save(
          UserFavorite.Builder()
            .withMetafileId(userFavoriteDTO.getMetafileId())
            .withUserId(userId)
            .build()
        );

        return UserFavoriteResponse.Builder()
                 .withId(userFavorite.getId())
                 .withMetafile(metafileRepository.findById(userFavorite.getMetafileId()).orElse(null))
                 .withUserId(userFavorite.getUserId())
                 .build();
    }

    public UserFavorite removeFolderFromFavorites(Long userId, UserFavoriteDTO userFavoriteDTO)
      throws BadRequestException {
        Optional<UserFavorite> userFavorite = userFavoriteRepository.findUsersFavoriteByMetafileId(
          userId,
          userFavoriteDTO.getMetafileId()
        );

        if (userFavorite.isEmpty()) {
            throw new BadRequestException(String.format(
              "Metafile with ID: %s was not found in favorites.",
              userFavoriteDTO.getMetafileId()
            ));
        }

        userFavoriteRepository.delete(userFavorite.get());

        return userFavorite.get();
    }

    /**
     * Retrieves all users.
     *
     * @return List of UserDTOs representing the users.
     */
    public List<UserDTO> getUsers() {
        List<User> users = authRepository.findAll();

        return users.stream()
                 .map(UserDTO::new)
                 .collect(Collectors.toList());
    }

    /**
     * Retrieves a user by ID.
     *
     * @param id The ID of the user.
     * @return UserDTO representing the user.
     * @throws UserNotFoundException if the user with the given ID does not exist.
     */
    public UserDTO getUserById(Long id) {
        Optional<User> user = authRepository.findById(id);

        if (user.isEmpty()) {
            throw new UserNotFoundException("The user with the given ID does not exist.");
        }

        return new UserDTO(user.get());
    }

    /**
     * Retrieves a user by username or email.
     *
     * @param identifier The username or email of the user.
     * @return The User object representing the user.
     * @throws UserNotFoundException if the user with the given username or email does not exist.
     */
    public User getUser(String identifier) {
        Optional<User> user = authRepository.findByUsernameOrEmail(identifier, identifier);

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
        Optional<User> user = authRepository.findByUsernameOrEmail(username, email);

        if (user.isEmpty()) {
            throw new UserNotFoundException("The user with the given ID does not exist.");
        }

        return user.get();
    }

    /**
     * Adds a new user.
     *
     * @param payload The CreateUserRequest object representing the user to be added.
     * @return The UserDTO representing the added user.
     */
    public UserDTO addUser(CreateUserRequest payload) {
        return new UserDTO(authRepository.save(payload.toEntity()));
    }

    /**
     * Updates an existing user.
     *
     * @param id      The ID of the user to be updated.
     * @param payload The CreateUserRequest object representing the updated user information.
     * @return The UserDTO representing the updated user.
     * @throws UserNotFoundException if the user with the given ID does not exist.
     */
    public UserDTO updateUser(Long id, CreateUserRequest payload) {
        Optional<User> user = authRepository.findById(id);

        if (user.isEmpty()) {
            throw new UserNotFoundException("The user with the given ID does not exist.");
        }

        User updatedUser = payload.toEntity();
        updatedUser.setId(id);
        updatedUser = authRepository.save(updatedUser);
        return new UserDTO(updatedUser);
    }

    /**
     * Deletes a user by ID.
     *
     * @param id The ID of the user to be deleted.
     */
    public void deleteUser(Long id) {
        Optional<User> user = authRepository.findById(id);
        user.ifPresent(authRepository::delete);
    }

    /**
     * Provides a UserDetailsService implementation for Spring Security.
     *
     * @return The UserDetailsService instance.
     */
    public UserDetailsService userDetailsService() {
        return identifier -> authRepository.findByUsernameOrEmail(identifier, identifier)
                               .orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }
}
