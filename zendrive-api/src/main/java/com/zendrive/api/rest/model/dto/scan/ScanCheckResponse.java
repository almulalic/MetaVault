package com.zendrive.api.rest.model.dto.scan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class ScanCheckResponse {
    private String path;
    private boolean exists;
    private long fileCount = 0;
    private long dirCount = 0;
    private long totalSize = 0;
    private String errorMessage = "";
}
