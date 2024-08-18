package com.zendrive.api.rest.model.dto.metafile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zendrive.api.core.model.metafile.MetaFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class MetafileView {
    private String id;
    private String name;
    private List<String> breadcrumbs;
    @JsonProperty("isFolder")
    private boolean isFolder;
    private long size;

    public MetafileView(MetaFile metaFile) {
        this.id = metaFile.getId();
        this.name = metaFile.getName();
        this.breadcrumbs = metaFile.getBreadcrumbs();
        this.isFolder = metaFile.getChildren() != null && metaFile.getChildren().size() > 0;
        this.size = metaFile.getSize();
    }
}
