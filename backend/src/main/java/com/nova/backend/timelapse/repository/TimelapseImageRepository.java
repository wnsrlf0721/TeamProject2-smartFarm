package com.nova.backend.timelapse.repository;

import com.nova.backend.timelapse.entity.TimelapseImageEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TimelapseImageRepository extends CrudRepository<TimelapseImageEntity, Long> {
    List<TimelapseImageEntity> findByTimelapseEntity_SettingIdOrderByCreatedAtDesc(long settingId);

}
