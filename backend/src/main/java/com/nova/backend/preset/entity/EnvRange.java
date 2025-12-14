package com.nova.backend.preset.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvRange implements Serializable {
    private Integer min;
    private Integer max;
}
