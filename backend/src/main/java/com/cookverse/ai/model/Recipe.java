package com.cookverse.ai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String category; // Breakfast, Lunch, Dinner, Snacks, Desserts, Beverages

    @Column(nullable = false, length = 100)
    private String cuisine;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String ingredients; // Multi-line text

    @Column(nullable = false, columnDefinition = "TEXT")
    private String steps; // Multi-line text

    @Column(name = "cooking_time", nullable = false)
    private Integer cookingTime; // in minutes

    @Column(nullable = false, length = 20)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_by_role", nullable = false, length = 20)
    private String createdByRole; // USER or ADMIN

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
