package com.zendrive.api.core.model.metafile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Data
@ToString
@AllArgsConstructor
@Document(indexName = "file_tree")
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class MetaFile {
    @Id
    private String id;
    private String name;
    private Long size;
    private String createdDate;
    private Long lastModifiedDate;
    private Store store;
    private String blobPath;
    private String previous;
    private Permissions permissions;
    private List<String> children;
    private List<String> breadcrumbs;
    private List<String> grants;
}
