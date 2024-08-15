package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.auth.User;
import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.rest.model.FileTreeViewDTO;
import com.zendrive.api.core.service.metafile.FileTreeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
//@ApiVersion(1)
@RequestMapping("api/file")
public class FileTreeController {
    private final FileTreeService fileTreeService;

    public FileTreeController(FileTreeService fileTreeService) {
        this.fileTreeService = fileTreeService;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/tree/root")
    public ResponseEntity<MetaFile> getFileTreeRoot() {
        return ResponseEntity.ok(fileTreeService.getFileTreeRoot());
    }

    @RequestMapping(method = RequestMethod.GET, path = "/tree/{fileId}")
    public ResponseEntity<FileTreeViewDTO> getFileTree(
      HttpServletRequest request,
      @PathVariable String fileId
    ) {
        User user = ((User) request.getAttribute("user"));
        return ResponseEntity.ok(fileTreeService.getFileTree(fileId, user.getRoles()));
    }

    @RequestMapping(method = RequestMethod.GET, path = "{fileId}")
    public ResponseEntity<Optional<MetaFile>> getFile(
      @PathVariable String fileId
    ) {
        return ResponseEntity.ok(fileTreeService.getFile(fileId));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{fileId}")
    public ResponseEntity<Boolean> deleteFile(
      @PathVariable String fileId
    ) {
        return ResponseEntity.ok(fileTreeService.deleteFile(fileId));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "bulk")
    public ResponseEntity bulkUpload(
      @RequestBody List<MetaFile> body
    ) {
        return ResponseEntity.ok(fileTreeService.bulkUpload(body));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "")
    public ResponseEntity bulkUpload() {
        return ResponseEntity.ok(fileTreeService.deleteAll());
    }
}
