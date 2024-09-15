package com.zendrive.api;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.github.vfss3.S3FileSystemOptions;
import com.github.vfss3.shaded.com.amazonaws.auth.AnonymousAWSCredentials;
import com.github.vfss3.shaded.com.amazonaws.auth.BasicAWSCredentials;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.VFS;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

public class VFSIntegrationExample {

	public static void main(String[] args) throws IOException {

		S3FileSystemOptions options = new S3FileSystemOptions();
		//		options.setCredentialsProvider();
		options.setUseHttps(false);
		options.setServerSideEncryption(false);
		options.setCreateBucket(true);
		//		options.setCredentialsProvider(
		//			new AWSStaticCredentialsProvider(new AnonymousAWSCredentials())
		//		);
		options.setCredentialsProvider(
			new AWSStaticCredentialsProvider(new BasicAWSCredentials(
				"minioadmin",
				"minioadmin"
			))
		);

		FileSystemManager fileSystemManager = VFS.getManager();

		//		var file = fileSystemManager.resolveFile(
		//			"s3://corporate-img.s3.ap-northeast-1.amazonaws.com/common/css/jquery.bxslider.css",
		//			options.toFileSystemOptions()
		//		);
		var file = fileSystemManager.resolveFile(
			"s3://minio.local/zendrive/zendrive-api/.gitignore",
			options.toFileSystemOptions()
		);
		System.out.println(file.exists());
		System.out.println(file.getPath());

		//		System.out.println(file.getPath());
		//		var file = fileSystemManager.resolveFile(
		//			"s3://uswest2-mapslogreplay-tlara-published-prod.s3.us-west-2.amazonaws.com/log-replay/SEARCH/job_output/94c2629f-f940-478c-bf0e-2173b6ec0faa-SADRW/1/_SUCCESS",
		//			options.toFileSystemOptions()
		//		);


	}
}
