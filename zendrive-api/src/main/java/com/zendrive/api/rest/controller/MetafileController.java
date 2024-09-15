package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.dao.pgdb.user.User;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.exception.BadRequestException;
import com.zendrive.api.rest.models.FileTreeViewDTO;
import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.rest.models.dto.job.CreateTaskResponse;
import com.zendrive.api.rest.models.dto.metafile.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
//@ApiVersion(1)
@RequestMapping("api/metafile")
@RequiredArgsConstructor
public class MetafileController {
	private final MetafileService metafileService;

	@RequestMapping(method = RequestMethod.GET, path = "/tree/root")
	public ResponseEntity<FileTreeViewDTO> getRoot(
		HttpServletRequest request
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(metafileService.getRootTree(user.getRoles()));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/tree/{metafileId}")
	public ResponseEntity<FileTreeViewDTO> get(
		HttpServletRequest request,
		@PathVariable String metafileId
	) {
		User user = ((User) request.getAttribute("user"));
		return ResponseEntity.ok(metafileService.getTree(metafileId, user.getRoles()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/exists")
	public ResponseEntity<MetaFile> exists(
		@RequestBody
		@Valid GenericMetafileDto dto
	) {
		return ResponseEntity.ok(metafileService.findByPath(dto.getUri()));
	}

	@RequestMapping(method = RequestMethod.GET, path = "{fileId}")
	public ResponseEntity<Optional<MetaFile>> getFile(
		@PathVariable String fileId
	) {
		return ResponseEntity.ok(metafileService.get(fileId));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/find/bulk")
	public ResponseEntity<List<MetaFile>> getFiles(
		@RequestBody
		@Valid BulkGetDto dto
	) {
		return ResponseEntity.ok(metafileService.get(dto.getMetafileIds()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/delete/file/bulk")
	public ResponseEntity<Boolean> bulkFileDelete(
		@RequestBody
		@Valid BulkDeleteDto dto
	) {
		return ResponseEntity.ok(metafileService.bulkDelete(dto.getIds()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/delete/file/{metafileId}")
	public ResponseEntity<Boolean> deleteFile(
		@PathVariable String metafileId
	) {
		return ResponseEntity.ok(metafileService.delete(metafileId));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/delete/folder/bulk")
	public ResponseEntity<List<CreateTaskResponse<DeleteTaskRequest>>> bulkDelete(
		@RequestBody
		@Valid BulkDeleteDto dto
	) {
		return ResponseEntity.ok(metafileService.bulkDeleteFolder(dto.getIds()));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/delete/folder/{metafileId}")
	public ResponseEntity<CreateTaskResponse<DeleteTaskRequest>> deleteFolder(
		@PathVariable String metafileId
	) {
		return ResponseEntity.ok(metafileService.deleteFolder(metafileId));
	}

	@RequestMapping(method = RequestMethod.POST, path = "/search")
	public ResponseEntity<Page<MetaFile>> search(
		@RequestBody
		@Valid SearchRequest dto
	) {
		return ResponseEntity.ok(metafileService.search(dto));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/download/{metafileId}")
	public ResponseEntity<Resource> download(
		@PathVariable String metafileId
	) {
		ResourceResponse resourceResponse;

		try {
			resourceResponse = metafileService.getBlobAsResource(metafileId);
		} catch (MalformedURLException | FileNotFoundException e) {
			throw new BadRequestException("File not found");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		String contentType;
		String fileName;

		try {
			contentType = Files.probeContentType(Paths.get(resourceResponse.getResource().getURI()));
		} catch (IOException e) {
			contentType = "application/octet-stream";
		}

		try {
			fileName = Paths.get(resourceResponse.getResource().getURI()).getFileName().toString();
		} catch (IOException | RuntimeException e) {
			fileName = Path.of(resourceResponse.getBlobPath()).getFileName().toString();
		}

		return ResponseEntity.ok()
												 .contentType(MediaType.parseMediaType(contentType))
												 .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
												 .header("X-File-Name", fileName)
												 .body(resourceResponse.getResource());
	}
}
