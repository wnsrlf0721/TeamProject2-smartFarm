package com.nova.backend.preset.entity;

import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preset")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PresetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long presetId;
    @Column(nullable = false)
    private String plantType;
    @Column(nullable = false)
    private String presetName;

    private String presetImageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")   // 추천 프리셋은 NULL
    private UsersEntity user;

}
