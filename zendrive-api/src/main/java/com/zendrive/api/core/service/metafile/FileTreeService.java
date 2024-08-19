package com.zendrive.api.core.service.metafile;

import com.zendrive.api.core.model.auth.Role;
import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.repository.UserFavoriteRepository;
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
    private final UserFavoriteRepository userFavoriteRepository;

    public FileTreeService(MetafileRepository metafileRepository, UserFavoriteRepository userFavoriteRepository) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.metafileRepository = metafileRepository;

    }

    public FileTreeViewDTO getFileTreeRoot(List<Role> roles) {
        return getFileTree(this.metafileRepository.getRootNode().getId(), roles);
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

    public List<MetaFile> getFiles(List<String> ids) {
        return ids.stream()
                 .map(metafileRepository::findById)
                 .filter(Optional::isPresent)
                 .map(Optional::get)
                 .collect(Collectors.toList());
    }

    public boolean bulkDelete(List<String> ids) {
        ids.forEach(this::delete);
        return true;
    }

    public boolean delete(String id) {
        MetaFile file = metafileRepository
                          .findById(id)
                          .orElseThrow(() -> new BadRequestException("Metafile not found!"));

        if (file.getBlobPath().equals("/")) {
            throw new ForbiddenException("Can't delete root file!");
        }

        List<String> deletedIds = recursiveFindFiles(file);

        userFavoriteRepository.deleteAllByMetafileId(deletedIds);
        metafileRepository.deleteAllByIdIn(deletedIds);

        return true;
    }

    public List<String> recursiveFindFiles(MetaFile file) {
        List<String> deletedFileIds = new ArrayList<>();

        if (file.getChildren() != null && !file.getChildren().isEmpty()) {
            for (String childId : file.getChildren()) {
                metafileRepository.findById(childId).ifPresent(child -> {
                    deletedFileIds.add(child.getId());
                    deletedFileIds.addAll(recursiveFindFiles(child));
                });
            }
        }

        deletedFileIds.add(file.getId());

        return deletedFileIds;
    }


    public int bulkUpload(List<MetaFile> metaFiles) {
        metafileRepository.saveAll(metaFiles);

        return 0;
    }

    public int deleteAll() {
        metafileRepository.deleteAll();

        return 0;
    }

    public List<MetaFile> search(String searchText) {
        if (searchText.isEmpty()) {
            return new ArrayList<>();
        }

        return metafileRepository.search(searchText);
    }
}
