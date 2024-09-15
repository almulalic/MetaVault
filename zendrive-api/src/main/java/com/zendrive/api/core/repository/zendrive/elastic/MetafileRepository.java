package com.zendrive.api.core.repository.zendrive.elastic;

import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

@Transactional
public interface MetafileRepository extends ElasticsearchRepository<MetaFile, String> {
	@Query(
		"{ \"bool\": { \"must\": [ { \"term\": { \"_id\": \"?0\" } }, { \"terms\": { \"permission.read\": ?1 } } ] } }"
	)
	Optional<MetaFile> findById(String id, List<String> roles);

	@Query("{\"term\": { \"blobPath.keyword\": \"?0\" }}")
	Optional<MetaFile> findByBlobPath(String path);

	@Query("{\"bool\":{\"must\":[{\"match\":{\"previous\":\"?0\"}}]}}")
	Iterable<MetaFile> findAllPrevious(String previousId);

	@Query(
		"{ \"bool\": { \"must\": [ { \"terms\": { \"id.keyword\": ?0 } }, { \"terms\": { \"permissions.read.keyword\": ?1 } } ] } }"
	)
	List<MetaFile> findMultiple(List<String> ids, List<String> roles);

	@Query("{\"bool\":{\"must\":[{\"match\":{\"name\":\"root\"}}]}}")
	Optional<MetaFile> getRootNode();

	@Query("{\"query_string\": {\"fields\": [\"name\", \"blobPath\", \"metadata*\"], \"query\": \"?0\"}}")
	Page<MetaFile> search(String searchText, Pageable pageable);

	@Modifying
	void deleteAllByIdIn(List<String> ids);
}
