package com.nova.backend.alarm.controller;

import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.alarm.dto.DashboardAlarmResponse;
import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/alarm")
@RequiredArgsConstructor
public class AlarmController {
    private final AlarmService alarmService;

    // 실시간 팝업 알람 (읽지 않은 알람)
    @GetMapping("/unread")
    public ResponseEntity<List<AlarmResponseDTO>> getUnreadAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getUnreadAlarms(farmId)
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAlarmResponse> getDashboardAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getDashboardAlarm(farmId)
        );
    }

    @PostMapping("/dashboard/today/read-all")
    public ResponseEntity<Void> readDashboardToday(@RequestParam Long farmId) {
        alarmService.readDashboardTodayAlarms(farmId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/dashboard/previous/read-all")
    public ResponseEntity<Void> readDashboardPrevious(@RequestParam Long farmId) {
        alarmService.readDashboardPreviousAlarms(farmId);
        return ResponseEntity.ok().build();
    }

    // 대시보드 최근 알람 10개
    @GetMapping("/recent")
    public ResponseEntity<List<AlarmResponseDTO>> getRecentAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getRecentAlarms(farmId)
        );
    }

    // 오늘 알람
    @GetMapping("/today")
    public ResponseEntity<List<AlarmResponseDTO>> getTodayAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getTodayAlarms(farmId)
        );
    }

    @GetMapping("/page")
    public ResponseEntity<List<AlarmResponseDTO>> getUserAlarms(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String alarmType,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Long farmId
    ) {
        Long userId = userDetails.getUser().getUserId();
        return ResponseEntity.ok(
                alarmService.getUserAlarmPage(userId, alarmType, isRead)
        );
    }

    // 전체 알람 (알람 탭)
    @GetMapping("/all")
    public ResponseEntity<List<AlarmResponseDTO>> getAllAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getAllAlarms(farmId)
        );
    }

    // 알람 전체 읽음
    @PatchMapping("/read-all")
    public ResponseEntity<Void> readAllAlarms(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getUserId();
        alarmService.readAllAlarms(userId);
        return ResponseEntity.ok().build();
    }

    // 🔹 알람 페이지 - 읽음 / 안읽음 분리
    @GetMapping("/page/read-status")
    public ResponseEntity<List<AlarmResponseDTO>> getAlarmsByReadStatus(
            @RequestParam Long farmId,
            @RequestParam(required = false) Boolean isRead
    ) {
        return ResponseEntity.ok(
                alarmService.getAlarmsByReadStatus(farmId, isRead)
        );
    }
    // 단건 읽음 처리
    @PatchMapping("/read")
    public ResponseEntity<Void> readAlarm(
            @RequestParam Long alarmId
    ) {
        alarmService.readAlarm(alarmId);
        return ResponseEntity.ok().build();
    }

    // 🔹 알람 페이지 - 타입별 (SENSOR / EVENT 등)
    @GetMapping("/page/type")
    public ResponseEntity<List<AlarmResponseDTO>> getAlarmsByType(
            @RequestParam Long farmId,
            @RequestParam String alarmType
    ) {
        return ResponseEntity.ok(
                alarmService.getAlarmPageAlarmsByType(farmId, alarmType)
        );
    }

    // 🔹 알람 페이지 - 타입 + 읽음 상태
    @GetMapping("/page/type-read")
    public ResponseEntity<List<AlarmResponseDTO>> getAlarmsByTypeAndRead(
            @RequestParam Long farmId,
            @RequestParam String alarmType,
            @RequestParam(required = false) Boolean isRead
    ) {
        return ResponseEntity.ok(
                alarmService.getAlarmPageAlarmsByTypeAndRead(
                        farmId, alarmType, isRead
                )
        );
    }
}
