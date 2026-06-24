package com.cookverse.ai.controller;

import com.cookverse.ai.dto.UserDto;
import com.cookverse.ai.model.User;
import com.cookverse.ai.service.UserService;
import com.cookverse.ai.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RecipeService recipeService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getUserProfile(currentUser.getId()));
    }

    @PutMapping("/api/users/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User currentUser) throws IOException {
        
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = recipeService.saveImage(image);
        }
        
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), name, imageUrl));
    }

    @PutMapping("/api/users/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User currentUser) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        userService.changePassword(currentUser.getId(), currentPassword, newPassword);
        return ResponseEntity.ok().build();
    }

    // Admin routes
    @GetMapping("/api/admin/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/api/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
