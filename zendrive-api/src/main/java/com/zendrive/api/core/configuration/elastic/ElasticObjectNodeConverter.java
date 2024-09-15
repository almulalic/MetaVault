package com.zendrive.api.core.configuration.elastic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.NonNull;
import org.springframework.data.elasticsearch.core.mapping.PropertyValueConverter;

public class ElasticObjectNodeConverter implements PropertyValueConverter {
    ObjectMapper mapper = new ObjectMapper();

    @Override
    public @NonNull Object write(@NonNull Object value) {
        return value;
    }

    @Override
    public @NonNull ObjectNode read(@NonNull Object value) {
        return mapper.convertValue(value, ObjectNode.class);
    }
}