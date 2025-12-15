package com.nova.backend.timelapse.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimelapseRepository extends JpaRepository<TimelapseEntity, Integer> {
    List<TimelapseEntity> findByFarmEntity_FarmId(long farmId);
}
