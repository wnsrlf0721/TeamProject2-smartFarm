package com.nova.backend.payment.repository;

import com.nova.backend.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}
