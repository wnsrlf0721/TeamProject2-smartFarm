package com.nova.backend.nova.dao;

import com.nova.backend.nova.entity.NovaEntity;

import java.util.List;
import java.util.Optional;

public interface NovaDAO {
    List<NovaEntity> getNovaEntity(Long userId);
    void update(List<NovaEntity> novaEntityList);
    void delete(List<NovaEntity> novaEntityList);
    void create(List<NovaEntity> novaEntityList);
    Optional<NovaEntity> findById(Long novaId);
    NovaEntity findNovaIdByNovaSerialNumber(String novaSerialNumber);
}
