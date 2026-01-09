package com.nova.backend.market.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova.backend.market.dto.ProductCreateRequestDTO;
import com.nova.backend.market.dto.ProductUpdateRequestDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    // CROP / DEVICE /NOVA /SERVICE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Column(nullable = false)
    private String name;

    // 농장명 / 제품 라인
    private String farmName;

    // 수경재배 시스템 / IoT 기기 유형
    private String systemType;

    // 작물 전용 필드
    private String plant;
    private String stage;
    private Integer days;

    @Column(nullable = false)
    private BigDecimal price;

    // 단위 ex)개,권,박스,kg
    @Column(nullable = false)
    private String unit;

    // 썸네일 URL
    private String imageUrl;

    // 재고
    @Column(nullable = false)
    private int stock;

    //예약재고
    @Column(nullable = false)
    private int reservedStock;

    // 디바이스 전용 설명
    @Column(length = 1000)
    private String description;

    // 디바이스 스펙 (MySQL JSON)
    @Column(columnDefinition = "json")
    private String specs;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static ProductEntity create(ProductCreateRequestDTO request) {
        ProductEntity entity = new ProductEntity();
        entity.name = request.getName();
        entity.category = request.getCategory();
        entity.farmName = request.getFarmName();
        entity.systemType = request.getSystemType();
        entity.plant = request.getPlant();
        entity.stage = request.getStage();
        entity.days = request.getDays();
        entity.price = request.getPrice();
        entity.unit = request.getUnit();
        entity.imageUrl = request.getImageUrl();
        entity.stock = request.getStock();
        entity.description = request.getDescription();
        try {
            entity.specs = request.getSpecs() == null ? null : objectMapper.writeValueAsString(request.getSpecs());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize specs to JSON", e);
        }
        return entity;
    }

    public void update(ProductUpdateRequestDTO request) {
        this.name = request.getName();
        this.price = request.getPrice();
        this.stock = request.getStock();
        this.description = request.getDescription();
        try {
            this.specs = request.getSpecs() == null ? null : objectMapper.writeValueAsString(request.getSpecs());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize specs to JSON", e);
        }
    }

    //  재고 예약
    public void reserve(int quantity) {
        if (stock - reservedStock < quantity) {
            throw new IllegalStateException("재고 부족");
        }
        reservedStock += quantity;
    }

    //  결제 완료 시 실제 차감
    public void decreaseStock(int quantity) {
        if (reservedStock < quantity) {
            throw new IllegalStateException("예약 재고 부족");
        }
        stock -= quantity;
        reservedStock -= quantity;
    }

    // 주문 취소 시 예약 복구
    public void cancelReserve(int quantity) {
        if (reservedStock < quantity) {
            throw new IllegalStateException("예약 재고 부족");
        }
        reservedStock -= quantity;
    }

}
