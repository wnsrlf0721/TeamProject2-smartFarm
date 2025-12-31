package com.nova.backend.farm.service;

import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.dto.FarmTimelapseResponseDTO;
import com.nova.backend.farm.dto.FarmUpdateReqDTO;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.preset.dao.PresetDAO;
import com.nova.backend.preset.dao.PresetStepDAO;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.preset.repository.PresetRepository;
import com.nova.backend.preset.repository.PresetStepRepository;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    private final AlarmService alarmService;
    private final FarmRepository farmRepository;
    private final PresetStepRepository stepRepository;
    private final PresetRepository presetRepository;


    @Override
    public List<FarmResponseDTO> getFarmListByNovaId(Long novaId) {
        return farmDAO.findFarmsPresetStepsByNovaId(novaId).stream()
                .map(farm -> mapper.map(farm,FarmResponseDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public FarmTimelapseResponseDTO createFarm(FarmRequestDTO farmRequestDTO, MultipartFile image) {
        // 1. 이미지 처리 (이미지 저장 및 경로 반환)
        String storedImageUrl = uploadFarmImage(image,"/src/main/resources/static");

        // 2. 공통 필수 데이터 조회 및 매핑 (Nova, User)
        NovaEntity nova = novaDAO.findById(farmRequestDTO.getNovaId())
                .orElseThrow(() -> new IllegalArgumentException("해당 Nova 기기를 찾을 수 없습니다."));

        if (farmRequestDTO.getUser() == null || farmRequestDTO.getUser().getUserId() == null) {
            throw new IllegalArgumentException("사용자 정보가 유효하지 않습니다.");
        }
        UsersEntity user = mapper.map(farmRequestDTO.getUser(), UsersEntity.class);

        // 3. 팜의 시작 스텝(StartStep) 결정 (신규 생성 or 기존 조회 분기 처리)
        PresetStepEntity startStep = findStartStep(farmRequestDTO, user, storedImageUrl);

        // 4. 팜(FarmEntity) 생성 및 저장 (메인 메서드에서 수행)
        FarmEntity farm = FarmEntity.builder()
                        .farmName(farmRequestDTO.getFarmName())
                        .slot(farmRequestDTO.getSlot())
                        .nova(nova)
                        .presetStep(startStep).build();

        return farmDAO.save(farm)
                .map(entity -> modelMapper.map(entity, FarmTimelapseResponseDTO.class))
                .orElseThrow(() -> new RuntimeException("팜 저장 중 오류가 발생했습니다."));
    }

    @Override
    @Transactional
    public void updateFarm(FarmUpdateReqDTO dto, MultipartFile image, Long farmId) {
        // 1. FarmEntity 조회
        FarmEntity farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm not found with id: " + farmId));

        // 2. 기본 정보 업데이트 (이름)
        farm.setFarmName(dto.getFarmName());

        // 3. 이미지 업데이트 (이미지가 새로 업로드된 경우에만)
        if (image != null && !image.isEmpty()) {
            // 기존 이미지가 있다면 삭제하는 로직 필요 (선택사항)
            String imageUrl = uploadFarmImage(image,"/src/main/resources/static"); // 업로드 후 URL 반환

            farm.getPresetStep().getPreset().setPresetImageUrl(imageUrl); // (구조에 따라 수정 필요)
        }

        // 4. 성장 단계(Step) 리스트 업데이트
        // FarmEditModal에서 보낸 stepList를 가져옵니다.
        List<FarmUpdateReqDTO.UpdateStepDto> newSteps = dto.getStepList();

        if (newSteps != null) {
            // (A) 기존 단계 업데이트 로직
            for (FarmUpdateReqDTO.UpdateStepDto stepDto : newSteps) {

                if (stepDto.getStepId() != null) {
                    // ID가 있으면 기존 데이터 수정 (Dirty Checking)
                    PresetStepEntity step = stepRepository.findById(stepDto.getStepId())
                            .orElseThrow(() -> new IllegalArgumentException("Step not found"));

                    // 값 덮어쓰기
                    step.setGrowthStep(stepDto.getGrowthStep());
                    step.setPeriodDays(stepDto.getPeriodDays());

                    // EnvRange 값 분해해서 Entity에 넣기 (Entity 구조에 따라 다름)
                    if(stepDto.getTemp() != null) {
                        step.getTemp().setMin(stepDto.getTemp().getMin());
                        step.getTemp().setMax(stepDto.getTemp().getMax());
                    }
                    if(stepDto.getHumidity() != null) {
                        step.getHumidity().setMin(stepDto.getHumidity().getMin());
                        step.getHumidity().setMax(stepDto.getHumidity().getMax());
                    }
                    if(stepDto.getCo2() != null) {
                        step.getCo2().setMin(stepDto.getCo2().getMin());
                        step.getCo2().setMax(stepDto.getCo2().getMax());
                    }
                    if(stepDto.getLightPower() != null) {
                        step.getLightPower().setMin(stepDto.getLightPower().getMin());
                        step.getLightPower().setMax(stepDto.getLightPower().getMax());
                    }
                    if(stepDto.getSoilMoisture() != null) {
                        step.getSoilMoisture().setMin(stepDto.getSoilMoisture().getMin());
                        step.getSoilMoisture().setMax(stepDto.getSoilMoisture().getMax());
                    }

                } else {
                    // (B) ID가 없으면 새로 추가된 단계 (INSERT)
                    Long presetId = stepDto.getPreset().getPresetId();
                    PresetEntity preset = presetRepository.findById(presetId)
                            .orElseThrow(() -> new IllegalArgumentException("Preset not found: " + presetId));
                    PresetStepEntity newStep = PresetStepEntity.builder()
                            .preset(preset) // 현재 팜과 연관관계 설정
                            .growthStep(stepDto.getGrowthStep())
                            .periodDays(stepDto.getPeriodDays())
                            .temp(stepDto.getTemp())
                            .humidity(stepDto.getHumidity())
                            .co2(stepDto.getCo2())
                            .lightPower(stepDto.getLightPower())
                            .soilMoisture(stepDto.getSoilMoisture())
                            .build();
                    stepRepository.save(newStep);
                }
            }

        // Dirty Checking에 의해 트랜잭션 종료 시 FarmEntity, StepEntity update 쿼리 발생
    }
        }

    @Override
    @Transactional
    public void deleteFarmById(Long farmId) {
        FarmEntity farm = farmDAO.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("해당 팜이 존재하지 않습니다. ID=" + farmId));
        farm.setPresetStep(null);
    }

    /**
     * 1. 이미지 파일 저장 및 URL 생성 메서드
     */
    @Override
    public String uploadFarmImage(MultipartFile image, String url) {
        if (image == null || image.isEmpty()) {
            return null;
        }

        try {
            String uploadDir = System.getProperty("user.dir") + url+"/img/";
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            String originalFileName = image.getOriginalFilename();
            String savedFileName = UUID.randomUUID().toString() + "_" + originalFileName;

            // 파일 저장
            image.transferTo(new File(uploadDir + savedFileName));

            // DB에 저장할 경로 반환
            return "/img/" + savedFileName;

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    /**
     * 2. 시작 스텝 결정 메서드 (분기 처리)
     */
    private PresetStepEntity findStartStep(FarmRequestDTO dto, UsersEntity user, String storedImageUrl) {
        if (dto.getExistingPresetId() == null) {
            // 기존 ID가 없으면 -> 새 프리셋 및 스텝 생성
            return createNewPresetAndSteps(dto, user, storedImageUrl);
        } else {
            // 기존 ID가 있으면 -> 기존 스텝 조회
            return presetStepDAO.findStartStepByPresetId(dto.getExistingPresetId())
                    .orElseThrow(() -> new IllegalArgumentException("프리셋의 Step 데이터를 찾을 수 없습니다. ID: " + dto.getExistingPresetId()));
        }
    }

    /* 새 프리셋 및 스텝 생성 로직 */
    private PresetStepEntity createNewPresetAndSteps(FarmRequestDTO dto, UsersEntity user, String storedImageUrl) {
        // PresetEntity 생성
        PresetEntity newPreset = new PresetEntity();
        newPreset.setPresetName(dto.getPresetName());
        newPreset.setPlantType(dto.getPlantType());
        newPreset.setUser(user);
        // 이미지 경로 설정 (없으면 기본값)
        newPreset.setPresetImageUrl(storedImageUrl != null ? storedImageUrl : "/img/default.png");

        PresetEntity savedPreset = presetDAO.insertPreset(newPreset);

        // StepList 검증
        if (dto.getStepList() == null || dto.getStepList().isEmpty()) {
            throw new IllegalArgumentException("새 프리셋을 생성하려면 최소 1개 이상의 단계(Step)가 필요합니다.");
        }

        // Step 생성 및 시작 스텝 찾기
        PresetStepEntity startStep = null;
        int minGrowthStep = Integer.MAX_VALUE;

        for (FarmRequestDTO.NewPresetStepDto stepDto : dto.getStepList()) {
            PresetStepEntity stepEntity = PresetStepEntity.builder()
                            .preset(savedPreset)
                            .growthStep(stepDto.getGrowthStep())
                            .periodDays(stepDto.getPeriodDays())
                            .temp(stepDto.getTemp())
                            .humidity(stepDto.getHumidity())
                            .lightPower(stepDto.getLightPower())
                            .co2(stepDto.getCo2())
                            .soilMoisture(stepDto.getSoilMoisture()).build();

            PresetStepEntity savedStep = presetStepDAO.save(stepEntity);

            // 가장 낮은 단계를 시작 스텝으로 지정
            if (savedStep.getGrowthStep() < minGrowthStep) {
                minGrowthStep = savedStep.getGrowthStep();
                startStep = savedStep;
            }
        }
        return startStep;
    }

    // 다음 프리셋 스탭으로 업데이트 할 팜을 조회하는 메서드
    @Scheduled(fixedDelay = 30000)
    @Transactional
    @Override
    public void checkFarmStep() {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        System.out.println(now);
        //조건에 맞는 팜 리스트 조회
        List<FarmEntity> farmList = farmDAO.findFarmListToGrow(now);
        if(farmList.isEmpty()){
            System.out.println("업데이트할 팜이 없습니다.");
        }
        //해당 팜의 stepId를 업데이트
        else{
            for (FarmEntity farm : farmList) {
                processGrowth(farm);
            }
        }
    }

    // 팜 업데이트 (다음 프리셋으로 변경 or 프리셋 종료)
    public void processGrowth(FarmEntity farm) {
        PresetStepEntity currentStep = farm.getPresetStep();

        if (currentStep == null) return;

        // 조건: 같은 Preset ID + 현재 Growth Step보다 1 큰 단계
        // (PresetEntity 내부에 id가 있다고 가정: currentStep.getPreset().getPresetId())
        Optional<PresetStepEntity> nextStep = presetStepDAO.findByPreset_PresetIdAndGrowthStep(
                currentStep.getPreset().getPresetId(),
                currentStep.getGrowthStep() + 1
        );

        if (nextStep.isPresent()) {
            // 다음 단계가 있으면 -> 업데이트
            farm.updateStep(nextStep.get());
            System.out.println(farm.getFarmName()+" 업데이트 완료 ("+nextStep.get().getGrowthStep()+"단계)");
            alarmService.createSensorAlarm(farm,
                    "EVENT",
                    farm.getFarmName()+"의 프리셋 단계 변경",
                    nextStep.get().getGrowthStep()+" 단계가 새롭게 시작됐습니다!"
            ); // 현재 프리셋 기간이 종료되고, 다음 프리셋 스탭으로 넘어감
        } else {
            // 다음 단계가 없으면 -> 수확/종료 (빈 팜 만들기)
            System.out.println(farm.getFarmName()+" 재배 종료 (마지막 단계 완료)");
            alarmService.createSensorAlarm(farm,
                    "EVENT",
                    farm.getFarmName()+"의 프리셋 종료",
                    "식물의 성장 프리셋이 모두 종료되었습니다!"
            ); // 팜의 프리셋 단계가 모두 완료됨
            farm.resetStep();
        }
    }

}
