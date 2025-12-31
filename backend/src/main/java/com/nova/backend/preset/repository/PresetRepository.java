package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PresetRepository extends JpaRepository<PresetEntity,Long> {
    // UserId가 userId or NULL 인 경우
    @Query("SELECT p FROM PresetEntity p WHERE p.user.userId = :userId OR p.user IS NULL")
    List<PresetEntity> findCustomOrSystemPresets(@Param("userId") Long userId);
    List<PresetEntity> findByUser(UsersEntity user);
}
