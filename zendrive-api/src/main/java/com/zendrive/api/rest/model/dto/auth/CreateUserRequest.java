package com.zendrive.api.rest.model.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zendrive.api.core.model.auth.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * DTO class representing a request to create a user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties()
public class CreateUserRequest {

    /**
     * The first name of the user.
     */
    @NotBlank(message = "First Name can not be empty")
    private String firstName;

    /**
     * The last name of the user.
     */
    @NotBlank(message = "Last name can not be empty!")
    private String lastName;

    /**
     * The email address of the user.
     */
    @Email
    @NotBlank(message = "Email can not be empty!")
    private String email;

    /**
     * The display name of the user.
     */
    @NotBlank(message = "Display name can not be empty!")
    private String displayName;

    /**
     * The password of the user.
     */
    @NotBlank(message = "Password can not be empty!")
    private String password;

    /**
     * The list of user assigned roles.
     */
    @NotNull
    @NotEmpty(message = "New user must have at least one role!")
    private List<String> roles;

    /**
     * Converts the CreateUserRequest object to a User entity.
     *
     * @return The User entity.
     */
    public User toEntity() {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(email);
        user.setEmail(email);
        user.setDisplayName(displayName);
        user.setPassword(password);
        user.setCreationDate(new Date());
        return user;
    }
}
