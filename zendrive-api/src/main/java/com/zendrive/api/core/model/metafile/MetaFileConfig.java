package com.zendrive.api.core.model.metafile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class MetaFileConfig {
    private final StorageType storageType;
    private final String inputPath;
    private final boolean sync;
}
