package com.nova.backend.nova.dao;

import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.user.entity.UsersEntity;

import java.util.List;

public interface NovaDAO {
    List<NovaEntity> getNovaEntity(Long userId);
    void update(List<NovaEntity> novaEntityList);
    void delete(List<NovaEntity> novaEntityList);
    void create(List<NovaEntity> novaEntityList);
}
