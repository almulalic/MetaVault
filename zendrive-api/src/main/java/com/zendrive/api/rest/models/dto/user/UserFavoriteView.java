package com.zendrive.api.rest.models.dto.user;

import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.dao.pgdb.user.UserFavorite;
import com.zendrive.api.rest.models.dto.metafile.MetafileView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class UserFavoriteView {
	private String id;
	private Long userId;
	private MetafileView metafileView;

	public UserFavoriteView(UserFavorite userFavorite, MetaFile metaFile) {
		this.id = userFavorite.getId();
		this.userId = userFavorite.getUserId();
		this.metafileView = new MetafileView(metaFile);
	}
}
