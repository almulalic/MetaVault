package com.zendrive.api.rest.model.dto.metafile;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FileDTO {
    private String id;
    private String name;
    private Long size;
    private String createdDate;
    private String blobPath;
    private Long contentSize;
    private Long previous;
    private List<String> children;
}