package com.nova.backend.timelapse.service;

import com.nova.backend.timelapse.entity.TimelapseVideoEntity;

public interface TimelapseVideoService {
    void renderVideo(long settingId);
    void mergeStepVideos(Long farmId, int settingId);
}
