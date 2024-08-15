package com.zendrive.api.core.model.metafile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class Permissions {
    private List<String> read;
    private List<String> write;
    private List<String> execute;

    public boolean isEmpty() {
        return read.isEmpty() && write.isEmpty() && execute.isEmpty();
    }

    public boolean isSufficient() {
        return read.isEmpty() && write.isEmpty();
    }
}
