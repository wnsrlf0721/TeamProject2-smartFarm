package com.nova.backend.nova.service;

import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class NovaServiceImpl implements NovaService{
    private final NovaDAO novaDAO;
    private final ModelMapper mapper;
    @Override
    public List<NovaResponseDTO> getNovaListByUserId(int userId) {
        return novaDAO.getNovaEntity(userId).stream()
                .map(novaEntity -> mapper.map(novaEntity, NovaResponseDTO.class))
                .toList();
    }
}
