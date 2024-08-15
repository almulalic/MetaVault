package com.zendrive.api.core.repository;

import com.zendrive.api.core.model.user.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, String> {
    List<UserFavorite> findAllByUserId(Long userId);

    @Query("SELECT uf FROM UserFavorite uf WHERE uf.userId = ?1 AND uf.metafileId = ?2")
    Optional<UserFavorite> findUsersFavoriteByMetafileId(Long userId, String metafileId);
}