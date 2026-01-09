package com.nova.backend.order.service;


import com.nova.backend.order.dto.OrderRequestDTO;
import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.validation.Valid;

import java.util.List;

public interface OrderService {
    OrderEntity createOrder(UsersEntity usersEntity, @Valid OrderRequestDTO request);

    //OrderResponse getOrder(CustomUserDetails userDetails);

    List<OrderResponseDTO> getOrders(UsersEntity usersEntity);

    OrderResponseDTO findOrder(String orderUid);

    void confirmOrder(UsersEntity user, String orderUid);

    void cancelOrder(UsersEntity user, String orderUid);


}
