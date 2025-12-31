package com.nova.backend.timelapse.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimelapseVideoRepository extends JpaRepository<TimelapseVideoEntity, Integer> {
    TimelapseVideoEntity findByTimelapseEntity_SettingId(long settingId);


//    List<TimelapseVideoEntity> findByTimelapseIn(List<TimelapseEntity> timelapseEntity);

    List<TimelapseVideoEntity> findByTimelapseEntityIn(List<TimelapseEntity> timelapseEntityList);

    List<TimelapseVideoEntity> findByTimelapseEntity_FarmEntity_FarmId(Long farmId);
}
