package com.zendrive.api.core.repository.zendrive.pgdb;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import com.zendrive.api.exception.InvalidArgumentsException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, String> {
	@Query("SELECT COUNT(r.id) FROM Role r WHERE r.id IN :roleIds")
	void countRolesByIds(
		@Param("roleIds") List<String> roleIds
	);

	default void rolesExist(List<String> roleIds) {
		countRolesByIds(roleIds);
	}

	default List<Role> getRoles(List<String> roleIds) {
		return roleIds.stream()
									.map(roleId -> findById(roleId)
																	 .orElseThrow(() -> new InvalidArgumentsException(
																									"Role with ID %s does not exist.".formatted(roleId)
																								)
																	 )
									)
									.toList();
	}
}