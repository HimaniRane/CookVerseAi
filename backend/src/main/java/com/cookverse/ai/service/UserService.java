package com.cookverse.ai.service;

import com.cookverse.ai.config.JwtUtil;
import com.cookverse.ai.dto.AuthRequest;
import com.cookverse.ai.dto.AuthResponse;
import com.cookverse.ai.dto.RegisterRequest;
import com.cookverse.ai.dto.UserDto;
import com.cookverse.ai.exception.ResourceNotFoundException;
import com.cookverse.ai.exception.UnauthorizedException;
import com.cookverse.ai.model.Role;
import com.cookverse.ai.model.User;
import com.cookverse.ai.repository.FavoriteRepository;
import com.cookverse.ai.repository.RecipeRepository;
import com.cookverse.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final FavoriteRepository favoriteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UnauthorizedException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Users registered via public API are always USER role
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage())
                .build();
    }

    public UserDto getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long recipesCount = recipeRepository.findByCreatedById(user.getId()).size();
        long favoritesCount = favoriteRepository.countByUserId(user.getId());

        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage())
                .recipesCount(recipesCount)
                .favoritesCount(favoritesCount)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserDto updateProfile(Long id, String name, String profileImage) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(name);
        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }
        userRepository.save(user);

        return getUserProfile(id);
    }

    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new UnauthorizedException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    long recipesCount = recipeRepository.findByCreatedById(user.getId()).size();
                    long favoritesCount = favoriteRepository.countByUserId(user.getId());
                    return UserDto.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .profileImage(user.getProfileImage())
                            .recipesCount(recipesCount)
                            .favoritesCount(favoritesCount)
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
