package com.nova.backend.timelapse.service;

import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import jakarta.annotation.Resource;
import org.springframework.core.io.FileSystemResource;

public interface TimelapseVideoService {
    void renderVideo(long settingId);
    void mergeStepVideos(Long farmId, int settingId);
    String getVideo(long settingId);
}
