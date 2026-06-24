package com.cookverse.ai.service;

import com.cookverse.ai.dto.RecipeDto;
import com.cookverse.ai.exception.ResourceNotFoundException;
import com.cookverse.ai.exception.UnauthorizedException;
import com.cookverse.ai.model.Favorite;
import com.cookverse.ai.model.Recipe;
import com.cookverse.ai.model.Role;
import com.cookverse.ai.model.User;
import com.cookverse.ai.repository.FavoriteRepository;
import com.cookverse.ai.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final FavoriteRepository favoriteRepository;

    private final String UPLOAD_DIR = "uploads";

    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName;
    }

    public List<RecipeDto> getAllRecipes(User currentUser) {
        return recipeRepository.findAll().stream()
                .map(recipe -> mapToDto(recipe, currentUser))
                .collect(Collectors.toList());
    }

    public RecipeDto getRecipeById(Long id, User currentUser) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        return mapToDto(recipe, currentUser);
    }

    public List<RecipeDto> getRecipesByCategory(String category, User currentUser) {
        return recipeRepository.findByCategory(category).stream()
                .map(recipe -> mapToDto(recipe, currentUser))
                .collect(Collectors.toList());
    }

    public List<RecipeDto> getMyRecipes(User currentUser) {
        return recipeRepository.findByCreatedById(currentUser.getId()).stream()
                .map(recipe -> mapToDto(recipe, currentUser))
                .collect(Collectors.toList());
    }

    public List<RecipeDto> searchRecipes(String title, String ingredient, String category, String difficulty, User currentUser) {
        return recipeRepository.searchRecipes(title, ingredient, category, difficulty).stream()
                .map(recipe -> mapToDto(recipe, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public RecipeDto createRecipe(RecipeDto dto, User creator, MultipartFile image) throws IOException {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        } else if (dto.getImageUrl() != null) {
            imageUrl = dto.getImageUrl();
        }

        Recipe recipe = Recipe.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .cuisine(dto.getCuisine())
                .description(dto.getDescription())
                .ingredients(dto.getIngredients())
                .steps(dto.getSteps())
                .cookingTime(dto.getCookingTime())
                .difficulty(dto.getDifficulty())
                .imageUrl(imageUrl)
                .createdBy(creator)
                .createdByRole(creator.getRole().name())
                .build();

        Recipe savedRecipe = recipeRepository.save(recipe);
        return mapToDto(savedRecipe, creator);
    }

    @Transactional
    public RecipeDto updateRecipe(Long id, RecipeDto dto, User currentUser, MultipartFile image) throws IOException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));

        // Check permissions: Admin can update anything, User can only update their own
        if (!currentUser.getRole().equals(Role.ADMIN) && !recipe.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to update this recipe");
        }

        recipe.setTitle(dto.getTitle());
        recipe.setCategory(dto.getCategory());
        recipe.setCuisine(dto.getCuisine());
        recipe.setDescription(dto.getDescription());
        recipe.setIngredients(dto.getIngredients());
        recipe.setSteps(dto.getSteps());
        recipe.setCookingTime(dto.getCookingTime());
        recipe.setDifficulty(dto.getDifficulty());

        if (image != null && !image.isEmpty()) {
            recipe.setImageUrl(saveImage(image));
        }

        Recipe updatedRecipe = recipeRepository.save(recipe);
        return mapToDto(updatedRecipe, currentUser);
    }

    @Transactional
    public void deleteRecipe(Long id, User currentUser) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));

        if (!currentUser.getRole().equals(Role.ADMIN) && !recipe.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this recipe");
        }

        recipeRepository.delete(recipe);
    }

    @Transactional
    public boolean toggleFavorite(Long recipeId, User currentUser) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));

        boolean exists = favoriteRepository.existsByUserIdAndRecipeId(currentUser.getId(), recipe.getId());

        if (exists) {
            favoriteRepository.deleteByUserIdAndRecipeId(currentUser.getId(), recipe.getId());
            return false;
        } else {
            Favorite favorite = Favorite.builder()
                    .user(currentUser)
                    .recipe(recipe)
                    .build();
            favoriteRepository.save(favorite);
            return true;
        }
    }

    public List<RecipeDto> getFavoriteRecipes(User currentUser) {
        return favoriteRepository.findByUserId(currentUser.getId()).stream()
                .map(favorite -> mapToDto(favorite.getRecipe(), currentUser))
                .collect(Collectors.toList());
    }

    private RecipeDto mapToDto(Recipe recipe, User currentUser) {
        boolean isFavorite = false;
        if (currentUser != null) {
            isFavorite = favoriteRepository.existsByUserIdAndRecipeId(currentUser.getId(), recipe.getId());
        }

        return RecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .category(recipe.getCategory())
                .cuisine(recipe.getCuisine())
                .description(recipe.getDescription())
                .ingredients(recipe.getIngredients())
                .steps(recipe.getSteps())
                .cookingTime(recipe.getCookingTime())
                .difficulty(recipe.getDifficulty())
                .imageUrl(recipe.getImageUrl())
                .createdById(recipe.getCreatedBy().getId())
                .createdByName(recipe.getCreatedBy().getName())
                .createdByRole(recipe.getCreatedByRole())
                .isFavorite(isFavorite)
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .build();
    }
}
