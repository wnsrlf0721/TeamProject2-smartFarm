package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.EnvRange;
import com.nova.backend.preset.entity.Preset;
import com.nova.backend.preset.entity.PresetStep;
import com.nova.backend.preset.repository.PresetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class PresetStepDAOImplTest {
    @Autowired
    private PresetStepDAO presetStepDAO;

    @Autowired
    private PresetRepository presetRepository; // FK 제약조건 해결을 위해 필요

    @Test
    @DisplayName("Create & Read: JSON 데이터가 포함된 PresetStep 저장 및 조회 테스트")
    void saveAndFindTest() {
        // 1. Given: 부모 데이터(Preset) 먼저 생성
        Preset preset = new Preset();
        preset.setPresetName("테스트용 프리셋");
        preset.setPlantType("Leafy");
        Preset savedPreset = presetRepository.save(preset);

        // 2. Given: JSON 객체(EnvRange)를 포함한 Step 데이터 생성
        PresetStep step = new PresetStep();
        step.setPreset(savedPreset);
        step.setGrowthStep(1);
        step.setPeriodDays(10);
        step.setWaterLevel(50);

        // 🔥 JSON 데이터 주입 (EnvRange 객체)
        step.setTemp(new EnvRange(20, 25));          // 온도 20~25
        step.setHumidity(new EnvRange(60, 70));      // 습도 60~70
        step.setLightPower(new EnvRange(100, 200));
        step.setCo2(new EnvRange(400, 500));
        step.setSoilMoisture(new EnvRange(30, 40));

        // 3. When: DAO를 통해 저장
        PresetStep savedStep = presetStepDAO.save(step);

        // 4. Then: ID 생성 확인
        assertThat(savedStep.getStepId()).isNotZero();

        // 5. When: 다시 ID로 조회 (DB에서 잘 꺼내오는지)
        PresetStep foundStep = presetStepDAO.findById(savedStep.getStepId()).orElseThrow();

        // 6. Then: JSON 데이터가 객체로 잘 매핑되었는지 검증
        assertThat(foundStep.getTemp()).isNotNull();
        assertThat(foundStep.getTemp().getMin()).isEqualTo(20);
        assertThat(foundStep.getTemp().getMax()).isEqualTo(25);

        assertThat(foundStep.getHumidity().getMin()).isEqualTo(60);

        System.out.println("조회된 Temp JSON 객체: " + foundStep.getTemp());
    }

}