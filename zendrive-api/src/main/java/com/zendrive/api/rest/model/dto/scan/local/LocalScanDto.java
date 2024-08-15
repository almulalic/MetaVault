package com.zendrive.api.rest.model.dto.scan.local;

import com.zendrive.api.core.model.metafile.Permissions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalScanDto {
    private String path;
    private String destinationId;
    private Permissions permissions;
}
