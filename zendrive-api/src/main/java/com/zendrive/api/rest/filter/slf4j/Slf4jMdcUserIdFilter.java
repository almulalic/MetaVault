package com.zendrive.api.rest.filter.slf4j;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.UUID;

/**
 * A filter that adds userId to the Mapped Diagnostic Context (MDC) to each authenticated request
 **/
@Slf4j
@Component
@EqualsAndHashCode(callSuper = false)
public class Slf4jMdcUserIdFilter extends OncePerRequestFilter {
	@Override
	protected void doFilterInternal(
		final @NonNull HttpServletRequest request,
		final @NonNull HttpServletResponse response,
		final @NonNull FilterChain chain
	) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null && authentication.getPrincipal() instanceof User user) {
				//todo variable
				MDC.put("userId", user.getId().toString());
			}
			chain.doFilter(request, response);
		} catch (Exception ex) {
			log.error("Exception occurred in filter while setting userId for logs", ex);
		} finally {
			MDC.remove("userId");
		}
	}

	@Override
	protected boolean isAsyncDispatch(final HttpServletRequest request) {
		return false;
	}

	@Override
	protected boolean shouldNotFilterErrorDispatch() {
		return false;
	}
}