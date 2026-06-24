package com.cookverse.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private Long totalRecipes;
    private Long adminAddedRecipes;
    private Long userAddedRecipes;
    private Long totalUsers;
    private Map<String, Long> categoryDistribution; // e.g. {"Breakfast": 10, "Lunch": 5, ...}
    private Map<String, Long> growthOverview;       // e.g. {"June": 12, "July": 15, ...}
}
