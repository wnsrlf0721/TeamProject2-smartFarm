package com.nova.backend.preset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preset_step")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PresetStep {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stepId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id")
    private Preset preset;
    private int growthStep;
    private int periodDays;
}
