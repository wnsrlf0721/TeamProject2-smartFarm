package com.nova.backend.preset.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "preset_step")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PresetStepEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stepId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id")
    private PresetEntity preset;
    private int growthStep;
    private int periodDays;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private EnvRange temp;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private EnvRange humidity;

    @Type(JsonType.class)
    @Column(name = "light_power", columnDefinition = "json")
    private EnvRange lightPower;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private EnvRange co2;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private EnvRange soilMoisture;

    private Integer waterLevel;
}
