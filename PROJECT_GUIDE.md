# CookVerse AI - Complete Project Guide & Interview Cheat-Sheet

This document provides a comprehensive breakdown of the **CookVerse AI** codebase. It outlines the architecture, data models, AI integrations, and technical highlights designed to help you confidently explain the project to an interviewer.

---

## 🚀 1. Project Overview & Core Value
**CookVerse AI** is a modern, responsive recipe management portal and AI cooking assistant. The application enables users to store custom recipe collections and generate gourmet dishes dynamically based on ingredients they have in their fridge.

### Key Value Propositions:
* **Zero-Waste Cooking**: Solves the "what should I cook with my leftover ingredients?" problem using generative AI.
* **Role-Based Portals**: Differentiates between standard cooking enthusiasts (Users) and platform moderators (Admins).
* **Multi-Language Inclusion**: Dynamic recipe translations (including local languages like Hindi & Marathi) to make cooking instructions universally accessible.
* **Premium User Experience**: Designed with a Warm Amber brand aesthetic, clean responsive transitions, and a dark mode.

---

## 🏗️ 2. Architectural Design
The project is built on a decoupled, modular **Client-Server (3-Tier)** architecture:

```
[ Frontend: React SPA ] <--- HTTP REST (JSON / JWT) ---> [ Backend: Spring Boot REST API ] <---> [ DB: H2 / Hibernate ]
         ^                                                          |
         |                                                          v
  [ UI Assets / Vite ]                                   [ LLM: Groq Llama 3.1 API ]
```

### A. Frontend (Client Layer)
* **Core Framework**: React 18, Vite (for ultra-fast bundling and Hot Module Replacement).
* **Styling**: Tailwind CSS (customized with a unified amber palette: `#d97706` base brand key).
* **Icons**: Lucide React for consistent visual markers.
* **State & Auth Management**: React Context API (`AuthContext.jsx`) maintains the current user's session, JWT tokens, login states, and user profile metadata globally.
* **Routing**: React Router DOM (supports route guarding, path parameters, and role-based redirects).

### B. Backend (Application Layer)
* **Core Framework**: Spring Boot 3.3.0 (Java 17).
* **Build Tool**: Maven (handles build profiles, dependencies, and testing).
* **Web Layer**: Spring Web (provides MVC routing and builds RESTful APIs).
* **Security Layer**: Spring Security utilizing JSON Web Tokens (JWT) for stateless authentication.
* **Data Layer**: Spring Data JPA (Hibernate implementation) for database interaction.
* **Utilities**: Lombok (cuts boilerplate annotations like `@Getter`, `@Setter`, and `@RequiredArgsConstructor`).

### C. Database (Storage Layer)
* **Engine**: H2 Database (relational, memory-backed/file-based for rapid local testing).
* **Migrations / Initialization**: Spring Data Seeder (`DataSeeder.java`) seeds system roles, default categories, dummy recipes, and guarantees that the admin credential (`admin@cookverse.com` / `admin123`) is correctly initialized on boot.

---

## 💾 3. Database Schema & Relationships
The backend database is structured around two primary entities with a many-to-many relationship mapping:

### 1. `User` Entity
* `id` (Long, Primary Key)
* `name` (String)
* `email` (String, Unique)
* `password` (String, BCrypt-encoded)
* `role` (Enum: `USER`, `ADMIN`)
* `profileImage` (String, URL/Path)

### 2. `Recipe` Entity
* `id` (Long, Primary Key)
* `title` (String)
* `category` (String: Breakfast, Lunch, Dinner, Snacks, Desserts, Beverages)
* `cuisine` (String: e.g. Italian, Indian, Mexican)
* `description` (String, Text)
* `ingredients` (String, Text with newline separation)
* `steps` (String, Text with newline separation)
* `cookingTime` (Integer, Minutes)
* `difficulty` (String: Easy, Medium, Hard)
* `imageUrl` (String)
* `createdById` (Long, foreign key referencing the author)
* `createdAt` (LocalDateTime)

### 3. Many-to-Many Relationship (Favorites)
A join table `user_favorites` handles bookmarking. 
* A `User` has a `Set<Recipe> favoriteRecipes`.
* A `Recipe` is linked to multiple `Users` who favorited it.

---

## 🤖 4. How the AI Integration Works
The generative AI components are built around the **Groq Cloud API** calling the **Llama 3.1 8B/70B** models, offering high-speed text completions.

