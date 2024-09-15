package com.zendrive.api.core.service.metafile;

import com.zendrive.api.core.model.dao.pgdb.auth.Role;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.model.metafile.StorageConfig;
import com.zendrive.api.core.repository.zendrive.pgdb.UserFavoriteRepository;
import com.zendrive.api.core.service.s3.S3Utils;
import com.zendrive.api.core.service.task.TaskService;
import com.zendrive.api.core.task.model.parameters.DeleteTaskParameters;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.exception.ForbiddenException;
import com.zendrive.api.rest.models.FileTreeViewDTO;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import com.zendrive.api.rest.models.dto.job.CreateTaskResponse;
import com.zendrive.api.rest.models.dto.metafile.ResourceResponse;
import com.zendrive.api.rest.models.dto.metafile.SearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
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

	public List<MetaFile> recursiveList(String startId) {
		MetaFile start = get(startId).orElseThrow(() -> new BadRequestException("Start file not found!"));
		List<MetaFile> metaFiles = new ArrayList<>();

		recursiveFetch(start, metaFiles);

		return metaFiles;
	}

	private void recursiveFetch(MetaFile file, List<MetaFile> metaFiles) {
		metaFiles.add(file);

		if (file.getChildren() != null && !file.getChildren().isEmpty()) {
			file.getChildren().stream()
					.map(this::get)
					.filter(Optional::isPresent)
					.map(Optional::get)
					.forEach(child -> recursiveFetch(child, metaFiles));
		}
	}

	public MetaFile getRoot() {
		return this.metafileRepository.getRootNode()
																	.orElseThrow(() -> new IllegalArgumentException("Root file not found!"));
	}

	public Optional<MetaFile> get(String id) {
		if (id.isEmpty()) {
			throw new IllegalArgumentException("Id must not be empty.");
		}

		return metafileRepository.findById(id);
	}

	public MetaFile findByPath(String path) {
		if (path.isEmpty()) {
			throw new IllegalArgumentException("Id must not be empty.");
		}

		path = removeTrailingSlash(path);

		return metafileRepository.findByBlobPath(path)
														 .orElseThrow(() -> new IllegalArgumentException("Metafile not found"));
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

		if (file.getChildren() != null) {
			throw new BadRequestException("Can't delete folder! Use the delete job.");
		}

		userFavoriteRepository.deleteAllByMetafileId(List.of(file.getId()));
		metafileRepository.deleteAllByIdIn(List.of(file.getId()));

		MetaFile root = getRoot();

		if (root.getChildren().contains(file.getId())) {
			root.setChildren(root.getChildren().stream().filter(x -> x.equals(file.getId())).toList());
			metafileRepository.save(root);
		}

		return true;
	}

	public List<CreateTaskResponse<DeleteTaskRequest>> bulkDeleteFolder(List<String> ids) {
		return ids.stream()
							.map(this::deleteFolder)
							.collect(Collectors.toList());
	}

	public CreateTaskResponse<DeleteTaskRequest> deleteFolder(String id) {
		MetaFile folder = metafileRepository
												.findById(id)
												.orElseThrow(() -> new BadRequestException("Metafolder not found!"));

		if (folder.getBlobPath().equals("/")) {
			throw new ForbiddenException("Can't delete root file!");
		}

		MetaFile root = getRoot();

		if (root.getChildren().contains(folder.getId())) {
			root.setChildren(root.getChildren().stream().filter(x -> !x.equals(folder.getId())).toList());
			metafileRepository.save(root);
		}

		return taskService.runDelete(new DeleteTaskParameters(folder.getId()));
	}

	public Page<MetaFile> search(SearchRequest dto) {
		if (dto.getQuery().isEmpty()) {
			return Page.empty();
		}

		return metafileRepository.search(dto.getQuery(), PageRequest.of(dto.getPage(), dto.getPageSize()));
	}

	public ResourceResponse getBlobAsResource(String metafileId) throws IOException {
		MetaFile metaFile = get(metafileId).orElseThrow(() -> new IllegalArgumentException("Metafile not found"));

		Path filePath = Paths.get(metaFile.getBlobPath()).normalize();
		Resource resource = getResource(
			metaFile.getBlobPath(),
			metaFile.getConfig().getStorageConfig()
		);

		if (!resource.exists() || !resource.isReadable()) {
			throw new IllegalArgumentException("File not found: " + filePath);
		}

		return new ResourceResponse(resource, metaFile.getBlobPath());
	}

	private Resource getResource(String path, StorageConfig storageConfig) throws IOException {
		return switch (storageConfig.getType()) {
			case LOCAL -> new FileSystemResource(path.replace("file://", ""));
			case S3 -> S3Utils.getResource(minioS3Client, path);
			default -> throw new IllegalArgumentException();
		};
	}
}
