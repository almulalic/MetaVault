package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class Controller {
	protected final Logger LOGGER = LoggerFactory.getLogger(getClass());

	protected User getCurrentUser() throws ZendriveException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null && authentication.getPrincipal() instanceof User user) {
			return user;
		} else {
			throw new ZendriveException(
				"You aren't authorized to perform this operation!",
				ZendriveErrorCode.PERMISSION_DENIED
			);
		}
	}
}
