package com.nova.backend.farm.Entity;

import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.preset.entity.PresetStep;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "farm")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"nova","presetStep"})
public class Farm {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int farmId;

    @Column(nullable = false)
    private String farmName;

    @Column(nullable = false)
    private int location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nova_id", nullable = false)
    private NovaEntity nova;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id", nullable = false)
    private PresetStep presetStep;

    @CreationTimestamp
    private Timestamp createdTime;
    @UpdateTimestamp
    private Timestamp updateTime;

    @Builder
    public Farm(String farmName, int location, NovaEntity nova, PresetStep presetStep) {
        this.farmName = farmName;
        this.location = location;
        this.nova = nova;
        this.presetStep = presetStep;
    }
}
