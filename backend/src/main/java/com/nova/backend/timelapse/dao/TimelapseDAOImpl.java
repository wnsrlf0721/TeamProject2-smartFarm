package com.nova.backend.timelapse.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import com.nova.backend.timelapse.repository.TimelapseRepository;
import com.nova.backend.timelapse.repository.TimelapseVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TimelapseDAOImpl implements TimelapseDAO {
    private final TimelapseRepository timelapseRepository;
    private final TimelapseVideoRepository timelapseVideoRepository;
    @Override
    public List<TimelapseEntity> findByFarmEntity_FarmId(long farmId) {
        return timelapseRepository.findByFarmEntity_FarmId(farmId);
    }

//    @Override
//    public List<TimelapseEntity> findByFarm(FarmEntity farmEntity) {
//        return timelapseRepository.findByFarmEntity(farmEntity);
//    }

    @Override
    public List<TimelapseVideoEntity> findBySettingId(int settingId) {
        return timelapseVideoRepository.findByTimelapseEntity_SettingId(settingId);
    }

    @Override
    public void createTimelapse(List<TimelapseEntity> timelapseEntityList) {
        timelapseRepository.saveAll(timelapseEntityList);
    }
}
