package com.cookverse.ai.controller;

import com.cookverse.ai.dto.AiRequest;
import com.cookverse.ai.dto.AiResponse;
import com.cookverse.ai.dto.TranslateRequest;
import com.cookverse.ai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    // USER module endpoint: generate based on ingredients list or recipe title
    @PostMapping("/generate")
    public ResponseEntity<AiResponse> generateUserRecipe(@RequestBody AiRequest request) {
        AiResponse response = geminiService.generateRecipe(request.getIngredients(), request.getTitle());
        return ResponseEntity.ok(response);
    }

    // ADMIN module endpoint: generate based on recipe title
    @PostMapping("/admin-create")
    public ResponseEntity<AiResponse> generateAdminRecipe(@RequestBody AiRequest request) {
        AiResponse response = geminiService.generateRecipe(null, request.getTitle());
        return ResponseEntity.ok(response);
    }

    // Translate recipe fields dynamically
    @PostMapping("/translate")
    public ResponseEntity<AiResponse> translateRecipe(@RequestBody TranslateRequest request) {
        AiResponse response = geminiService.translateRecipe(request);
        return ResponseEntity.ok(response);
    }
}
