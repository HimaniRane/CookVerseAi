package com.cookverse.ai.service;

import com.cookverse.ai.dto.AnalyticsDto;
import com.cookverse.ai.model.Recipe;
import com.cookverse.ai.repository.RecipeRepository;
import com.cookverse.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public AnalyticsDto getDashboardAnalytics() {
        long totalRecipes = recipeRepository.count();
        long adminRecipes = recipeRepository.countByCreatedByRole("ADMIN");
        long userRecipes = recipeRepository.countByCreatedByRole("USER");
        long totalUsers = userRepository.count();

        // 1. Group recipes by category
        Map<String, Long> categoryDistribution = recipeRepository.findAll().stream()
                .collect(Collectors.groupingBy(Recipe::getCategory, Collectors.counting()));

        // Ensure all standard categories exist in map (default to 0 if not present)
        String[] defaultCategories = {"Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Beverages"};
        for (String cat : defaultCategories) {
            categoryDistribution.putIfAbsent(cat, 0L);
        }

        // 2. Growth overview - group by Year-Month for sorting, then map to readable text
        // E.g., recipe.getCreatedAt().format("yyyy-MM") -> count
        DateTimeFormatter yearMonthKeyFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        // Use TreeMap to automatically sort keys chronologically (e.g. 2026-05, 2026-06)
        Map<String, Long> rawGrowthMap = recipeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        recipe -> recipe.getCreatedAt() != null ? recipe.getCreatedAt().format(yearMonthKeyFormatter) : "2026-06",
                        TreeMap::new,
                        Collectors.counting()
                ));

        // Format keys to user-friendly string: "Jun 2026"
        Map<String, Long> growthOverview = new LinkedHashMap<>();
        
        // If empty, seed current month
        if (rawGrowthMap.isEmpty()) {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            growthOverview.put(now.format(displayFormatter), 0L);
        } else {
            rawGrowthMap.forEach((k, v) -> {
                try {
                    // Parse key back
                    String[] parts = k.split("-");
                    int year = Integer.parseInt(parts[0]);
                    int month = Integer.parseInt(parts[1]);
                    java.time.LocalDate date = java.time.LocalDate.of(year, month, 1);
                    growthOverview.put(date.format(displayFormatter), v);
                } catch (Exception e) {
                    growthOverview.put(k, v);
                }
            });
        }

        return AnalyticsDto.builder()
                .totalRecipes(totalRecipes)
                .adminAddedRecipes(adminRecipes)
                .userAddedRecipes(userRecipes)
                .totalUsers(totalUsers)
                .categoryDistribution(categoryDistribution)
                .growthOverview(growthOverview)
                .build();
    }
}
