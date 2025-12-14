package com.nova.backend.timelapse.repository;

import com.nova.backend.timelapse.entity.TimelapseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimelapseRepository extends JpaRepository<TimelapseEntity, Integer> {
    List<TimelapseEntity> findByFarmEntity_FarmId(int farmId);
    @Query("""
    select distinct t
    from TimelapseEntity t
    left join fetch t.videoList
    where t.farmEntity.farmId = :farmId
""")
    List<TimelapseEntity> findWithVideosByFarmId(@Param("farmId") int farmId);
}
