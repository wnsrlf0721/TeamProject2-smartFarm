package com.nova.backend.sensor.entity;

import com.nova.backend.farm.entity.FarmEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private FarmEntity farm; //sensorLog:farm - N:1

    @CreationTimestamp
    @Column(name = "record_time", nullable = false)
    private LocalDateTime recordTime;

    @Column(nullable = false)
    private Float temp;

    @Column(nullable = false)
    private Float humidity;

    @Column(name = "light_power", nullable = false)
    private Float lightPower;

    @Column(nullable = false)
    private Float co2;

    @Column(name = "soil_moisture", nullable = false)
    private Float soilMoisture;

    @Column(name = "water_level", nullable = false)
    private Float waterLevel;
}
