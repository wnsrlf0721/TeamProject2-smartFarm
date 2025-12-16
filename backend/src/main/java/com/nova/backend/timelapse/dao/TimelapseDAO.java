package com.nova.backend.timelapse.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseImageEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TimelapseDAO {
    List<TimelapseEntity> findByFarmEntity_FarmId(long farmId);
    List<TimelapseVideoEntity> findBySettingId(int settingId);
    void createTimelapse(List<TimelapseEntity> timelapseEntityList);
    List<TimelapseImageEntity> findBySettingIdOrderByCreatedAtDesc(long settingId);
    void saveImageAndUpdateDB(String base64Data, long settingId) throws Exception;
    TimelapseVideoEntity createVideoFromImages(long settingId) throws Exception;


    TimelapseEntity findById(long settingId);
    void save(TimelapseEntity setting);



    TimelapseEntity findNextStep(long currentSettingId);
    TimelapseEntity findFullVideoSetting(long farmId);
}
