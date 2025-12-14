package com.nova.backend.nova.service;

import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.user.dao.UsersDAO;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class NovaServiceImpl implements NovaService{
    private final NovaDAO novaDAO;
    private final ModelMapper mapper;
    private final UsersDAO usersDAO;
    @Override
    public List<NovaResponseDTO> getNovaListByUserId(Long userId) {
        return novaDAO.getNovaEntity(userId).stream()
                .map(novaEntity -> mapper.map(novaEntity, NovaResponseDTO.class))
                .toList();
    }
}
