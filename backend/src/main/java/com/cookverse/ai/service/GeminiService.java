package com.cookverse.ai.service;

import com.cookverse.ai.dto.AiResponse;
import com.cookverse.ai.dto.TranslateRequest;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String modelName;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(JsonParser.Feature.ALLOW_COMMENTS, true)
            .configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true)
            .configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);

    public AiResponse generateRecipe(String ingredients, String title) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("gsk_your_key") || apiKey.contains("placeholder")) {
            return generateMockRecipe(ingredients, title);
        }

        String prompt = buildPrompt(ingredients, title);

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey.trim());

            // Construct payload:
            // {
            //   "model": "llama-3.1-8b-instant",
            //   "messages": [{"role": "user", "content": "prompt"}],
            //   "response_format": {"type": "json_object"}
            // }
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelName);
            payload.put("messages", List.of(message));
            payload.put("response_format", responseFormat);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            } else {
                throw new RuntimeException("Groq API call failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
            // Fail gracefully to mock data for demonstration
            return generateMockRecipe(ingredients, title);
        }
    }

    private String buildPrompt(String ingredients, String title) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert culinary chef AI. Generate a detailed cooking recipe ");
        if (ingredients != null && !ingredients.isEmpty()) {
            sb.append("using these main ingredients: ").append(ingredients).append(". ");
        } else if (title != null && !title.isEmpty()) {
            sb.append("named: \"").append(title).append("\". ");
        }

        sb.append("Return ONLY a valid JSON object matching the following structure. Do not include markdown code block characters like '```json' or '```', and do not write any introductory or concluding sentences. Just return the raw JSON object.\n\n");
        sb.append("{\n");
        sb.append("  \"title\": \"Recipe Name\",\n");
        sb.append("  \"category\": \"Category name (must be one of: Breakfast, Lunch, Dinner, Snacks, Desserts, Beverages)\",\n");
        sb.append("  \"cuisine\": \"Cuisine origin (e.g. Italian, Indian, Mexican)\",\n");
        sb.append("  \"description\": \"A brief, appetizing description of the dish.\",\n");
        sb.append("  \"ingredients\": \"A string with newline-separated ingredients list (with quantities)\",\n");
        sb.append("  \"steps\": \"A string with newline-separated step-by-step preparation and cooking instructions\",\n");
        sb.append("  \"cookingTime\": 30,\n");
        sb.append("  \"difficulty\": \"Difficulty level (must be one of: Easy, Medium, Hard)\"\n");
        sb.append("}");

        return sb.toString();
    }

    private AiResponse parseGeminiResponse(String rawBody) {
        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String text = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            String cleanJson = text.trim();
            int firstBrace = cleanJson.indexOf("{");
            int lastBrace = cleanJson.lastIndexOf("}");
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
            }

            return objectMapper.readValue(cleanJson, AiResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse recipe from Groq response: " + e.getMessage(), e);
        }
    }

    private AiResponse generateMockRecipe(String ingredients, String title) {
        String recipeTitle = (title != null && !title.isEmpty()) ? title : "AI Special Selection";
        String lowerTitle = recipeTitle.toLowerCase();
        
        // 1. Dessert Keyword Matches (Cake, brownie, cookie, etc.)
        if (lowerTitle.contains("cake") || lowerTitle.contains("brownie") || lowerTitle.contains("cookie") || lowerTitle.contains("tiramisu") || lowerTitle.contains("chocolate")) {
            return AiResponse.builder()
                    .title(recipeTitle)
                    .category("Desserts")
                    .cuisine("Baker's Delight")
                    .description("A rich, decadent dessert crafted with precision, featuring molten textures and sweet aromas.")
                    .ingredients("1/2 cup high-quality chocolate chips\n2 tbsp unsalted butter\n1 large egg\n2 tbsp sugar\n1.5 tbsp all-purpose flour\nPinch of salt\nPowdered sugar for dusting")
                    .steps("1. Melt the chocolate and butter together in a microwave-safe bowl in 20-second bursts.\n2. In a small mug or ramekin, whisk egg and sugar together until light.\n3. Fold the melted chocolate mixture and flour into the eggs.\n4. Microwave on high for 60-70 seconds (or bake at 375°F for 10 minutes) until the edges are firm but center is soft.\n5. Dust with powdered sugar and serve warm.")
                    .cookingTime(10)
                    .difficulty("Easy")
                    .build();
        }

        // 2. Seafood Keyword Matches (Salmon, fish, shrimp, etc.)
        if (lowerTitle.contains("salmon") || lowerTitle.contains("fish") || lowerTitle.contains("shrimp") || lowerTitle.contains("seafood")) {
            return AiResponse.builder()
                    .title(recipeTitle)
                    .category("Lunch")
                    .cuisine("Mediterranean")
                    .description("Flaky, pan-seared seafood glazed in a delicious garlic butter sauce and fresh lemon juice.")
                    .ingredients("200g Fresh salmon fillet\n1 tbsp olive oil\n2 tbsp butter\n3 cloves garlic, minced\n1/2 lemon, juiced\nSalt and black pepper to taste\nChopped parsley for garnish")
                    .steps("1. Season the salmon fillet with salt and black pepper on both sides.\n2. Heat olive oil in a pan over medium-high heat and sear the salmon skin-side down for 4 minutes.\n3. Flip and cook for another 3 minutes.\n4. Reduce heat to low, add butter and minced garlic, and baste the salmon with the melted butter for 1 minute.\n5. Squeeze lemon juice over the top, garnish with parsley, and serve hot.")
                    .cookingTime(15)
                    .difficulty("Medium")
                    .build();
        }

        // 3. Indian Curry Keyword Matches (Paneer, curry, tikka, masala, chicken)
        if (lowerTitle.contains("paneer") || lowerTitle.contains("curry") || lowerTitle.contains("tikka") || lowerTitle.contains("masala")) {
            return AiResponse.builder()
                    .title(recipeTitle)
                    .category("Dinner")
                    .cuisine("Indian")
                    .description("A savory, rich, and creamy spiced tomato gravy infused with aromatic spices.")
                    .ingredients("250g Paneer cubes (or chicken chunks)\n1 cup tomato puree\n1/2 onion, finely chopped\n1 tbsp ginger-garlic paste\n1/2 cup heavy cream\n1.5 tsp Garam Masala\n1 tsp chili powder\n1 tbsp butter")
                    .steps("1. Sauté chopped onions and ginger-garlic paste in melted butter until golden brown.\n2. Pour in the tomato puree, Garam Masala, chili powder, and salt. Cook until oil separates.\n3. Add the paneer cubes (or cooked chicken) and simmer for 5 minutes.\n4. Stir in heavy cream and let it bubble gently for 2 minutes.\n5. Garnish with fresh coriander leaves and serve with warm flatbread.")
                    .cookingTime(25)
                    .difficulty("Medium")
                    .build();
        }

        // 4. Pasta Keyword Matches (Pasta, spaghetti, alfredo)
        if (lowerTitle.contains("pasta") || lowerTitle.contains("spaghetti") || lowerTitle.contains("alfredo") || lowerTitle.contains("noodle")) {
            return AiResponse.builder()
                    .title(recipeTitle)
                    .category("Dinner")
                    .cuisine("Italian")
                    .description("Freshly boiled pasta tossed in a creamy, velvety cheese sauce with garlic and fresh herbs.")
                    .ingredients("200g Fettuccine or Spaghetti\n1 tbsp butter\n2 cloves garlic, minced\n3/4 cup heavy cream\n1/2 cup grated Parmesan cheese\nBlack pepper and parsley")
                    .steps("1. Boil the pasta in salted water until al dente. Drain and reserve 1/4 cup pasta water.\n2. In a pan, melt butter and sauté garlic for 30 seconds.\n3. Pour in heavy cream and bring to a simmer.\n4. Turn off heat, stir in Parmesan cheese until fully melted and smooth.\n5. Toss pasta in the sauce, add pasta water if too thick, and top with fresh parsley and ground black pepper.")
                    .cookingTime(20)
                    .difficulty("Easy")
                    .build();
        }

        // 5. Burger/Sandwich Keyword Matches (Burger, sandwich, bread, toast)
        if (lowerTitle.contains("burger") || lowerTitle.contains("sandwich") || lowerTitle.contains("toast") || lowerTitle.contains("bread")) {
            return AiResponse.builder()
                    .title(recipeTitle)
                    .category("Snacks")
                    .cuisine("American")
                    .description("A classic, hearty sandwich stacked with fresh toppings and savory dressings.")
                    .ingredients("1 Burger bun or 2 slices bread\n1 savory patty or protein slice\n1 slice Cheddar cheese\n1 slice tomato\nLettuce leaves\n1 tbsp mayonnaise & ketchup mix")
                    .steps("1. Toast the buns or bread slices on a dry skillet until warm and lightly crisp.\n2. Grill the patty in a pan over medium heat for 3-4 minutes per side.\n3. Melt the cheese slice on top of the hot patty.\n4. Spread mayonnaise and ketchup sauce on the bread, stack lettuce, tomato, patty, and close.\n5. Serve immediately with potato chips.")
                    .cookingTime(15)
                    .difficulty("Easy")
                    .build();
        }

        // 6. Generic Fallback (Assorted Vegetables Stir Fry)
        String mainIngredients = (ingredients != null && !ingredients.isEmpty()) ? ingredients : "Assorted Vegetables, Garlic, Olive Oil";
        return AiResponse.builder()
                .title(recipeTitle)
                .category("Lunch")
                .cuisine("Global Fusion")
                .description("A delicious and customizable chef's recipe featuring " + mainIngredients + ", cooked with culinary perfection.")
                .ingredients(mainIngredients.replace(",", "\n") + "\n1 tbsp olive oil\n2 cloves garlic, minced\nSalt and black pepper to taste\nOptional: fresh herbs")
                .steps("1. Prepare all ingredients by washing, peeling, and chopping as needed.\n2. Heat olive oil in a pan over medium heat.\n3. Sauté garlic until fragrant (about 30 seconds).\n4. Add main ingredients (" + mainIngredients + ") and stir-fry for 5-7 minutes.\n5. Season with salt, pepper, and fresh herbs.\n6. Serve warm as a main dish or sides.")
                .cookingTime(15)
                .difficulty("Easy")
                .build();
    }

    public AiResponse translateRecipe(TranslateRequest request) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("gsk_your_key") || apiKey.contains("placeholder")) {
            return translateMockRecipe(request);
        }

        String prompt = buildTranslatePrompt(request);

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey.trim());

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelName);
            payload.put("messages", List.of(message));
            payload.put("response_format", responseFormat);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            } else {
                throw new RuntimeException("Groq Translation API call failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("Error calling Groq translation API: " + e.getMessage());
            return translateMockRecipe(request);
        }
    }

    private String buildTranslatePrompt(TranslateRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert translator. Translate the following recipe fields into the target language: \"")
          .append(request.getTargetLanguage())
          .append("\". Ensure the translation is natural, accurate, and preserves any formatting (such as newline separators in ingredients and steps).\n\n");
        
        sb.append("Source Fields to Translate:\n");
        sb.append("- Title: ").append(request.getTitle()).append("\n");
        sb.append("- Cuisine: ").append(request.getCuisine()).append("\n");
        sb.append("- Description: ").append(request.getDescription()).append("\n");
        sb.append("- Ingredients (newlines separated):\n").append(request.getIngredients()).append("\n");
        sb.append("- Steps (newlines separated):\n").append(request.getSteps()).append("\n\n");

        sb.append("Return ONLY a valid JSON object matching the following structure. Do not include markdown code block characters like '```json' or '```', and do not write any introductory or concluding sentences. Just return the raw JSON object.\n\n");
        sb.append("{\n");
        sb.append("  \"title\": \"Translated Recipe Name\",\n");
        sb.append("  \"cuisine\": \"Translated Cuisine Name (if applicable, else keep translated name)\",\n");
        sb.append("  \"description\": \"Translated description\",\n");
        sb.append("  \"ingredients\": \"Translated ingredients list (maintaining newline separators)\",\n");
        sb.append("  \"steps\": \"Translated instructions list (maintaining newline separators)\"\n");
        sb.append("}");

        return sb.toString();
    }

    private AiResponse translateMockRecipe(TranslateRequest request) {
        String lang = request.getTargetLanguage().toLowerCase();
        String title = request.getTitle();
        String description = request.getDescription();
        String cuisine = request.getCuisine();
        String ingredients = request.getIngredients();
        String steps = request.getSteps();

        if (lang.contains("spanish") || lang.contains("es")) {
            return AiResponse.builder()
                    .title("Receta de " + title)
                    .cuisine(cuisine.equalsIgnoreCase("Indian") ? "India" : (cuisine.equalsIgnoreCase("Italian") ? "Italiana" : cuisine))
                    .description("Una deliciosa receta para preparar " + title + ": " + description)
                    .ingredients(ingredients.replace("cup", "taza").replace("tbsp", "cucharada").replace("tsp", "cucharadita").replace("cloves", "dientes"))
                    .steps(steps.replace("Step", "Paso").replace("Boil", "Hervir").replace("Sauté", "Saltear").replace("Serve", "Servir"))
                    .build();
        } else if (lang.contains("french") || lang.contains("fr")) {
            return AiResponse.builder()
                    .title("Recette de " + title)
                    .cuisine(cuisine)
                    .description("Une délicieuse recette pour préparer " + title + ": " + description)
                    .ingredients(ingredients.replace("cup", "tasse").replace("tbsp", "cuillère à soupe").replace("tsp", "cuillère à café"))
                    .steps(steps.replace("Step", "Étape").replace("Boil", "Bouillir").replace("Serve", "Servir"))
                    .build();
        } else if (lang.contains("hindi") || lang.contains("hi")) {
            return AiResponse.builder()
                    .title(title + " की रेसिपी")
                    .cuisine(cuisine)
                    .description(title + " की एक स्वादिष्ट रेसिपी: " + description)
                    .ingredients(ingredients.replace("cup", "कप").replace("spoon", "चम्मच"))
                    .steps(steps.replace("Step", "चरण").replace("Serve", "परोसें"))
                    .build();
        } else if (lang.contains("marathi") || lang.contains("mr")) {
            return AiResponse.builder()
                    .title(title + " रेसिपी")
                    .cuisine(cuisine)
                    .description(title + " ची एक स्वादिष्ट रेसिपी: " + description)
                    .ingredients(ingredients.replace("cup", "कप").replace("spoon", "चमचा").replace("tbsp", "चमचा"))
                    .steps(steps.replace("Step", "पायरी").replace("Serve", "वाढा"))
                    .build();
        } else {
            // Generic translation fallback
            String prefix = "[" + request.getTargetLanguage() + "] ";
            return AiResponse.builder()
                    .title(prefix + title)
                    .cuisine(prefix + cuisine)
                    .description(prefix + description)
                    .ingredients(prefix + ingredients.replace("\n", "\n" + prefix))
                    .steps(prefix + steps.replace("\n", "\n" + prefix))
                    .build();
        }
    }
}

