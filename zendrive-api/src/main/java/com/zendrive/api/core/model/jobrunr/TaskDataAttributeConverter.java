package com.zendrive.api.core.model.jobrunr;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TaskDataAttributeConverter implements AttributeConverter<TaskData, String> {
	private static final ObjectMapper objectMapper = new ObjectMapper();

	public TaskDataAttributeConverter() {
		super();
		objectMapper.registerModule(new JavaTimeModule());
	}

	@Override
	public String convertToDatabaseColumn(TaskData address) {
		try {
			return objectMapper.writeValueAsString(address);
		} catch (JsonProcessingException jpe) {
			System.out.println("Cannot convert TaskData into JSON");
			return null;
		}
	}

	@Override
	public TaskData convertToEntityAttribute(String value) {
		try {
			return objectMapper.readValue(value, TaskData.class);
		} catch (JsonProcessingException e) {
			System.out.println("Cannot convert JSON into TaskData");
			return null;
		}
	}
}
