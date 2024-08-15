package com.zendrive.api.core.service.role;

import com.zendrive.api.core.model.auth.Role;
import com.zendrive.api.core.repository.UserRoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    private final UserRoleRepository userRoleRepository;

    public RoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    public List<Role> getAll() {
        return userRoleRepository.findAll();
    }

    //    public List<Role> getRolesForUser(String userId) {
    //        return userRoleRepository.;
    //    }

    public Optional<Role> getById(String id) {
        return userRoleRepository.findById(id);
    }
}
