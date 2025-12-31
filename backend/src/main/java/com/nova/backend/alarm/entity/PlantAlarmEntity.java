package com.nova.backend.alarm.entity;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "plant_alarm")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantAlarmEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_alarm_id")
    private Long alarmId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private PresetStepEntity presetStep;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private FarmEntity farm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "preset_id", nullable = false)
    private PresetEntity preset;

    @Column(name = "alarm_type", nullable = false)
    private String alarmType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Column(name = "extra_data", columnDefinition = "json")
    private String extraData;
}
