package com.zendrive.api.core.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.victools.jsonschema.generator.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

import java.util.Set;

public class ClazzUtil {
	private static final SchemaGeneratorConfig config =
		new SchemaGeneratorConfigBuilder(
			SchemaVersion.DRAFT_2020_12,
			OptionPreset.PLAIN_JSON
		)
			.with(Option.EXTRA_OPEN_API_FORMAT_VALUES)
			.without(Option.FLATTENED_ENUMS_FROM_TOSTRING)
			.build();
	private static final SchemaGenerator generator = new SchemaGenerator(config);
	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();


	public static ObjectNode toJsonSchema(Class<?> clazz) {
		return generator.generateSchema(clazz);
	}

	public static <T> void validateObjectNode(String className, ObjectNode objectNode)
		throws Exception {
		Set<ConstraintViolation<T>> errors = validator.validate((T) objectMapper.treeToValue(
			objectNode,
			Class.forName(className)
		));

		if (errors.size() > 0) {
			StringBuilder errorMessage = new StringBuilder("Validation failed for the following reasons: ");

			for (ConstraintViolation<T> violation : errors) {
				errorMessage
					.append(violation.getPropertyPath())
					.append(": ")
					.append(violation.getMessage())
					.append(",");
			}

			throw new jakarta.validation.ConstraintViolationException(errorMessage.toString(), errors);
		}
	}
}
