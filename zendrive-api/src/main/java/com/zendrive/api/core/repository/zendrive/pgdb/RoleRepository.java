package com.zendrive.api.core.repository.zendrive.pgdb;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, String> {
	@Query("SELECT COUNT(r.id) FROM Role r WHERE r.id IN :roleIds")
	long countRolesByIds(
		@Param("roleIds") List<String> roleIds
	);

	default boolean rolesExist(List<String> roleIds) {
		return countRolesByIds(roleIds) == roleIds.size();
	}

	default List<Role> getRoles(List<String> roleIds) throws IllegalArgumentException {
		return roleIds.stream()
									.map(roleId -> findById(roleId)
																	 .orElseThrow(() -> new IllegalArgumentException(
																		 "Role with ID %s does not exist.".formatted(roleId))))
									.toList();
	}
}