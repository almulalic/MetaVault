package com.zendrive.api.core.task.handler;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkOperation;
import com.zendrive.api.core.task.model.request.DeleteTaskRequest;
import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
import org.jobrunr.jobs.annotations.Job;
import org.jobrunr.jobs.context.JobDashboardLogger;
import org.jobrunr.jobs.context.JobDashboardProgressBar;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DeleteTaskRequestHandler implements JobRequestHandler<DeleteTaskRequest> {
	private JobDashboardLogger LOGGER;
	private JobDashboardProgressBar progressBar;
	private final MetafileRepository metafileRepository;
	private ElasticsearchClient elasticsearchClient;

	public DeleteTaskRequestHandler(
		MetafileRepository metafileRepository,
		ElasticsearchClient elasticsearchClient
	) {
		super();
		this.metafileRepository = metafileRepository;
		this.elasticsearchClient = elasticsearchClient;
	}

	public void run(DeleteTaskRequest deleteTaskRequest) throws IOException {
		this.LOGGER = jobContext().logger();
		this.progressBar = jobContext().progressBar(10000);

		String directoryId = deleteTaskRequest.parameters().getDirectoryId();

		MetaFile start = this.metafileRepository
											 .findById(directoryId)
											 .orElseThrow(() -> new RuntimeException("Input not found!"));

		LOGGER.info(
			"Initializing 'Delete Task' for directory: Name: '%s, ID: '%s'".formatted(start.getName(), start.getId())
		);
		this.progressBar.setProgress(1000);

		LOGGER.info("Found %s metafiles to delete.".formatted(start));
		List<BulkOperation> metafilesToDelete = recursiveFindFiles(start)
																							.stream()
																							.filter(id -> id.length() > 0)
																							.map(id -> BulkOperation.of(b -> b.delete(d -> d
																																															 .index("file_tree")
																																															 .id(id)
																																					)
																									 )
																							)
																							.collect(Collectors.toList());

		LOGGER.info("Found %s metafiles to delete.".formatted(metafilesToDelete.size()));
		this.progressBar.setProgress(5000);

		BulkRequest bulkRequest = new BulkRequest.Builder()
																.operations(metafilesToDelete)
																.build();

		try {
			BulkResponse bulkResponse = elasticsearchClient.bulk(bulkRequest);
			if (bulkResponse.errors()) {
				LOGGER.error("Bulk delete operation had failures.");
				bulkResponse.items().forEach(item -> {
					if (item.error() != null) {
						System.err.println("Error deleting document ID: " + item.id() + " - " + item.error().reason());
					}
				});
			} else {
				LOGGER.info("Bulk delete operation completed successfully.");
			}

			LOGGER.info("Successfully deleted folder!");
		} catch (Exception ex) {
			LOGGER.error("An unexpected error occurred!");
			LOGGER.error("Message: %s!".formatted(ex.getMessage()));
			LOGGER.error("Stack Trace: %s!".formatted(Arrays.toString(ex.getStackTrace())));

			throw ex;
		} finally {
			this.progressBar.setProgress(10000);
		}
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
}