### A. The Generation Pipeline
1. **Input Submission**: The user chooses between **Generate by Ingredients** (enters tags like "paneer, onion, tomato") or **Generate by Recipe Name** (enters "Pasta Carbonara").
2. **REST Call**: The frontend calls `/api/ai/generate` sending the inputs as JSON.
3. **Prompt Engineering & Constraint Enforcement**: In the backend (`GeminiService.java`), a prompt is constructed. It instructs the LLM:
   * "You are an expert culinary chef."
   * "Construct a recipe using these ingredients."
   * **JSON Constraint**: *"Return ONLY a valid JSON object matching the following structure... Do not include markdown code block characters like \`\`\`json..."*
4. **Structured Output Configuration**: The backend configures the API payload with `"response_format": {"type": "json_object"}`. This forces the model to respond in valid JSON format.
5. **Payload Parsing**: The JSON string returned by Groq is parsed by Spring's `ObjectMapper` directly into an `AiResponse` Java Data Transfer Object (DTO) containing:
   * Title, Category, Cuisine, Description, Ingredients, Steps, CookingTime, and Difficulty.
6. **Client Preview**: The frontend renders these details in a pre-populated form, letting the user modify or refine any parameters before saving the recipe permanently.

### B. Safe Fail-Safe (Mock Engine)
If the API key is not configured, expired, or the network times out, the backend defaults gracefully to a **culinary lookup dictionary** matching key phrases (like chocolate, cake, sandwich, curry) to dummy mock data. This guarantees that the website never crashes and behaves realistically during demonstrations.

---

## 🗣️ 5. How the Translation Layer Works
Dynamic translations allow any recipe to be read in multiple languages on-the-fly:

1. **User Action**: The user selects a language from the dropdown menu (e.g. मराठी / Marathi, हिन्दी / Hindi, Spanish, French, Chinese).
2. **Translation Request**: The frontend calls `/api/ai/translate` sending the current recipe object and the target language name.
3. **Prompt Styling**: The model is prompted:
   * *"Translate the following recipe title, description, cuisine, ingredients list, and steps into [Target Language]."*
   * *"Keep the JSON keys exactly the same. Only translate the text values. Preserve formatting."*
4. **Dynamic State Binding**: The backend parses the translated text, returns it to the client, and the frontend updates the page state. If the user selects "Original Language", the React state simply displays the original un-translated database record.

---

## 🔐 6. Authentication & Roles Implementation
The authentication flow utilizes stateless tokens to keep the application secure and scalable:

```
[ Register / Sign In ] ---> [ Verify email/password ] ---> [ Generate JWT containing Username & Roles ]
                                                                       |
[ Add JWT to Header: 'Authorization: Bearer <token>' ] <---------------|
```

### A. Role Differences
* **USER Role**:
  * View recipe categories and search globally.
  * Access personal dashboard metrics.
  * Generate recipes using AI.
  * Favorite/bookmark recipes.
  * Create, edit, and delete their own manually submitted recipes.
* **ADMIN Role**:
  * Access the **Admin Dashboard** showing platform analytics (Total users, recipes, AI runs).
  * **User Management**: View, track, and manage all accounts.
  * **Recipe Management**: Moderate, edit, or delete any recipe across the entire site.
  * **Curate AI Creator**: Seed customized recipes for the global community.

---

## 💡 7. Interview Talking Points (How to Stand Out)
When describing this project, focus on the architectural and engineering decisions you made:

* **UX Refinements**: *"I cropped the transparent whitespace on the logo asset to ensure the favicon renders cleanly inside browser tabs, and scaled the brand typography to a consistent `text-3xl` using the Outfit font across headers."*
* **Structured Generative Outputs**: *"Rather than just calling an AI and rendering a paragraph of text, I constrained the LLM output using Groq's json_object response format, parsed the JSON in the Spring Boot backend, and populated a React form so that users could edit the AI output before saving it to the database."*
* **API Resiliency**: *"I implemented a keyword-based culinary lookup mock fallback in `GeminiService.java` to prevent system crashes during API timeouts or missing key issues, ensuring the app is demo-ready at all times."*
* **Stateless Security**: *"I secured the endpoints with Spring Security and stateless JWT authentication, ensuring that API requests are authenticated on-the-fly and user sessions are stored securely in React state."*
* **Theme Styling Consistency**: *"I configured the global Tailwind theme configuration to override default colors with a warm amber palette, which unified the design system across the public website, user dashboard, and admin dashboards."*
