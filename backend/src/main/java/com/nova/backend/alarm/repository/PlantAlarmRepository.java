package com.nova.backend.alarm.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.alarm.entity.PlantAlarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

// 알람 조회 (최근 값)
@Repository
public interface PlantAlarmRepository extends JpaRepository<PlantAlarmEntity,Long> {
    // 최근 알람 10개 정도 찍을예정~~~~
    List<PlantAlarmEntity> findTop10ByFarmOrderByCreatedAtDesc(FarmEntity farm);

    // 오늘 알람 (날짜 기준)
    List<PlantAlarmEntity> findByFarmAndCreatedAtBetweenOrderByCreatedAtDesc(
            FarmEntity farm,
            //서비스에서 오늘 00:00 ~ 23:59 계산해서
            LocalDateTime start,
            LocalDateTime end
    );
    // 오늘 및 이전알림 (unread로) 최신 10개 조회
    List<PlantAlarmEntity> findTop10ByFarmAndIsReadFalseAndCreatedAtBetweenOrderByCreatedAtDesc(
            FarmEntity farm,
            LocalDateTime start,
            LocalDateTime end
    );
    List<PlantAlarmEntity> findTop10ByFarmAndIsReadFalseAndCreatedAtBeforeOrderByCreatedAtDesc(
            FarmEntity farm,
            LocalDateTime before
    );

    // 읽지 않은 알람 (실시간 팝업용)
    List<PlantAlarmEntity> findByFarmAndIsReadFalseOrderByCreatedAtDesc(
            FarmEntity farm
    );

    // 전체 알람 (알람 탭)
    List<PlantAlarmEntity> findByFarmOrderByCreatedAtDesc(
            FarmEntity farm
    );
    //1) 알람 페이지 전체 조회 (읽음/안읽음 분리용)-> 알람 페이지 첫 화면에서 바로 사용
    List<PlantAlarmEntity> findByFarmAndIsReadOrderByCreatedAtDesc(
            FarmEntity farm,
            boolean isRead
    );
    //2) 타입 + 읽음 상태 기준 조회 (탭 필터용)-> “센서 알람 / 이벤트 알람” 탭에서 사용
    List<PlantAlarmEntity> findByFarmAndAlarmTypeAndIsReadOrderByCreatedAtDesc(
            FarmEntity farm,
            String alarmType,
            boolean isRead
    );
    //3) 타입 기준 전체 조회 (읽음/안읽음 통합)-> 탭 눌렀을 때 기본 리스트
    List<PlantAlarmEntity> findByFarmAndAlarmTypeOrderByCreatedAtDesc(
            FarmEntity farm,
            String alarmType
    );

    List<PlantAlarmEntity> findByFarmAndAlarmTypeInOrderByCreatedAtDesc(FarmEntity farm, Collection<String> alarmTypes);

    List<PlantAlarmEntity> findByFarmAndAlarmTypeInAndIsReadOrderByCreatedAtDesc(FarmEntity farm, Collection<String> alarmTypes, boolean isRead);
    //user 전체 기준
    List<PlantAlarmEntity>
    findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    //유저+읽음여부
    List<PlantAlarmEntity>
    findByUser_UserIdAndIsReadOrderByCreatedAtDesc(
            Long userId, boolean isRead);
    //유저+알람타입
    List<PlantAlarmEntity>
    findByUser_UserIdAndAlarmTypeInOrderByCreatedAtDesc(
            Long userId, Collection<String> alarmTypes);
    //유저+알람타입+읽음여부
    List<PlantAlarmEntity>
    findByUser_UserIdAndAlarmTypeInAndIsReadOrderByCreatedAtDesc(
            Long userId, Collection<String> alarmTypes, boolean isRead);

    List<PlantAlarmEntity> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
}
