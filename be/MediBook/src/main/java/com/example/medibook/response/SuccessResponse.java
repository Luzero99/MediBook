package com.example.medibook.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SuccessResponse {
    private String message;
}
