package com.zendrive.api.core.model.task;

import com.zendrive.api.core.repository.MetafileRepository;

import java.util.List;

public class SyncTask implements Task {
    private int progress = 0;
    private final MetafileRepository metafileRepository;

    public SyncTask(MetafileRepository metafileRepository) {
        this.metafileRepository = metafileRepository;
    }

    @Override
    public boolean process(List<String> metafiles) {
        progress += 1;
        return false;
    }

    @Override
    public int getProgress() {
        return progress;
    }
}
