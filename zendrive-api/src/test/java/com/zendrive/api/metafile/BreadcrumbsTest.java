package com.zendrive.api.metafile;

import com.zendrive.api.configuration.MinioConfig;
import com.zendrive.api.core.model.metafile.Breadcrumb;
import com.zendrive.api.core.model.metafile.StorageConfig;
import com.zendrive.api.core.model.metafile.StorageType;
import com.zendrive.api.core.utils.MetafileUtil;
import org.apache.commons.vfs2.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import static com.zendrive.api.TestUtils.assertListContainedInMatrix;
import static com.zendrive.api.core.task.handler.JobHandler.generateValidUri;
import static com.zendrive.api.core.task.handler.JobHandler.getFilesFromSource;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class BreadcrumbsTest {
	private static FileSystemManager fsManager;
	private static final String LOCAL_INPUT_PATH = "file:///Users/admin/Desktop/fagz/Semestar_VI/sdp/zencloud/zendrive-api/src/test/resources/metafile/breadcrumbs/";
	private static final String S3_INPUT_PATH = "s3://minio.local/zendrive/resources/metafile/breadcrumbs/";

	private static final List<List<Breadcrumb>> DEFAULT_EXPECTED_BREADCRUMBS = List.of(
		Breadcrumb.fromList(List.of("breadcrumbs")),
		Breadcrumb.fromList(List.of("breadcrumbs", "dir")),
		Breadcrumb.fromList(List.of("breadcrumbs", "file")),
		Breadcrumb.fromList(List.of("breadcrumbs", "dir", "dirFile")),
		Breadcrumb.fromList(List.of("breadcrumbs", "dir", "nestedDir")),
		Breadcrumb.fromList(List.of("breadcrumbs", "dir", "nestedDir", "nestedDirFile"))
	);

	private List<List<Breadcrumb>> expectedBreadcrumbs = new ArrayList<>();

	@BeforeAll
	public static void setup() throws FileSystemException {
		fsManager = VFS.getManager();
	}

	@BeforeEach
	public void beforeEach() {
		expectedBreadcrumbs = new ArrayList<>(DEFAULT_EXPECTED_BREADCRUMBS);
	}

	@Test
	public void testLocal() throws FileSystemException, URISyntaxException {
		StorageConfig storageConfig = StorageConfig.Builder()
																							 .withType(StorageType.LOCAL)
																							 .build();

		String inputPath = generateValidUri(LOCAL_INPUT_PATH, storageConfig);

		expectedBreadcrumbs.add(Breadcrumb.fromList(List.of("breadcrumbs", "dir", "nestedDir", "nestedDirDir")));
		testInternal(inputPath, storageConfig);
	}

	@Test
	public void testS3() throws FileSystemException, URISyntaxException {
		StorageConfig storageConfig = StorageConfig.Builder()
																							 .withType(StorageType.S3)
																							 .withCredentials("minio")
																							 .build();

		String inputPath = generateValidUri(S3_INPUT_PATH, storageConfig);

		testInternal(inputPath, storageConfig);
	}

	public void testInternal(String inputPath, StorageConfig storageConfig)
		throws FileSystemException, URISyntaxException {
		URI inputUri = new URI(inputPath);

		FileObject startDir = fsManager.resolveFile(
			inputPath,
			storageConfig.getType() == StorageType.LOCAL ? new FileSystemOptions() : MinioConfig.s3FsMinioOptions()
		);

		FileObject[] files = getFilesFromSource(
			startDir,
			Comparator
				.comparingInt((FileObject file) -> file.getName().getPath().length())
				.thenComparing(file -> file.getName().getPath())
		);

		List<List<Breadcrumb>> generatedBreadcrumbs = Arrays.stream(files)
																												.map(file -> MetafileUtil.generateBreadcrumbs(file, inputUri))
																												.toList();

		for (List<Breadcrumb> pathBreadcrumbs : generatedBreadcrumbs) {
			assertListContainedInMatrix(pathBreadcrumbs, expectedBreadcrumbs);
			assertTrue(pathBreadcrumbs.stream().allMatch(x -> x.getId() == null));
		}

		assertEquals(expectedBreadcrumbs.size(), generatedBreadcrumbs.size());
	}
}
