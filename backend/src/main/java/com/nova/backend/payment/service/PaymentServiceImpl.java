package com.nova.backend.payment.service;

import com.nova.backend.market.repository.CartItemRepository;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.repository.OrderRepository;
import com.nova.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nova.backend.payment.dto.PaymentRequestDTO;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.payment.repository.PaymentRepository;
import com.nova.backend.user.entity.UsersEntity;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.math.BigDecimal;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final IamportClient iamportClient;

    @Override
    @Transactional(readOnly = true)
    public PaymentRequestDTO findRequestDto(String orderUid) {
        OrderEntity orderEntity = orderRepository.findWithUserAndPaymentByOrderUid(orderUid)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        UsersEntity user = Objects.requireNonNull(orderEntity.getUser(), "User must not be null");
        PaymentEntity payment = Objects.requireNonNull(orderEntity.getPayment(), "Payment must not be null");

        return PaymentRequestDTO.builder()
                .buyerName(user.getName())
                .buyerEmail(user.getEmail())
                .buyerAddress(user.getAddress())
                .paymentPrice(payment.getPrice())
                .itemName(orderEntity.getItemName())
                .orderUid(orderEntity.getOrderUid())
                .build();
    }


    @Override
    public IamportResponse<Payment> paymentByCallback(PaymentCallbackRequestDTO request) {

        try {
            // 결제 단건 조회(아임포트)
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(request.getPaymentUid());
            // 주문내역 조회
            OrderEntity orderEntity = orderRepository.findWithPaymentByOrderUid(request.getOrderUid())
                    .orElseThrow(() -> new IllegalArgumentException("주문 내역이 없습니다."));

            // 결제 완료가 아니면
            if(!iamportResponse.getResponse().getStatus().equals("paid")) {
                // 주문, 결제 삭제
                orderRepository.delete(orderEntity);
                paymentRepository.delete(orderEntity.getPayment());

                throw new RuntimeException("결제 미완료");
            }

            BigDecimal price = orderEntity.getPayment().getPrice();
            BigDecimal iamportPrice = iamportResponse.getResponse().getAmount();

            // 검증
            if (price.compareTo(iamportPrice) != 0) {
                // 주문, 결제 삭제
                orderRepository.delete(orderEntity);
                paymentRepository.delete(orderEntity.getPayment());

                // 결제 취소(아임포트)
                iamportClient.cancelPaymentByImpUid(
                        new CancelData(iamportResponse.getResponse().getImpUid(), true, iamportPrice)
                );

                throw new RuntimeException("결제금액 위변조 의심");
            }


            orderEntity.getPayment().changePaymentBySuccess(
                    PaymentStatus.OK,
                    iamportResponse.getResponse().getImpUid()
            );

            // 결제 완료 후 장바구니 비우기
            UsersEntity user = orderEntity.getUser();
            cartItemRepository.deleteByUser(user);

            return iamportResponse;

        } catch (IamportResponseException | IOException e) {
            throw new RuntimeException(e);
        }
    }

}
