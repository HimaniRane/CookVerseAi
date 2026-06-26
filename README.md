# CookVerse AI 🍳🤖

**CookVerse AI** is a modern, responsive recipe management portal and AI-powered cooking assistant. It helps users reduce food waste by generating gourmet recipes dynamically using whatever ingredients they have in their fridge (Zero-Waste Cooking) and offers multi-language support (including Marathi, Hindi, Spanish, and French) with an elegant, custom design.

---

## ✨ Key Features

### 🔑 1. Public & Core Authentication Features
* **Landing Page**: An interactive, premium landing page that showcases the platform's value proposition (Zero-waste cooking, AI assistance) and features calls to action.
* **Secure User Registration & Login**: User registration and authentication using JWT-based stateless sessions.

### 🍳 2. User Portal Features
* **User Dashboard**: Provides users with a summary of their activity metrics (number of recipes created, total AI runs, bookmarked favorites) and quick-access action cards.
* **Zero-Waste AI Recipe Generation**:
  * **Generate by Ingredients**: Users enter ingredients available in their fridge, and the AI (Groq Llama 3.1) constructs a custom recipe.
  * **Generate by Name**: Users type a recipe name, and the AI designs the steps and ingredients.
  * **Fail-Safe Mechanism**: If the AI API is unconfigured/offline, the system gracefully falls back to a database lookup lookup-dictionary to avoid errors.
  * **Interactive AI Sandbox (Preview & Edit)**: Before saving an AI-generated recipe, users can preview and edit it directly within a pre-populated form.
* **On-the-Fly Translation**:
  * Seamlessly translates recipe titles, categories, ingredients, and steps into multiple languages (Marathi, Hindi, Spanish, French, Chinese) using AI. Users can toggle back to the "Original Language" instantly.
* **Personal Recipe Management**:
  * **Create/Add Recipes**: Users can manually add their own recipes (title, category, cuisine, description, ingredients, cooking steps, difficulty, and image URL).
  * **Edit/Delete Recipes**: Users have full control over the recipes they created.
* **Favorites & Bookmarking**:
  * Users can bookmark any recipe globally available on the platform, saving it to a personal collection.
* **Search & Browse Categories**:
  * Global text search across all recipes.
  * Browse recipes structured by category (Breakfast, Lunch, Dinner, Snacks, Desserts, Beverages).
* **User Profile Page**:
  * Manage profile settings, edit username, choose avatar presets (or paste an image URL), and update security credentials.

### 🛡️ 3. Admin Portal Features
* **Admin Dashboard**:
  * Displays platform-wide analytics including total users, total recipes, total AI runs, and recent activity logs.
* **User Management & Moderation**:
  * Admins can view, track, search, and delete registered accounts.
* **Global Recipe Moderation**:
  * Admins have moderation privileges to view, edit, or delete any recipe created by any user across the system.
* **Admin AI Recipe Curation**:
  * Special AI-assisted tools specifically for admins to create and seed curated recipes globally.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Lucide React, Context API (State & Auth)
* **Backend**: Spring Boot 3.3.0 (Java 17), Spring Security (JWT), Spring Data JPA
* **Database**: MySQL Relational Database
* **AI Integration**: Groq Cloud API (Llama 3.1 8B/70B models)

---

## 🏗️ Architectural Design

CookVerse AI is built on a decoupled, modular **Client-Server (3-Tier) Architecture**:

* **Client Layer (Frontend)**: A modern Single-Page Application (SPA) built with React 18 and Vite. It manages global authentication, routing, and user interface states while communicating with the backend via stateless HTTP REST requests.
* **Application Layer (Backend)**: A robust REST API built on Spring Boot 3.3.0. It handles user authentication (JWT), role-based authorization, recipe management logic, and interacts with the Groq Cloud API to generate and translate recipes.
* **Storage Layer (Database)**: A MySQL relational database managed through Hibernate and Spring Data JPA to store and query details for users, recipes, and user-favorited items.
