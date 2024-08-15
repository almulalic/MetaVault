package com.zendrive.api.core.service.metafile;

import com.zendrive.api.core.model.auth.Role;
import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.exception.ForbiddenException;
import com.zendrive.api.rest.model.FileTreeViewDTO;
import com.zendrive.api.core.repository.MetafileRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileTreeService {
    private final MetafileRepository metafileRepository;

    public FileTreeService(MetafileRepository metafileRepository) {
        this.metafileRepository = metafileRepository;
    }

    public MetaFile getFileTreeRoot() {
        return this.metafileRepository.getRootNode();
    }

    public FileTreeViewDTO getFileTree(String id, List<Role> roles) {
        FileTreeViewDTO fileTreeViewDTO = new FileTreeViewDTO();

        if (roles == null || roles.isEmpty()) {
            throw new BadRequestException("Roles must be provided!");
        }

        List<String> roleIds = roles.stream().map(Role::getId).toList();

        MetaFile currentFile = metafileRepository
                                 .findById(id)
                                 .orElseThrow(() -> new BadRequestException("Metafile not found!"));

        if (
          !currentFile.getName().equals("root") &&
          !currentFile.getBlobPath().equals("/") &&
          currentFile.getPermissions().getRead().stream().noneMatch(roleIds::contains)
        ) {
            throw new ForbiddenException("Forbidden access to metafile!");
        }

        fileTreeViewDTO.setCurrent(currentFile);

        List<MetaFile> currentView = metafileRepository.findMultiple(
          currentFile.getChildren()
            .stream()
            .filter(Objects::nonNull)
            .collect(Collectors.toList()),
          roleIds
        );
        fileTreeViewDTO.setCurrentView(currentView);

        return fileTreeViewDTO;
    }

    public Optional<MetaFile> getFile(String id) {
        return metafileRepository.findById(id);
    }

    public boolean deleteFile(String id) {
        MetaFile file = metafileRepository
                          .findById(id)
                          .orElseThrow(() -> new BadRequestException("Metafile not found!"));

        recursiveDeleteFile(file);
        return true;
    }

    public void recursiveDeleteFile(MetaFile file) {
        if (file.getChildren() != null && !file.getChildren().isEmpty()) {
            for (String childId : file.getChildren()) {
                MetaFile child = metafileRepository.findById(childId)
                                   .orElseThrow(() -> new BadRequestException("Metafile not found!"));

                recursiveDeleteFile(child);
            }
        }

        metafileRepository.delete(file);
    }

    public int bulkUpload(List<MetaFile> metaFiles) {
        metafileRepository.saveAll(metaFiles);

        return 0;
    }

    public int deleteAll() {
        metafileRepository.deleteAll();

        return 0;
    }
}
