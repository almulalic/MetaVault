package com.zendrive.api.core.model.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zendrive.api.core.model.user.UserFavorite;
import io.jsonwebtoken.Claims;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

/**
 * Model class representing a user.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Table(name = "users")
public class User implements UserDetails {
    /**
     * Unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 36, nullable = false, updatable = false)
    private Long id;

    /**
     * List of roles assigned to the user.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;

    /**
     * List of user favorite files
     */
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFavorite> favorites;

    /**
     * The first name of the user.
     */
    private String firstName;

    /**
     * The last name of the user.
     */
    private String lastName;

    /**
     * The username of the user.
     */
    private String username;

    /**
     * The email address of the user.
     */
    private String email;

    /**
     * The display name of the user.
     */
    private String displayName;

    /**
     * The password of the user.
     */
    @NotEmpty
    @JsonIgnore
    private String password;

    /**
     * The creation date of the user account.
     */
    private Date creationDate;

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    /**
     * Creates a User object from JWT claims.
     *
     * @param claims The claims extracted from a JWT.
     * @return A User object.
     */
    public static User fromJwt(Claims claims) {
        User user = new User();

        user.setId(claims.get("id", Long.class));
        user.setUsername(claims.get("email", String.class));
        user.setFirstName(claims.get("firstName", String.class));
        user.setLastName(claims.get("lastName", String.class));
        user.setEmail(claims.get("email", String.class));

        // Extract and convert roles claim
        List<Role> roles = new ArrayList<>();
        Object rolesClaim = claims.get("roles");

        if (rolesClaim instanceof List) {
            // If rolesClaim is a List, convert each role to a Role object
            List<?> rolesList = (List<?>) rolesClaim;
            for (Object roleObj : rolesList) {
                if (roleObj instanceof Map) {
                    Map<?, ?> roleMap = (Map<?, ?>) roleObj;
                    String id = (String) roleMap.get("id");
                    String name = (String) roleMap.get("name");
                    roles.add(new Role(id, name));
                }
            }
        } else if (rolesClaim instanceof Map) {
            // If rolesClaim is a Map, handle according to its structure
            Map<?, ?> rolesMap = (Map<?, ?>) rolesClaim;
            for (Map.Entry<?, ?> entry : rolesMap.entrySet()) {
                String id = (String) entry.getKey();
                String name = (String) entry.getValue();
                roles.add(new Role(id, name));
            }
        }

        user.setRoles(roles);

        return user;
    }
}
