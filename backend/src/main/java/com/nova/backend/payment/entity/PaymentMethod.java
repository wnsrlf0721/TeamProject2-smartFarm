package com.nova.backend.payment.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum PaymentMethod {
    CARD("card"),
    TOSSPAY("tosspay"),
    KAKAOPAY("kakaopay");

    @JsonValue
    private final String value;

    PaymentMethod(String value) {
        this.value = value;
    }

    @JsonCreator
    public static PaymentMethod from(String value) {
        return PaymentMethod.valueOf(value.toUpperCase());
    }
}
