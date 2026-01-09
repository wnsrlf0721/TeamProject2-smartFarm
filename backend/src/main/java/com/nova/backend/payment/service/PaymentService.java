package com.nova.backend.payment.service;

import com.nova.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nova.backend.payment.dto.PaymentRequestDTO;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;


public interface PaymentService {
    // 결제 요청 데이터 조회
    PaymentRequestDTO findRequestDto(String orderUid);
    // 결제(콜백)
    IamportResponse<Payment> paymentByCallback(PaymentCallbackRequestDTO request);
}
