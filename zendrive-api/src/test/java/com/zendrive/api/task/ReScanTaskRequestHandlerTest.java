//package com.zendrive.api.task;
//
//import com.zendrive.api.core.model.dao.elastic.metafile.MetaFile;
//import com.zendrive.api.core.model.metafile.FileStats;
//import com.zendrive.api.core.model.task.ConflictStrategy;
//import com.zendrive.api.core.repository.zendrive.elastic.MetafileRepository;
//import com.zendrive.api.core.service.metafile.MetafileService;
//import com.zendrive.api.core.task.handler.ReScanTaskRequestHandler;
//import com.zendrive.api.core.task.model.parameters.ReScanTaskParameters;
//import com.zendrive.api.core.task.model.request.ReScanTaskRequest;
//import com.zendrive.api.core.utils.MetafileUtil;
//import org.apache.commons.vfs2.FileObject;
//import org.apache.commons.vfs2.FileSystemManager;
//import org.apache.commons.vfs2.VFS;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ReScanTaskRequestHandlerTest {
//
//	@Mock
//	private MetafileRepository metafileRepository;
//
//	@Mock
//	private MetafileService metafileService;
//
//	@InjectMocks
//	private ReScanTaskRequestHandler reScanTaskRequestHandler;
//
//	@BeforeEach
//	void setUp() {
//		MockitoAnnotations.openMocks(this);
//	}
//
//	@Test
//	void testExecute_ReScanTask_Successful() throws Exception {
//		// Arrange
//		ReScanTaskRequest request = mock(ReScanTaskRequest.class);
//		ReScanTaskParameters params = mock(ReScanTaskParameters.class);
//
//		when(request.parameters()).thenReturn(params);
//		when(params.getDirectoryId()).thenReturn("dir123");
//		when(params.getFileConflictStrategy()).thenReturn(ConflictStrategy.IGNORE);
//
//		MetaFile parentMetafile = new MetaFile();
//		parentMetafile.setId("dir123");
//		parentMetafile.setBlobPath("/path/to/directory");
//
//		FileObject fileObject = mock(FileObject.class);
//		FileSystemManager fsManager = VFS.getManager();
//
//		when(metafileRepository.findById("dir123")).thenReturn(Optional.of(parentMetafile));
//		when(metafileService.recursiveList("dir123")).thenReturn(List.of(parentMetafile));
//		when(fileObject.getPath()).thenReturn("/path/to/directory");
//
//		FileStats fileStats = new FileStats();
//		fileStats.fileCount = 10;
//		fileStats.directoryCount = 2;
//		fileStats.totalSize = 1024;
//
//		when(MetafileUtil.calculateFileStats(fileObject)).thenReturn(fileStats);
//		FileObject[] files = new FileObject[] {fileObject};
//		when(reScanTaskRequestHandler.getFilesFromSource(any(), any())).thenReturn(files);
//
//		// Act
//		reScanTaskRequestHandler.execute(request);
//
//		// Assert
//		verify(metafileRepository, times(1)).saveAll(anyList());
//		verify(metafileService, times(1)).recursiveList("dir123");
//	}
//
//	@Test
//	void testExecute_ReScanTask_InvalidDirectoryId() {
//		// Arrange
//		ReScanTaskRequest request = mock(ReScanTaskRequest.class);
//		ReScanTaskRequestParams params = mock(ReScanTaskRequestParams.class);
//
//		when(request.parameters()).thenReturn(params);
//		when(params.getDirectoryId()).thenReturn("invalidDir");
//
//		when(metafileRepository.findById("invalidDir")).thenReturn(Optional.empty());
//
//		// Act & Assert
//		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//			reScanTaskRequestHandler.execute(request);
//		});
//
//		assertEquals("This path was not scanned before. Run a scan task first", exception.getMessage());
//	}
//
//	@Test
//	void testExecute_ReScanTask_DirectoryIsAFile() {
//		// Arrange
//		ReScanTaskRequest request = mock(ReScanTaskRequest.class);
//		ReScanTaskRequestParams params = mock(ReScanTaskRequestParams.class);
//
//		when(request.parameters()).thenReturn(params);
//		when(params.getDirectoryId()).thenReturn("dir123");
//
//		MetaFile metaFile = new MetaFile();
//		metaFile.setId("dir123");
//		metaFile.setFile(true); // Simulating a file instead of a directory
//
//		when(metafileRepository.findById("dir123")).thenReturn(Optional.of(metaFile));
//
//		// Act & Assert
//		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//			reScanTaskRequestHandler.execute(request);
//		});
//
//		assertEquals("Provided path must be a directory", exception.getMessage());
//	}
//}
//
