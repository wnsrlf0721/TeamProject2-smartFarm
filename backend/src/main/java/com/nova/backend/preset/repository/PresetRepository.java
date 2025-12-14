package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresetRepository extends JpaRepository<PresetEntity,Integer> {
    List<PresetEntity> findByUserId(int userId);
    // UserId가 userId or NULL 인 경우
    List<PresetEntity> findByUserIdOrUserIdIsNull(int userId);
}
