package com.cookverse.ai.dto;

import lombok.Data;

@Data
public class AiRequest {
    private String ingredients; // Commas or spaces separated ingredients
    private String title;       // Recipe title/name for Admin AI generator
}
