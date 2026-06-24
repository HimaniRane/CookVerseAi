package com.cookverse.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {
    private Long id;
    private String title;
    private String category;
    private String cuisine;
    private String description;
    private String ingredients;
    private String steps;
    private Integer cookingTime;
    private String difficulty;
    private String imageUrl;
    private Long createdById;
    private String createdByName;
    private String createdByRole;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
