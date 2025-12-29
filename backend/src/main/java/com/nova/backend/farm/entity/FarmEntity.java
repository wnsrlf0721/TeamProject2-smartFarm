package com.nova.backend.farm.entity;

import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
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
@Builder
@ToString(exclude = {"nova","presetStep"})
public class FarmEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long farmId;

    @Column(nullable = false)
    private String farmName;

    @Column(nullable = false)
    private int slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nova_id", nullable = false)
    private NovaEntity nova;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id")
    private PresetStepEntity presetStep;

    @CreationTimestamp
    private Timestamp createdTime;
    @UpdateTimestamp
    private Timestamp updateTime;

    @Builder
    public FarmEntity(String farmName, int slot, NovaEntity nova, PresetStepEntity presetStep) {
        this.farmName = farmName;
        this.slot = slot;
        this.nova = nova;
        this.presetStep = presetStep;
    }
    // 헬퍼 메서드: 빈 팜으로 초기화하는 로직 추가
    public void resetStep() {
        this.presetStep = null;
        this.updateTime = new Timestamp(System.currentTimeMillis());
    }

    // 헬퍼 메서드: 다음 단계로 업데이트
    public void updateStep(PresetStepEntity nextStep) {
        this.presetStep = nextStep;
        this.updateTime = new Timestamp(System.currentTimeMillis());
    }
}
