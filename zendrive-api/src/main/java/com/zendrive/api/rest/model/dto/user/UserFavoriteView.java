package com.zendrive.api.rest.model.dto.user;

import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.model.user.UserFavorite;
import com.zendrive.api.rest.model.dto.metafile.MetafileView;
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
    private MetafileView metaFileView;

    public UserFavoriteResponse(UserFavorite userFavorite, MetaFile metaFile) {
        this.id = userFavorite.getId();
        this.userId = userFavorite.getUserId();
        this.metaFileView = new MetafileView(metaFile);
    }
}
