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
@Table(name = "jobrunr_recurring_jobs")
@Subselect("select * from jobrunr_recurring_jobs")
@Data
@NoArgsConstructor
@JsonIgnoreProperties("@class")
public class RecurringTask {

	@Id
	@Column(length = 36, nullable = false, updatable = false)
	private String id;

	@Column(name = "version", nullable = false)
	private Integer version;

	@Convert(converter = TaskDataAttributeConverter.class)
	@Column(name = "jobasjson", insertable = false, updatable = false)
	private TaskData data;

	@Column(name = "createdat", nullable = false)
	private long createdAt;
}