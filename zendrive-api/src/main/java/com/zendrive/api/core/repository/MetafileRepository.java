package com.zendrive.api.core.repository;

import com.zendrive.api.core.model.metafile.MetaFile;
import jakarta.transaction.Transactional;
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

    @Query("{\"bool\":{\"must\":[{\"match\":{\"previous\":\"?0\"}}]}}")
    Iterable<MetaFile> findAllPrevious(String previousId);

    @Query(
      "{ \"bool\": { \"must\": [ { \"terms\": { \"id.keyword\": ?0 } }, { \"terms\": { \"permissions.read.keyword\": ?1 } } ] } }"
    )
    List<MetaFile> findMultiple(List<String> ids, List<String> roles);

    @Query("{\"bool\":{\"must\":[{\"match\":{\"name\":\"root\"}}]}}")
    MetaFile getRootNode();

    // Instead of doing full text search, allow partial/fuzzy search without wildcards
//    @Query("{\"bool\":{\"must\":[{\"match\":{\"name\":{\"query\":\"?0\", \"fuzziness\":\"AUTO\"}}}]}}")
    //    @Query("{\"bool\":{\"must\":[{\"match\":{\"name\":\"?0\"}}]}}")
    @Query("{\"bool\":{\"must\":[{\"query_string\":{\"default_field\":\"name\",\"query\":\"*?0*\"}}]}}")
    List<MetaFile> search(String searchText);

    @Modifying
    void deleteAllByIdIn(List<String> ids);
}
