package com.nova.backend.farm.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import com.nova.backend.farm.entity.FarmEntity;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmServiceImpl implements FarmService{
    private final FarmDAO farmDAO;
    private final ModelMapper mapper;

    @Override
    public List<FarmResponseDTO> getFarmListByNovaId(Long novaId) {
        return farmDAO.findFarmsPresetStepsByNovaId(novaId).stream()
                .map(farm -> mapper.map(farm,FarmResponseDTO.class))
                .toList();
    }


}
