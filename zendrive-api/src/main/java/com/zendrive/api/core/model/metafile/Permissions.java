package com.zendrive.api.core.model.metafile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class Permissions {
	private List<String> read;
	private List<String> write;
	private List<String> execute;

	@JsonIgnore
	public boolean isEmpty() {
		return read.isEmpty() && write.isEmpty() && execute.isEmpty();
	}

	@JsonIgnore
	public boolean isSufficient() {
		return read.isEmpty() && write.isEmpty();
	}

	@JsonIgnore
	public List<String> getAllRoles() {
		return Stream.of(read, write, execute)
								 .flatMap(java.util.Collection::stream)
								 .collect(Collectors.toList());
	}
}
