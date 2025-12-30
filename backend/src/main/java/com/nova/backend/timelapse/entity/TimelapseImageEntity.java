package com.nova.backend.timelapse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "timelapse_image")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimelapseImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id", nullable = false)
    private TimelapseEntity timelapseEntity;
    @Column(nullable = false)
    private String imageFilePath;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    public TimelapseImageEntity(TimelapseEntity timelapseEntity, String imageFilePath) {
        this.timelapseEntity = timelapseEntity;
        this.imageFilePath = imageFilePath;
    }
}
