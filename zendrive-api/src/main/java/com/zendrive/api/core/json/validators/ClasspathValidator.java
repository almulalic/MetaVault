package com.zendrive.api.core.json.validators;

import com.zendrive.api.core.annotation.ValidClasspath;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ClasspathValidator implements ConstraintValidator<ValidClasspath, String> {

	@Override
	public void initialize(ValidClasspath constraintAnnotation) {
	}

	@Override
	public boolean isValid(String classpath, ConstraintValidatorContext context) {
		return classpath != null && isValidClasspath(classpath);
	}

	private boolean isValidClasspath(String classpath) {
		try {
			Class.forName(classpath);
			return true;
		} catch (ClassNotFoundException e) {
			return false;
		}
	}
}