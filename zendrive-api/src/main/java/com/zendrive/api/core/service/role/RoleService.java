package com.zendrive.api.core.service.role;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService {
	private final RoleRepository roleRepository;

	public List<Role> getAll() {
		return roleRepository.findAll();
	}

	public Optional<Role> getById(String id) {
		return roleRepository.findById(id);
	}
}
