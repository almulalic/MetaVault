package com.zendrive.api.core.annotation;

import com.zendrive.api.core.json.validators.ClasspathValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ClasspathValidator.class)
@Target(
	{
		ElementType.FIELD,
		ElementType.PARAMETER
	}
)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidClasspath {
	String message() default "Invalid classpath";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
