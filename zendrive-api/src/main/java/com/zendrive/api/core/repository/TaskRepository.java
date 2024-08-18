package com.zendrive.api.core.repository;

import com.zendrive.api.core.model.metafile.MetaFile;
import jakarta.transaction.Transactional;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

@Transactional
public interface TaskRepository extends ElasticsearchRepository<MetaFile, String> {
}
