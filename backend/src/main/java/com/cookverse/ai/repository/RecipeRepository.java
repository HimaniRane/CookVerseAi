package com.cookverse.ai.repository;

import com.cookverse.ai.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    
    List<Recipe> findByCategory(String category);
    
    boolean existsByTitle(String title);
    
    List<Recipe> findByCreatedById(Long userId);
    
    long countByCreatedByRole(String role);
    
    @Query("SELECT r FROM Recipe r WHERE " +
           "(:title IS NULL OR :title = '' OR LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:ingredient IS NULL OR :ingredient = '' OR LOWER(r.ingredients) LIKE LOWER(CONCAT('%', :ingredient, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(r.category) = LOWER(:category)) AND " +
           "(:difficulty IS NULL OR :difficulty = '' OR LOWER(r.difficulty) = LOWER(:difficulty))")
    List<Recipe> searchRecipes(@Param("title") String title, 
                              @Param("ingredient") String ingredient, 
                              @Param("category") String category, 
                              @Param("difficulty") String difficulty);
}
