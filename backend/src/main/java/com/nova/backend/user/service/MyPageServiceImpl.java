package com.nova.backend.user.service;

import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.dto.NovaRequestDTO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.user.dao.UsersDAO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.dto.UsersRequestDTO;
import com.nova.backend.user.dto.UsersResponseDTO;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {
    private final UsersDAO usersDAO;
    private final NovaDAO novaDAO;
    private final ModelMapper modelMapper;

    @Override
    public MyPageResponseDTO findByUserId(int userId) {
        UsersResponseDTO usersResponseDTO = modelMapper.map(usersDAO.findByUserId(userId), UsersResponseDTO.class);
        List<NovaResponseDTO> novaResponseDTOList = novaDAO.getNovaEntity(userId).stream()
                .map(nova -> modelMapper.map(nova, NovaResponseDTO.class))
                .collect(Collectors.toList());
        MyPageResponseDTO myPageResponseDTO = new MyPageResponseDTO(usersResponseDTO, novaResponseDTOList);
        return myPageResponseDTO;
    }

    @Override
    public void updateMyPage(MyPageRequestDTO myPageRequestDTO) {
        UsersRequestDTO usersRequestDTO = myPageRequestDTO.getUsersRequestDTO();
        UsersEntity usersEntity = usersDAO.findByUserId(myPageRequestDTO.getUsersRequestDTO().getUserId());
        modelMapper.map(usersRequestDTO, usersEntity);
        usersDAO.update(usersEntity);

        List<NovaRequestDTO> novaRequestDTOList = myPageRequestDTO.getNovaRequestDTOList();
        System.out.println("novaRequestDTOList 생성");
        List<NovaEntity> novaEntityUpdateList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("update"))
                .peek(nova -> nova.setStatus("default"))
                .map(nova -> modelMapper.map(nova, NovaEntity.class))
                .collect(Collectors.toList());
        System.out.println("novaRequestDTOList: " + novaRequestDTOList);
        List<NovaEntity> novaEntityDeleteList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("delete"))
                .map(nova -> modelMapper.map(nova, NovaEntity.class))
                .collect(Collectors.toList());
        System.out.println("novaRequestDTOList: " + novaRequestDTOList);
        List<NovaEntity> novaEntityCreateList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("create"))
                .map(nova -> {
                    NovaEntity entity = new NovaEntity(
                            modelMapper.map(nova.getUser(),UsersEntity.class),
                            nova.getNovaSerialNumber(),
                            "default"
                    );
                    return entity;
                })
                .collect(Collectors.toList());
        System.out.println("novaEntityCreateList: " + novaEntityCreateList);
        novaDAO.update(novaEntityUpdateList);
        novaDAO.delete(novaEntityDeleteList);
        novaDAO.create(novaEntityCreateList);
    }
}
