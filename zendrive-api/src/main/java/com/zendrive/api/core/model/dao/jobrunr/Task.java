package com.zendrive.api.core.model.dao.jobrunr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zendrive.api.core.model.jobrunr.TaskData;
import com.zendrive.api.core.model.jobrunr.TaskDataAttributeConverter;
import com.zendrive.api.core.model.jobrunr.TaskState;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Subselect;

import java.time.Instant;

@Entity
@Table(name = "jobrunr_jobs")
@Subselect("select * from jobrunr_jobs")
@Data
@NoArgsConstructor
@JsonIgnoreProperties("@class")
public class Task {

	@Id
	@Column(length = 36, nullable = false, updatable = false)
	private String id;

	@Column(name = "version", nullable = false)
	private Integer version;

	@Convert(converter = TaskDataAttributeConverter.class)
	@Column(name = "jobasjson", insertable = false, updatable = false)
	private TaskData data;

	@Column(name = "jobsignature", length = 512, nullable = false)
	private String taskSignature;

	@Column(name = "state", length = 36, nullable = false)
	@Enumerated(EnumType.STRING)
	private TaskState state;

	@Column(name = "createdat", nullable = false)
	private Instant createdAt;

	@Column(name = "updatedat", nullable = false)
	private Instant updatedAt;

	@Column(name = "scheduledat")
	private Instant scheduledAt;

	@Column(name = "recurringjobid", length = 128)
	private String recurringTaskId;
}