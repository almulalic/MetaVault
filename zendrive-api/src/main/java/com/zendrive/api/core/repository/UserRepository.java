package com.zendrive.api.core.repository;

import com.zendrive.api.core.model.user.UserData;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface UserRepository extends ElasticsearchRepository<UserData, String> {
}
