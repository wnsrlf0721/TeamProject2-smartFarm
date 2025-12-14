package com.nova.backend.timelapse.dao;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TimelapseDAO {
    List<TimelapseEntity> findByFarmId(int farmId);
    List<TimelapseVideoEntity> findBySettingId(int settingId);
    List<TimelapseEntity> findWithVideosByFarmId(int farmId);
    void createTimelapse(List<TimelapseEntity> timelapseEntityList);
}
