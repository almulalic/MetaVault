package com.zendrive.api.rest.filter.slf4j;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.UUID;

/**
 * A filter that adds a requestId to the Mapped Diagnostic Context (MDC) to each request
 **/
@Slf4j
@Component
@EqualsAndHashCode(callSuper = false)
public class Slf4jMdcRequestIdFilter extends OncePerRequestFilter {
	@Override
	protected void doFilterInternal(
		final @NonNull HttpServletRequest request,
		final @NonNull HttpServletResponse response,
		final @NonNull FilterChain chain
	) {
		try {
			MDC.put("requestId", UUID.randomUUID().toString());
			chain.doFilter(request, response);
		} catch (Exception ex) {
			log.error("Exception occurred in filter while setting UUID for requestId in logs", ex);
		} finally {
			MDC.remove("requestId");
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