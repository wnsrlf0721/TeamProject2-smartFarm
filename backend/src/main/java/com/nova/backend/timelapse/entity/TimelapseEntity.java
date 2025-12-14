package com.nova.backend.timelapse.entity;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "timelapse_setting")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimelapseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int settingId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private FarmEntity farmEntity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id", nullable = false)
    private PresetStepEntity presetStepEntity;
    @Column(nullable = false)
    private String timelapseName;
    @Column(nullable = false)
    private int fps;
    @Column(nullable = false)
    private int duration;
    @Column(nullable = false)
    private int captureInterval;
    @Column(nullable = false)
    private String resolution;
    @Column(nullable = false)
    private String state;
    @OneToMany(
            mappedBy = "timelapseEntity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TimelapseVideoEntity> videoList = new ArrayList<>();
}
