package com.zendrive.api.core.repository.zendrive.elastic;

import com.zendrive.api.core.model.dao.elastic.task.TaskDefinition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface TaskDefinitionRepository extends ElasticsearchRepository<TaskDefinition, String> {
	Optional<TaskDefinition> findByName(String name);

	List<TaskDefinition> findAllByNameLike(String query);
}
