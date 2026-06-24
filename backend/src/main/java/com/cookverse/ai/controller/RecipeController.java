package com.cookverse.ai.controller;

import com.cookverse.ai.dto.RecipeDto;
import com.cookverse.ai.model.User;
import com.cookverse.ai.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<RecipeDto>> getAllRecipes(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @AuthenticationPrincipal User currentUser) {
        
        if (title != null || ingredient != null || category != null || difficulty != null) {
            return ResponseEntity.ok(recipeService.searchRecipes(title, ingredient, category, difficulty, currentUser));
        }
        return ResponseEntity.ok(recipeService.getAllRecipes(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(recipeService.getRecipeById(id, currentUser));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<RecipeDto>> getRecipesByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(recipeService.getRecipesByCategory(category, currentUser));
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<List<RecipeDto>> getMyRecipes(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(recipeService.getMyRecipes(currentUser));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RecipeDto>> getFavoriteRecipes(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(recipeService.getFavoriteRecipes(currentUser));
    }

    // Save recipe from JSON (e.g. AI-generated, or saved without new image file upload)
    @PostMapping
    public ResponseEntity<RecipeDto> createRecipeJson(
            @RequestBody RecipeDto dto,
            @AuthenticationPrincipal User currentUser) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeService.createRecipe(dto, currentUser, null));
    }

    // Save recipe with multipart file upload
    @PostMapping(value = "/manual", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDto> createRecipeManual(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("cuisine") String cuisine,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam("cookingTime") Integer cookingTime,
            @RequestParam("difficulty") String difficulty,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User currentUser) throws IOException {

        RecipeDto dto = RecipeDto.builder()
                .title(title)
                .category(category)
                .cuisine(cuisine)
                .description(description)
                .ingredients(ingredients)
                .steps(steps)
                .cookingTime(cookingTime)
                .difficulty(difficulty)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeService.createRecipe(dto, currentUser, image));
    }

    // Update recipe from JSON
    @PutMapping("/{id}")
    public ResponseEntity<RecipeDto> updateRecipeJson(
            @PathVariable Long id,
            @RequestBody RecipeDto dto,
            @AuthenticationPrincipal User currentUser) throws IOException {
        return ResponseEntity.ok(recipeService.updateRecipe(id, dto, currentUser, null));
    }

    // Update recipe with multipart file upload
    @PutMapping(value = "/{id}/manual", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDto> updateRecipeManual(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("cuisine") String cuisine,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam("cookingTime") Integer cookingTime,
            @RequestParam("difficulty") String difficulty,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User currentUser) throws IOException {

        RecipeDto dto = RecipeDto.builder()
                .title(title)
                .category(category)
                .cuisine(cuisine)
                .description(description)
                .ingredients(ingredients)
                .steps(steps)
                .cookingTime(cookingTime)
                .difficulty(difficulty)
                .build();

        return ResponseEntity.ok(recipeService.updateRecipe(id, dto, currentUser, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        recipeService.deleteRecipe(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Boolean> toggleFavorite(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(recipeService.toggleFavorite(id, currentUser));
    }
}
