package com.zendrive.api.core.service.admin;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.repository.zendrive.pgdb.UserRepository;
import com.zendrive.api.core.repository.zendrive.pgdb.RoleRepository;
import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
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
			throw new ZendriveException("Must contain at least one role!", ZendriveErrorCode.INVALID_ARGUMENTS);
		}

		if (optionalUser.isEmpty()) {
			throw new ZendriveException("User not found.", ZendriveErrorCode.ENTITY_NOT_FOUND);
		}

		User user = optionalUser.get();

		user.setRoles(roleRepository.getRoles(dto.getRoles()));
		user.setEnabled(dto.isEnabled());
		user.setLocked(dto.isLocked());
		user.setUpdateDate(Date.from(Instant.now()));
		userRepository.save(user);

		return new UserDto(user);
	}
}
