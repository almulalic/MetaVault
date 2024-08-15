package com.zendrive.api.core.repository;

import com.zendrive.api.core.model.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<Role, String> {
    @Query("SELECT COUNT(r.id) FROM Role r WHERE r.id IN :roleIds")
    long countRolesByIds(
      @Param("roleIds") List<String> roleIds
    );

    default boolean rolesExist(List<String> roleIds) {
        return countRolesByIds(roleIds) == roleIds.size();
    }
}