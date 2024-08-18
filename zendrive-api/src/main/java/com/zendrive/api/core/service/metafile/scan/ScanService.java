package com.zendrive.api.core.service.metafile.scan;

import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.MetaFileConfig;
import com.zendrive.api.core.model.metafile.Permissions;

public interface ScanService<T> {
    MetaFile scan(MetaFileConfig config, String destinationId, Permissions permissions);

    MetaFile processFile(T entity);

    void save(Iterable<MetaFile> metaFiles);
}
