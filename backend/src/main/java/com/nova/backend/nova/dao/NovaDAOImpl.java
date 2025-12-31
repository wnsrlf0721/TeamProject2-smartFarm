package com.nova.backend.nova.dao;

import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.nova.repository.NovaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class NovaDAOImpl implements NovaDAO {
    private final NovaRepository novaRepository;

    @Override
    public List<NovaEntity> getNovaEntity(Long userId) {
        return novaRepository.findByUser_UserId(userId);
    }

    @Override
    public void update(List<NovaEntity> novaEntityList) {
        novaRepository.saveAll(novaEntityList);
    }

    @Override
    public void delete(List<NovaEntity> novaEntityList) {
        novaRepository.deleteAll(novaEntityList);
    }

    @Override
    public void create(List<NovaEntity> novaEntityList) {
        novaRepository.saveAll(novaEntityList);
    }

    @Override
    public Optional<NovaEntity> findById(Long novaId){
        return novaRepository.findById(novaId);
    }

    @Override
    public NovaEntity findNovaIdByNovaSerialNumber(String novaSerialNumber) {
        return novaRepository.findNovaIdByNovaSerialNumber(novaSerialNumber);
    }
}
