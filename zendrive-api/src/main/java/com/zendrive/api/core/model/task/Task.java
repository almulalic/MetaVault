package com.zendrive.api.core.model.task;

import java.util.List;

public interface Task {
    boolean process(List<String> metafiles);

    int getProgress();
}
