package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.Preset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresetRepository extends JpaRepository<Preset,Integer> {
    List<Preset> findByUserId(int userId);
}
