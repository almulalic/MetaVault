package com.zendrive.api.core.task.handler;

import com.zendrive.api.core.service.metafile.MetafileService;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DeleteTaskRequestHandler extends JobHandler<DeleteTaskRequest> {
	private final MetafileService metafileService;

	@Override
	public void execute(DeleteTaskRequest deleteTaskRequest) throws IOException {
		List<String> directoryIds = deleteTaskRequest.parameters().getDirectoryIds();

		LOGGER.info(
			"Initializing 'Delete Task' for metafiles: ID: '%s'".formatted(directoryIds)
		);

		List<MetaFile> metafiles = directoryIds.stream()
																					 .map(this.metafileService::get)
																					 .toList();

		LOGGER.info("Found %s metafiles to delete.".formatted(metafiles.size()));
		setProgress(50);

		try {
			metafiles.forEach(metaFile -> metafileService.delete(metaFile.getId()));
			LOGGER.info("Successfully deleted files!");
		} catch (Exception ex) {
			handleException(ex);
			throw ex;
		} finally {
			setProgress(100);
		}
	}
}
