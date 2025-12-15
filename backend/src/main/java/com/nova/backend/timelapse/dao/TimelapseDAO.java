package com.nova.backend.timelapse.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TimelapseDAO {
    List<TimelapseEntity> findByFarmEntity_FarmId(long farmId);
    List<TimelapseVideoEntity> findBySettingId(int settingId);
    void createTimelapse(List<TimelapseEntity> timelapseEntityList);
}
