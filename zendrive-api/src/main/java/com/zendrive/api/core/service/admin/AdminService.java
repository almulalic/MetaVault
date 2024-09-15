package com.zendrive.api.core.service.admin;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.repository.zendrive.pgdb.UserRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.rest.models.dto.admin.EditUserDto;
import com.zendrive.api.rest.models.dto.metafile.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;

	public List<User> searchUsers(String query) {
		return this.userRepository.search(query);
	}

	public UserDto editUser(EditUserDto dto) {
		Optional<User> optionalUser = userRepository.findById(dto.getId());

		if (dto.getRoles().size() == 0) {
			throw new BadRequestException("Must contain at least one role!");
		}

		if (optionalUser.isEmpty()) {
			throw new BadRequestException("User not found.");
		}

		User user = optionalUser.get();

		try {
			user.setRoles(roleRepository.getRoles(dto.getRoles()));
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException(ex.getMessage());
		}

		user.setEnabled(dto.isEnabled());
		user.setLocked(dto.isLocked());
		user.setUpdateDate(Date.from(Instant.now()));
		userRepository.save(user);

		return new UserDto(user);
	}
}
