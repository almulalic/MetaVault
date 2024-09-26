package com.zendrive.api.core.repository.jobrunr;

import com.zendrive.api.core.model.dao.jobrunr.RecurringTask;
import com.zendrive.api.core.model.dao.jobrunr.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecurringTaskRepository extends JpaRepository<RecurringTask, String> {
}
