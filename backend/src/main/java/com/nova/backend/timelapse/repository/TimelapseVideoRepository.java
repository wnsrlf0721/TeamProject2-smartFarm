package com.nova.backend.timelapse.repository;

import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimelapseVideoRepository extends JpaRepository<TimelapseVideoEntity, Integer> {
    List<TimelapseVideoEntity> findByTimelapseEntity_SettingId(int settingId);
}
