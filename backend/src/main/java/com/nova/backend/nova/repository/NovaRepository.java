package com.nova.backend.nova.repository;

import com.nova.backend.nova.entity.NovaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NovaRepository extends JpaRepository<NovaEntity, Long> {
    List<NovaEntity> findByUser_UserId(Long userId);
    NovaEntity findNovaIdByNovaSerialNumber(String novaSerialNumber);
}
