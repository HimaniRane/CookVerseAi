# CookVerse AI 🍳🤖

**CookVerse AI** is a modern, responsive recipe management portal and AI-powered cooking assistant. It helps users reduce food waste by generating gourmet recipes dynamically using whatever ingredients they have in their fridge (Zero-Waste Cooking) and offers multi-language support (including Marathi, Hindi, Spanish, and French) with an elegant, custom design.

---

## ✨ Key Features

* **Zero-Waste AI Recipe Generation**: Enter your available ingredients or a recipe name, and the integrated Groq Llama 3.1 AI model will generate a structured gourmet recipe (title, category, ingredients list, cooking steps, difficulty, and cooking time).
* **Multi-Language Translation**: Translate any recipe on-the-fly to languages like Hindi, Marathi, Spanish, French, and more.
* **Role-Based Portals**:
  * **User Portal**: Manage recipes, save favorites, generate AI recipes, and customize profiles.
  * **Admin Portal**: View platform-wide analytics (total users, recipes, and AI runs), manage/moderate all users, curate system recipes, and edit/delete any recipe.
* **Interactive AI Sandbox**: Users can preview, edit, and fine-tune AI-generated recipes before saving them to their collection.
* **Fail-Safe Mechanism**: If the AI API is unconfigured or unavailable, the backend seamlessly falls back to a mock culinary lookup dictionary to ensure a uninterrupted demo experience.
* **Premium UX/UI**: Styled with a cohesive warm amber color palette, Outfit typography, dark mode support, and clean responsive transitions.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Lucide React, Context API (State & Auth)
* **Backend**: Spring Boot 3.3.0 (Java 17), Spring Security (JWT), Spring Data JPA
* **Database**: H2 Relational Database (file-backed/in-memory)
* **AI Integration**: Groq Cloud API (Llama 3.1 8B/70B models)

---

## 🏗️ Architectural Design

CookVerse AI is built on a decoupled, modular **Client-Server (3-Tier) Architecture**:

* **Client Layer (Frontend)**: A modern Single-Page Application (SPA) built with React 18 and Vite. It manages global authentication, routing, and user interface states while communicating with the backend via stateless HTTP REST requests.
* **Application Layer (Backend)**: A robust REST API built on Spring Boot 3.3.0. It handles user authentication (JWT), role-based authorization, recipe management logic, and interacts with the Groq Cloud API to generate and translate recipes.
* **Storage Layer (Database)**: An H2 relational database managed through Hibernate and Spring Data JPA to store and query details for users, recipes, and user-favorited items.

---

## 🔒 Security Best Practices
* **Never commit API keys or passwords directly to Git.** The backend is configured to read the `GROQ_API_KEY` from the system's environment variables.
* The `application.properties` file contains `${GROQ_API_KEY:gsk_your_key_placeholder}` to ensure the active credential is kept safe from repository scanning.