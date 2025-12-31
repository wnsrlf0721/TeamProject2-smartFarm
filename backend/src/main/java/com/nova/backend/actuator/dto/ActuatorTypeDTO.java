package com.nova.backend.actuator.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ActuatorTypeDTO {
    private String actuatorType; // pump, fan 등
    private String sensorName; //
    private String action;       // ON / OFF
}
