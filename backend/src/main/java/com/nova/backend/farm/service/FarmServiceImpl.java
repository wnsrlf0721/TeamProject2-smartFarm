package com.nova.backend.farm.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.dto.FarmTimelapseResponseDTO;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.preset.dao.PresetDAO;
import com.nova.backend.preset.dao.PresetStepDAO;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmServiceImpl implements FarmService{
    private final FarmDAO farmDAO;
    private final NovaDAO novaDAO;
    private final PresetDAO presetDAO;
    private final PresetStepDAO presetStepDAO;
    private final ModelMapper mapper;
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";
    private final ModelMapper modelMapper;


    @Override
    public List<FarmResponseDTO> getFarmListByNovaId(Long novaId) {
        return farmDAO.findFarmsPresetStepsByNovaId(novaId).stream()
                .map(farm -> mapper.map(farm,FarmResponseDTO.class))
                .toList();
    }

    @Override
    public FarmTimelapseResponseDTO createFarm(FarmRequestDTO farmRequestDTO, MultipartFile image) {
        // 이미지 파일 저장 (로컬 폴더에 저장 후 경로 생성)
        String storedImageUrl = null; // 이미지가 없으면 null 혹은 기본 이미지 경로

        if (image != null && !image.isEmpty()) {
            try {
                String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/img/";
                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();

                String originalFileName = image.getOriginalFilename();
                String savedFileName = UUID.randomUUID().toString() + "_" + originalFileName;

                // 파일 저장
                image.transferTo(new File(uploadDir + savedFileName));

                // DB에 넣을 경로
                storedImageUrl = "/img/" + savedFileName;

            } catch (IOException e) {
                throw new RuntimeException("이미지 저장 실패", e);
            }
        }

        // 1. 공통 필수 데이터 매핑 (Nova, User)
        NovaEntity nova = novaDAO.findById(farmRequestDTO.getNovaId())
                .orElseThrow(() -> new IllegalArgumentException("해당 Nova 기기를 찾을 수 없습니다."));
        if (farmRequestDTO.getUser() == null || farmRequestDTO.getUser().getUserId() == null) {
            throw new IllegalArgumentException("사용자 정보가 유효하지 않습니다.");
        }
        UsersEntity user = mapper.map(farmRequestDTO.getUser(),UsersEntity.class);

        // 2. 팜의 시작 스텝(PresetStep) 결정 로직
        PresetStepEntity startStep = null;

        // existingPresetId가 null이면 "새 프리셋 생성"
        if (farmRequestDTO.getExistingPresetId() == null) {
            // PresetEntity 생성 및 저장
            PresetEntity newPreset = new PresetEntity();
            newPreset.setPresetName(farmRequestDTO.getPresetName());
            newPreset.setPlantType(farmRequestDTO.getPlantType());
            newPreset.setUser(user);

            // 새 프리셋을 만들 때만 이미지를 저장
            if (storedImageUrl != null) {
                newPreset.setPresetImageUrl(storedImageUrl);
            } else {
                // 이미지가 없으면 기본 이미지 URL 설정
                newPreset.setPresetImageUrl("/img/default.png");
            }

            PresetEntity savedPreset = presetDAO.insertPreset(newPreset);

            // PresetStepEntity 생성 및 저장
            if (farmRequestDTO.getStepList() == null || farmRequestDTO.getStepList().isEmpty()) {
                throw new IllegalArgumentException("새 프리셋을 생성하려면 최소 1개 이상의 단계(Step)가 필요합니다.");
            }

            int minGrowthStep = Integer.MAX_VALUE;
            for (FarmRequestDTO.NewPresetStepDto stepDto : farmRequestDTO.getStepList()) {
                PresetStepEntity stepEntity = new PresetStepEntity();
                stepEntity.setPreset(savedPreset); // 위에서 저장한 프리셋 연결
                stepEntity.setGrowthStep(stepDto.getGrowthStep());
                stepEntity.setPeriodDays(stepDto.getPeriodDays());

                // 환경 변수 매핑 (EnvRange 객체 그대로 사용)
                stepEntity.setTemp(stepDto.getTemp());
                stepEntity.setHumidity(stepDto.getHumidity());
                stepEntity.setLightPower(stepDto.getLightPower());
                stepEntity.setCo2(stepDto.getCo2());
                stepEntity.setSoilMoisture(stepDto.getSoilMoisture());

                PresetStepEntity savedStep = presetStepDAO.save(stepEntity);

                if (savedStep.getGrowthStep() < minGrowthStep) {
                    minGrowthStep = savedStep.getGrowthStep();
                    startStep = savedStep; // 시작 스텝으로 임명
                }
            }

        }
        // 값이 있으면 "기존 프리셋 사용"
        else {
            // B-1. 기존 프리셋의 1단계(GrowthStep = 1) 조회
            // PresetDAO가 아닌 PresetStepDAO를 통해 직접 스텝을 찾습니다.
            startStep = presetStepDAO.findStartStepByPresetId(farmRequestDTO.getExistingPresetId())
                    .orElseThrow(() -> new IllegalArgumentException("프리셋의 Step 데이터를 찾을 수 없습니다."));
        }
        // 3. 유효성 검증 (시작 스텝이 설정되었는지)
        if (startStep == null) {
            throw new IllegalStateException("팜을 생성할 Step이 설정되지 않았습니다. 입력 데이터를 확인해주세요.");
        }

        // 4. 팜(FarmEntity) 생성 및 저장
        FarmEntity farm = new FarmEntity();
        farm.setFarmName(farmRequestDTO.getFarmName());
        farm.setSlot(farmRequestDTO.getSlot());
        farm.setNova(nova);           // 기기 연결
        farm.setPresetStep(startStep); // 시작 스텝 연결 (FK)

        return farmDAO.save(farm)
                .map(entity -> modelMapper.map(entity, FarmTimelapseResponseDTO.class))
                .orElseThrow();
    }

}
