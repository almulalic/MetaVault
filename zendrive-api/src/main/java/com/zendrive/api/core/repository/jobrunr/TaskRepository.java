package com.zendrive.api.core.repository.jobrunr;

import com.zendrive.api.core.model.dao.jobrunr.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {
	@Query(
		value = "SELECT * FROM jobrunr_jobs WHERE state IN ('ENQUEUED', 'PROCESSING') ORDER BY updatedAt DESC",
		nativeQuery = true
	)
	List<Task> getRunningTasks();

	@Query(
		value = "SELECT COUNT(*) FROM jobrunr_jobs WHERE state IN ('ENQUEUED', 'PROCESSING') AND recurringJobId = ?1",
		nativeQuery = true
	)
	int countRunningByRecurringId(String id);
}
