package com.nova.backend.farm.dao;

import com.nova.backend.farm.Entity.Farm;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.preset.entity.PresetStep;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class FarmDAOImplTest {
    @Autowired
    private FarmDAO farmDAO;
    @Autowired
    private EntityManager em;

    @Test
    void save() {
        // given
        // Farm을 저장하려면 외래키인 NovaEntity와 PresetStep이 필요함.
        // 실제 DB에 존재하는 ID 1번 데이터를 잠깐 가져와서 연결함 (테스트용)
        NovaEntity existingNova = em.find(NovaEntity.class, 1);
        PresetStep existingStep = em.find(PresetStep.class, 1);

        Farm newFarm = Farm.builder()
                .farmName("테스트용 새 농장")
                .location(99) // 임의의 위치
                .nova(existingNova)
                .presetStep(existingStep)
                .build();

        // when
        farmDAO.save(newFarm);

        // then
        // 저장이 잘 되었는지 확인하기 위해 ID가 생성되었는지 체크
        assertThat(newFarm.getFarmId()).isNotNull(); // Auto Increment로 ID가 생겼어야 함

        System.out.println(">>> 저장된 농장 ID: " + newFarm.getFarmId());
        System.out.println(">>> 저장된 농장 이름: " + newFarm.getFarmName());
    }

    @Test
    @DisplayName("nova_id 기반으로 팜 리스트 조회")
    void findListByNovaId() {
        int targetNovaId = 4;

        // when
        List<Farm> result = farmDAO.findListByNovaId(targetNovaId);

        // then
        // 1. 리스트의 크기가 2개여야 한다.
        assertThat(result).hasSize(2);

        // 2. 가져온 데이터들의 nova_id가 모두 4여야 한다.
        assertThat(result.get(0).getNova().getNovaId()).isEqualTo(4L); // NovaEntity ID가 Long이라고 가정
        assertThat(result.get(1).getNova().getNovaId()).isEqualTo(4L);

        // 3. (선택) 실제 농장 이름이 맞는지 확인
        // 순서는 DB 정렬에 따라 다를 수 있으므로 이름을 추출해서 포함 여부 확인
        List<String> farmNames = result.stream()
                .map(Farm::getFarmName)
                .toList();

        assertThat(farmNames).contains("강낭콩 D팜", "딸기 E팜");

        System.out.println(">>> 조회된 농장 목록: " + farmNames);
    }

    @Test
    @DisplayName("nova_id 기반으로 팜, 프리셋, 스텝 리스트 전체조회")
    void findFarmsPresetStepsByNovaId() {
        int targetNovaId = 4;

        // when
        List<Farm> result = farmDAO.findFarmsPresetStepsByNovaId(targetNovaId);

        // then
        // 1. 리스트의 크기가 2개여야 한다.
        assertThat(result).hasSize(2);

        // 2. 가져온 데이터들의 nova_id가 모두 4여야 한다.
        assertThat(result.get(0).getNova().getNovaId()).isEqualTo(4L); // NovaEntity ID가 Long이라고 가정
        assertThat(result.get(1).getNova().getNovaId()).isEqualTo(4L);

        // 3. (선택) 실제 농장 이름이 맞는지 확인
        // 순서는 DB 정렬에 따라 다를 수 있으므로 이름을 추출해서 포함 여부 확인
        List<String> farmNames = result.stream()
                .map(Farm::getFarmName)
                .toList();

        assertThat(farmNames).contains("강낭콩 D팜", "딸기 E팜");

        System.out.println("=========================================");
        for (Farm farm : result) {
            System.out.println(">>> 팜 이름: " + farm.getFarmName());

            // Farm -> PresetStep 접근
            System.out.println("    ㄴ 현재 단계(Step): " + farm.getPresetStep().getGrowthStep());
            System.out.println("    ㄴ 기간(Days): " + farm.getPresetStep().getPeriodDays());

            // Farm -> PresetStep -> Preset 접근
            System.out.println("    ㄴ 작물 종류: " + farm.getPresetStep().getPreset().getPlantType());
            System.out.println("    ㄴ 프리셋 이름: " + farm.getPresetStep().getPreset().getPresetName());
            System.out.println("-----------------------------------------");
        }
        System.out.println("=========================================");
    }

}