package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.auth.User;
import com.zendrive.api.core.model.user.UserFavorite;
import com.zendrive.api.core.service.user.UserService;
import com.zendrive.api.rest.model.dto.user.UserFavoriteDTO;
import com.zendrive.api.rest.model.dto.user.UserFavoriteView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @RequestMapping(method = RequestMethod.GET, path = "/projects")
    public ResponseEntity<String> getFileTree() {
        //        return ResponseEntity.ok(userService.getFileTree(fileId));
        return ResponseEntity.ok("");
    }

    @RequestMapping(method = RequestMethod.GET, path = "/metafile/favorite")
    public ResponseEntity<List<UserFavoriteView>> getFavorites(
      HttpServletRequest request
    ) {
        User user = ((User) request.getAttribute("user"));
        return ResponseEntity.ok(userService.getUserFavorites(user.getId()));
    }

    @RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite")
    public ResponseEntity<List<UserFavoriteView>> addToFavorites(
      HttpServletRequest request,
      @Valid
      @RequestBody
      UserFavoriteDTO userFavoriteDto
    ) {
        User user = ((User) request.getAttribute("user"));
        return ResponseEntity.ok(userService.addToFavorites(user.getId(), userFavoriteDto.getMetafiles()));
    }

    @RequestMapping(method = RequestMethod.POST, path = "/metafile/favorite/remove")
    public ResponseEntity<List<UserFavoriteView>> removeFromFavorites(
      HttpServletRequest request,
      @Valid
      @RequestBody
      UserFavoriteDTO userFavoriteDto
    ) {
        User user = ((User) request.getAttribute("user"));
        return ResponseEntity.ok(userService.removeFromFavorites(user.getId(), userFavoriteDto.getMetafiles()));
    }
}
