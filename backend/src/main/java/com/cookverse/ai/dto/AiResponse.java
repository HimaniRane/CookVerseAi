package com.cookverse.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiResponse {
    private String title;
    private String category;
    private String cuisine;
    private String description;
    private String ingredients;
    private String steps;
    private Integer cookingTime;
    private String difficulty;
}
