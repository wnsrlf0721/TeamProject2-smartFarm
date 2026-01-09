package com.nova.backend.order.repository;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderUid(String orderUid);

    List<OrderEntity> findByUser(UsersEntity user);

    // user와 payment까지 같이 fetch
    @EntityGraph(attributePaths = {"user", "payment"})
    Optional<OrderEntity> findWithUserAndPaymentByOrderUid(String orderUid);

    // payment만 fetch
    @EntityGraph(attributePaths = {"payment"})
    Optional<OrderEntity> findWithPaymentByOrderUid(String orderUid);
}
