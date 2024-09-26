package com.zendrive.api.core.service.metafile;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.task.StorageConfig;
import com.zendrive.api.core.repository.zendrive.pgdb.UserFavoriteRepository;
import com.zendrive.api.core.service.s3.S3Utils;
import com.zendrive.api.core.service.task.TaskService;
import com.zendrive.api.exception.InvalidArgumentsException;
import com.zendrive.api.exception.ZendriveErrorCode;
import com.zendrive.api.exception.ZendriveException;
import com.zendrive.api.rest.models.FileTreeViewDTO;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.rest.models.dto.metafile.ResourceResponse;
import com.zendrive.api.rest.models.dto.metafile.SearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetafileService {
	private final MetafileRepository metafileRepository;
	private final UserFavoriteRepository userFavoriteRepository;
	private final TaskService taskService;
	private final S3Client minioS3Client;

	public FileTreeViewDTO getRootTree(List<Role> roles) {
		return getTree(
			getRoot().getId(),
			roles
		);
	}

	public FileTreeViewDTO getTree(String id, List<Role> roles) {
		FileTreeViewDTO fileTreeViewDTO = new FileTreeViewDTO();

		if (roles == null || roles.isEmpty()) {
			throw new ZendriveException("Roles must be provided!", ZendriveErrorCode.INVALID_ARGUMENTS);
		}

		List<String> roleIds = roles.stream().map(Role::getId).toList();

		MetaFile currentFile = metafileRepository
														 .findById(id)
														 .orElseThrow(() -> new InvalidArgumentsException("Metafile not found!"));

		if (
			!currentFile.getName().equals("root") &&
			!currentFile.getBlobPath().equals("/") &&
			currentFile.getPermissions().getRead().stream().noneMatch(roleIds::contains)
		) {
			throw new ZendriveException("Forbidden access to metafile!", ZendriveErrorCode.PERMISSION_DENIED);
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

	public List<MetaFile> recursiveList(String startId) {
		MetaFile start = get(startId);
		List<MetaFile> metaFiles = new ArrayList<>();

		recursiveFetch(start, metaFiles);

		return metaFiles;
	}

	private void recursiveFetch(MetaFile file, List<MetaFile> metaFiles) {
		metaFiles.add(file);

		if (file.getChildren() != null && !file.getChildren().isEmpty()) {
			file.getChildren().stream()
					.map(this::get)
					.forEach(child -> recursiveFetch(child, metaFiles));
		}
	}

	public MetaFile getRoot() {
		return this.metafileRepository.getRootNode()
																	.orElseThrow(() -> new ZendriveException(
																		"Root file not found!",
																		ZendriveErrorCode.GENERAL
																	));
	}

	public MetaFile get(String id) {
		if (id.isEmpty()) {
			throw new InvalidArgumentsException("Id must not be empty.");
		}

		return metafileRepository.findById(id)
														 .orElseThrow(() -> new InvalidArgumentsException("Metafile not found"));
	}

	public MetaFile findByPath(String path) {
		if (path.isEmpty()) {
			throw new InvalidArgumentsException("Id must not be empty.");
		}

		path = removeTrailingSlash(path);

		return metafileRepository.findByBlobPath(path)
														 .orElseThrow(() -> new InvalidArgumentsException("Metafile not found"));
	}

	protected static String removeTrailingSlash(String path) {
		if (path != null && path.endsWith("/")) {
			return path.substring(0, path.length() - 1);
		}
		return path;
	}

	public List<MetaFile> get(List<String> ids) {
		return ids.stream()
							.map(metafileRepository::findById)
							.filter(Optional::isPresent)
							.map(Optional::get)
							.collect(Collectors.toList());
	}

	public boolean delete(String id) {
		Optional<MetaFile> optionalMetaFile = metafileRepository.findById(id);

		if (optionalMetaFile.isEmpty()) {
			return false;
		}

		MetaFile metaFile = optionalMetaFile.get();

		if (metaFile.getBlobPath().equals("/")) {
			throw new ZendriveException("Can't delete root file!", ZendriveErrorCode.PERMISSION_DENIED);
		}

		if (metaFile.getChildren() != null && metaFile.getChildren().size() > 0) {
			metaFile.getChildren().forEach(this::delete);
		}

		userFavoriteRepository.deleteAllByMetafileId(List.of(metaFile.getId()));
		metafileRepository.deleteAllByIdIn(List.of(metaFile.getId()));

		MetaFile previous = get(metaFile.getPrevious());

		if (previous.getChildren() != null) {
			previous.setChildren(previous.getChildren().stream().filter(x -> !x.equals(metaFile.getId())).toList());
			metafileRepository.save(previous);
		}

		return true;
	}

	public boolean bulkDelete(List<String> ids) {
		return ids.stream()
							.allMatch(this::delete);
	}

	public Page<MetaFile> search(SearchRequest dto) {
		if (dto.getQuery().isEmpty()) {
			return Page.empty();
		}

		return metafileRepository.search(dto.getQuery(), PageRequest.of(dto.getPage(), dto.getPageSize()));
	}

	public ResourceResponse getBlobAsResource(String metafileId) throws IOException {
		MetaFile metaFile = get(metafileId);

		Path filePath = Paths.get(metaFile.getBlobPath()).normalize();
		Resource resource = getResource(
			metaFile.getBlobPath(),
			metaFile.getConfig().getStorageConfig()
		);

		if (!resource.exists() || !resource.isReadable()) {
			throw new InvalidArgumentsException("File not found: " + filePath);
		}

		return new ResourceResponse(resource, metaFile.getBlobPath());
	}

	private Resource getResource(String path, StorageConfig storageConfig) throws IOException {
		return switch (storageConfig.getType()) {
			case LOCAL -> new FileSystemResource(path.replace("file://", ""));
			case S3 -> S3Utils.getResource(minioS3Client, path);
			default ->
				throw new InvalidArgumentsException("Unrecognized storage type: %s".formatted(storageConfig.getType()));
		};
	}
}
