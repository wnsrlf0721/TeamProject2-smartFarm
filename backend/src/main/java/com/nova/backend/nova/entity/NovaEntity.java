package com.nova.backend.nova.entity;

import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nova")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NovaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long novaId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",  nullable = false)
    private UsersEntity user;
    @Column(nullable = false, unique = true)
    private String novaSerialNumber;
    @Column(nullable = false)
    private String status;

    public NovaEntity(UsersEntity user, String novaSerialNumber, String status) {
        this.user = user;
        this.novaSerialNumber = novaSerialNumber;
        this.status = status;
    }
}
