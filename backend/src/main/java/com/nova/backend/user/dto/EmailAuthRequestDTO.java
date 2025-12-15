package com.nova.backend.user.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class EmailAuthRequestDTO {
    private String email;
    private String code; // verify 시 사용
}
