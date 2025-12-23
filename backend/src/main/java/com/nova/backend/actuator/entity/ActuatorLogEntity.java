package com.nova.backend.actuator.entity;

import com.nova.backend.farm.entity.FarmEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "actuator_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActuatorLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "actuator_id")
    private Long actuatorId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id")
    private FarmEntity farm;

    @Column(nullable = false)
    private String action;

    @Column(name = "sensor_type", nullable = false)
    private String sensorType;

    @Column(name = "actuator_type", nullable = false)
    private String actuatorType;

    @Column(name = "current_value", nullable = false)
    private Float currentValue;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
