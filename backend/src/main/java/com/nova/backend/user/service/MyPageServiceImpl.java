package com.nova.backend.user.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.dto.NovaRequestDTO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import com.nova.backend.timelapse.repository.TimelapseRepository;
import com.nova.backend.timelapse.repository.TimelapseVideoRepository;
import com.nova.backend.user.dao.MyPageDAO;
import com.nova.backend.user.dao.UsersDAO;
import com.nova.backend.user.dto.*;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {
    private final UsersDAO usersDAO;
    private final NovaDAO novaDAO;
    private final FarmDAO farmDAO;
    private final MyPageDAO myPageDAO;
    private final TimelapseRepository timelapseRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public MyPageResponseDTO findByUserId(Long userId) {

        // 1) 유저 조회
        UsersEntity user = usersDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다. userId=" + userId);
        }
        UsersResponseDTO usersResponseDTO = modelMapper.map(user, UsersResponseDTO.class);

        List<NovaResponseDTO> novaResponseDTOList = novaDAO.getNovaEntity(userId).stream()
                .map(nova -> modelMapper.map(nova, NovaResponseDTO.class))
                .collect(Collectors.toList());
        MyPageResponseDTO myPageResponseDTO = new MyPageResponseDTO(usersResponseDTO, novaResponseDTOList);
        return myPageResponseDTO;
    }

    @Override
    public void updateMyPage(MyPageRequestDTO myPageRequestDTO) {
        UsersRequestDTO usersRequestDTO = myPageRequestDTO.getUsersRequestDTO();
        UsersEntity usersEntity = usersDAO.findByUserId(usersRequestDTO.getUserId());
        if (usersEntity == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        modelMapper.map(usersRequestDTO, usersEntity);
        usersEntity.setPassword(passwordEncoder.encode(usersRequestDTO.getPassword()));
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
//                    NovaEntity entity = new NovaEntity(
//                            nova.getUserId(),
//                            nova.getNovaSerialNumber(),
//                            "default"
//                    );
//                    return entity;
                    //노바에 user fk설정으로 변경햇습니당
                    NovaEntity entity = new NovaEntity();
                    entity.setUser(usersEntity);   // (userId ❌, UsersEntity ⭕)
                    entity.setNovaSerialNumber(nova.getNovaSerialNumber());
                    entity.setStatus("default");
                    return entity;
                })
                .collect(Collectors.toList());
        System.out.println("novaEntityCreateList: " + novaEntityCreateList);
        novaDAO.update(novaEntityUpdateList);
        novaDAO.delete(novaEntityDeleteList);
        novaDAO.create(novaEntityCreateList);
    }

    @Override
    public List<MyPageTimelapseResponseDTO> getTimelapseVideoResponseDTO(long userId) {

        // 1️⃣ 유저의 NOVA 목록
        List<NovaEntity> novaEntityList = novaDAO.getNovaEntity(userId);
        List<MyPageTimelapseResponseDTO> result = new ArrayList<>();

        for (NovaEntity nova : novaEntityList) {

            // NOVA 하위 Timelapse DTO 리스트
            List<TimelapseResponseDTO> timelapseDTOList = new ArrayList<>();

            // 2️⃣ NOVA → Farm
            List<FarmEntity> farmEntityList =
                    farmDAO.findListByNovaId(nova.getNovaId());

            for (FarmEntity farm : farmEntityList) {

                // 3️⃣ Farm → Timelapse
                List<TimelapseEntity> timelapseList =
                        timelapseRepository.findByFarmEntity_FarmId(farm.getFarmId());

                for (TimelapseEntity timelapse : timelapseList) {

                    // Farm → FarmResponseDTO
                    FarmEntity farmEntity = timelapse.getFarmEntity();
                    FarmResponseDTO farmDTO = new FarmResponseDTO(
                            farmEntity.getFarmId(),
                            farmEntity.getFarmName()
                    );

                    // Video 매핑
                    List<TimelapseVideoResponseDTO> videoDTOList =
                            timelapse.getVideoList().stream()
                                    .map(video ->
                                            modelMapper.map(video, TimelapseVideoResponseDTO.class)
                                    )
                                    .toList();

                    TimelapseResponseDTO timelapseDTO =
                            new TimelapseResponseDTO(
                                    timelapse.getSettingId(),
                                    farmDTO,
                                    timelapse.getTimelapseName(),
                                    videoDTOList
                            );

                    timelapseDTOList.add(timelapseDTO);
                }
            }

            // 6️⃣ NOVA 단위 DTO
            MyPageTimelapseResponseDTO novaDTO =
                    new MyPageTimelapseResponseDTO(
                            nova.getNovaId(),
                            nova.getNovaSerialNumber(),
                            timelapseDTOList
                    );

            result.add(novaDTO);
        }

        return result;
    }

    @Override
    public boolean checkPassword(Long userId, String password) {
        UsersEntity user = myPageDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        return passwordEncoder.matches(password, user.getPassword());
    }
}
