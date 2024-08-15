package com.zendrive.api.rest.model.dto.user;

import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.model.user.UserFavorite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class UserFavoriteResponse {
    private String id;
    private Long userId;
    private MetaFile metafile;

    public UserFavoriteResponse(UserFavorite userFavorite, MetaFile metafile) {
        this.id = userFavorite.getId();
        this.userId = userFavorite.getUserId();
        this.metafile = metafile;
    }
}
