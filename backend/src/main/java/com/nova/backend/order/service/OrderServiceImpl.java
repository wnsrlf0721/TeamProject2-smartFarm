package com.nova.backend.order.service;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.CartItemRepository;
import com.nova.backend.market.repository.ProductRepository;
import com.nova.backend.order.dto.OrderRequestDTO;
import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.entity.OrderItemEntity;
import com.nova.backend.order.repository.OrderRepository;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.payment.repository.PaymentRepository;
import com.nova.backend.user.entity.UsersEntity;
import com.siot.IamportRestClient.IamportClient;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private final IamportClient iamportClient;

    @Override
    public OrderEntity createOrder(UsersEntity user, OrderRequestDTO request) {

        List<CartItemEntity> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("장바구니 비어있음");
        }

        OrderEntity order = OrderEntity.builder()
                .user(user)
                .deliveryAddress(request.getDeliveryAddress())
                .phoneNumber(request.getPhoneNumber())
                .recipientName(request.getRecipientName())
                .orderUid("ORD-" + UUID.randomUUID())
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItemEntity cartItem : cartItems) {


            ProductEntity product = productRepository.findById(
                    cartItem.getProduct().getProductId()
            ).orElseThrow(() -> new EntityNotFoundException("상품 없음"));

            //  재고 예약
            product.reserve(cartItem.getQuantity());

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .productId(product.getProductId())
                    .name(product.getName())
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .imageUrl(cartItem.getImageUrl())
                    .build();

            order.addOrderItem(orderItem);
        }

        order.setOrderTotalPrice(totalPrice);
        orderRepository.save(order);

        PaymentEntity payment = PaymentEntity.builder()
                .order(order)
                .price(totalPrice)
                .status(PaymentStatus.READY)
                .build();

        paymentRepository.save(payment);
        order.setPayment(payment);

        return order;
    }


    @Override
    public List<OrderResponseDTO> getOrders(UsersEntity user) {
        List<OrderEntity> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(order -> OrderResponseDTO.from(order, "주문 내역"))
                .toList();
    }

    @Override
    public OrderResponseDTO findOrder(String orderUid) {
        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다."));

        return OrderResponseDTO.from(order, "주문 단건 조회");
    }

    @Override
    @Transactional
    public void confirmOrder(UsersEntity user, String orderUid) {

        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new EntityNotFoundException("주문 없음"));

        if (!order.getUser().equals(user)) {
            throw new IllegalStateException("권한 없음");
        }

        for (OrderItemEntity item : order.getOrderItems()) {

            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("상품 없음"));

            //  실제 재고 감소
            product.decreaseStock(item.getQuantity());
        }

        order.confirm();
    }


    @Override
    @Transactional
    public void cancelOrder(UsersEntity user, String orderUid) {

        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new EntityNotFoundException("주문 없음"));

        if (!order.getUser().equals(user)) {
            throw new IllegalStateException("권한 없음");
        }

        for (OrderItemEntity item : order.getOrderItems()) {

            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow();

            product.cancelReserve(item.getQuantity());
        }

        order.cancel();
    }


}
