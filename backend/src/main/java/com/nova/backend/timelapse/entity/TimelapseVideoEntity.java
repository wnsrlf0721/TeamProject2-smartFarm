package com.nova.backend.timelapse.entity;

import com.nova.backend.nova.entity.NovaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "timelapse_video")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimelapseVideoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int videoId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id", nullable = false)
    private TimelapseEntity timelapseEntity;
    @Column(nullable = false)
    private String videoFilePath;
    @CreationTimestamp
    private Timestamp createdAt;
    @Column(nullable = false)
    private String size;

    public TimelapseVideoEntity(TimelapseEntity timelapseEntity, String videoFilePath, String size) {
        this.timelapseEntity = timelapseEntity;
        this.videoFilePath = videoFilePath;
        this.size = size;
    }
}
