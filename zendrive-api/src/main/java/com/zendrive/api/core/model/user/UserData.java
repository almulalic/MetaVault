package com.zendrive.api.core.model.user;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@AllArgsConstructor
@Document(indexName = "user_data")
public class UserData {
    @Id
    private String id;
}
