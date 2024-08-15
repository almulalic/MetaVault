package com.zendrive.api.core.model.user;

import com.zendrive.api.core.model.auth.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
@Table(name = "user_favorites")
public class UserFavorite {
    @Id
    @UuidGenerator
    @Column(length = 36, nullable = false, updatable = false)
    private String id;

    @Column(name = "userId", nullable = false)
    private Long userId;

    private String metafileId;
}
