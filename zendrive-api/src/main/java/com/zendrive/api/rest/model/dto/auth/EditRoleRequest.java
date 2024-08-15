package com.zendrive.api.rest.model.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO class representing a request to edit user roles.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditRoleRequest {

    /**
     * The ID of the user whose roles are to be edited.
     */
    private Long userId;

    /**
     * The list of roles to be assigned to the user.
     */
    private List<String> roles;
}
