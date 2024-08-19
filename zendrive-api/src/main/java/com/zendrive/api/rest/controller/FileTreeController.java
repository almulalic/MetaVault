package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.auth.User;
import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.rest.model.FileTreeViewDTO;
import com.zendrive.api.core.service.metafile.FileTreeService;
import com.zendrive.api.rest.model.dto.metafile.BulkDeleteDto;
import com.zendrive.api.rest.model.dto.metafile.BulkGetDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
    public ResponseEntity<FileTreeViewDTO> getRoot(
      HttpServletRequest request
    ) {
        User user = ((User) request.getAttribute("user"));
        return ResponseEntity.ok(fileTreeService.getFileTreeRoot(user.getRoles()));
    }

    @RequestMapping(method = RequestMethod.GET, path = "/tree/{fileId}")
    public ResponseEntity<FileTreeViewDTO> get(
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
    
    @RequestMapping(method = RequestMethod.POST, path = "/find/bulk")
    public ResponseEntity<List<MetaFile>> getFiles(
      @RequestBody
      @Valid BulkGetDto dto
    ) {
        return ResponseEntity.ok(fileTreeService.getFiles(dto.getMetafileIds()));
    }

    @RequestMapping(method = RequestMethod.POST, path = "/delete/bulk")
    public ResponseEntity<Boolean> bulkDelete(
      @RequestBody
      @Valid BulkDeleteDto dto
    ) {
        return ResponseEntity.ok(fileTreeService.bulkDelete(dto.getIds()));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{fileId}")
    public ResponseEntity<Boolean> delete(
      @PathVariable String fileId
    ) {
        return ResponseEntity.ok(fileTreeService.delete(fileId));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "bulk")
    public ResponseEntity bulkUpload(
      @RequestBody
      @Valid List<MetaFile> body
    ) {
        return ResponseEntity.ok(fileTreeService.bulkUpload(body));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "")
    public ResponseEntity bulkUpload() {
        return ResponseEntity.ok(fileTreeService.deleteAll());
    }

    @RequestMapping(method = RequestMethod.GET, path = "/search")
    public ResponseEntity<List<MetaFile>> search(
      @RequestParam String searchText
    ) {
        return ResponseEntity.ok(fileTreeService.search(searchText));
    }
}
