package com.zendrive.api.core.repository.zendrive.pgdb;

import com.zendrive.api.core.model.dao.pgdb.user.UserFavorite;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Transactional
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, String> {
	List<UserFavorite> findAllByUserId(Long userId);

	@Query("SELECT uf FROM UserFavorite uf WHERE uf.userId = ?1 AND uf.metafileId = ?2")
	Optional<UserFavorite> findUsersFavoriteByMetafileId(Long userId, String metafileId);

	@Modifying
	@Query("DELETE FROM UserFavorite uf WHERE uf.metafileId IN ?1")
	void deleteAllByMetafileId(List<String> ids);
}