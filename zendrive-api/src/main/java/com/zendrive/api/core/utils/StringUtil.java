package com.zendrive.api.core.utils;

public class StringUtil {
	public static String removeTrailingSlash(String path) {
		if (path != null && path.endsWith("/")) {
			return path.substring(0, path.length() - 1);
		}
		return path;
	}

	public static String removeLeadingSlash(String path) {
		if (path != null && path.startsWith("/")) {
			return path.substring(1);
		}
		return path;
	}
}
