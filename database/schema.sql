-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS cookverse_db;
USE cookverse_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ADMIN or USER
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Breakfast, Lunch, Dinner, Snacks, Desserts, Beverages
    cuisine VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL, -- Multi-line representation or JSON text
    steps TEXT NOT NULL, -- Multi-line step-by-step instructions
    cooking_time INT NOT NULL, -- In minutes
    difficulty VARCHAR(20) NOT NULL, -- Easy, Medium, Hard
    image_url VARCHAR(255) DEFAULT NULL,
    created_by INT NOT NULL,
    created_by_role VARCHAR(20) NOT NULL, -- ADMIN or USER
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Seed Users
-- The passwords are bcrypt hashed versions of 'admin123' and 'user123' respectively.
-- 'admin123' -> $2a$10$n74Vn02e3b2e5O0iO4a8XeC3C9U0qK5aG9g8F2eCdWdPd1w2w2q9u
-- 'user123'  -> $2a$10$r6S8n8n8zO6aO2w0a1oOcu8wA4U4E8U.wF9nPd7d2d1d0eW0E0O2q
INSERT INTO users (id, name, email, password, role, profile_image) VALUES
(1, 'System Administrator', 'admin@cookverse.com', '$2a$10$n74Vn02e3b2e5O0iO4a8XeC3C9U0qK5aG9g8F2eCdWdPd1w2w2q9u', 'ADMIN', NULL),
(2, 'Jane Doe', 'user@cookverse.com', '$2a$10$r6S8n8n8zO6aO2w0a1oOcu8wA4U4E8U.wF9nPd7d2d1d0eW0E0O2q', 'USER', NULL)
ON DUPLICATE KEY UPDATE id=id;

-- Insert Seed Recipes
INSERT INTO recipes (id, title, category, cuisine, description, ingredients, steps, cooking_time, difficulty, image_url, created_by, created_by_role) VALUES
(1, 'Classic Pancakes', 'Breakfast', 'American', 'Fluffy and golden pancakes, perfect for weekend mornings. Serve with maple syrup and fresh berries.', '1.5 cups all-purpose flour\n3.5 tsp baking powder\n1 tsp salt\n1 tbsp white sugar\n1.25 cups milk\n1 egg\n3 tbsp butter, melted', '1. In a large bowl, sift together the flour, baking powder, salt, and sugar.\n2. Make a well in the center and pour in the milk, egg, and melted butter; mix until smooth.\n3. Heat a lightly oiled griddle or frying pan over medium-high heat.\n4. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake.\n5. Brown on both sides and serve hot.', 20, 'Easy', '/uploads/default_pancakes.jpg', 1, 'ADMIN'),
(2, 'Creamy Garlic Butter Salmon', 'Lunch', 'Mediterranean', 'Pan-seared salmon fillets bathed in a rich, buttery garlic cream sauce.', '4 salmon fillets\n2 tbsp olive oil\n2 tbsp butter\n5 cloves garlic, minced\n1 small yellow onion, diced\n1/3 cup dry white wine\n5 oz jarred sun-dried tomato strips, drained\n1.75 cups heavy cream\n3 cups baby spinach leaves\n1/2 cup grated Parmesan cheese', '1. Season salmon fillets with salt and pepper on both sides.\n2. Heat olive oil in a large skillet over medium-high heat and sear salmon for 5 minutes per side until cooked through. Remove salmon.\n3. In the same skillet, melt butter and sauté garlic and onion for 1 minute until fragrant.\n4. Pour in white wine and let it reduce slightly. Add sun-dried tomatoes and cook for 1-2 minutes.\n5. Reduce heat to low, add heavy cream, and bring to a simmer. Add spinach and let it wilt in the cream.\n6. Stir in Parmesan cheese and simmer for another minute.\n7. Return salmon to the skillet, spoon sauce over fillets, and serve hot.', 30, 'Medium', '/uploads/default_salmon.jpg', 1, 'ADMIN'),
(3, 'Paneer Tikka Masala', 'Dinner', 'Indian', 'Marinated paneer cheese cubes grilled and cooked in a rich, creamy, and spiced tomato gravy.', '400g Paneer, cubed\n1 cup yogurt\n2 tbsp ginger-garlic paste\n2 tsp garam masala\n2 tsp chili powder\n1 tsp turmeric\n3 tbsp butter\n1 large onion, finely chopped\n2 cups tomato puree\n1/2 cup heavy cream\nFresh coriander for garnish', '1. Marinate the paneer cubes in yogurt, half of the ginger-garlic paste, garam masala, chili powder, and salt for 30 minutes.\n2. Grill the marinated paneer cubes in an oven or on a pan until lightly charred.\n3. Heat butter in a pan, sauté onions and remaining ginger-garlic paste until golden brown.\n4. Add tomato puree, turmeric, remaining chili powder, and cook until oil separates.\n5. Stir in the heavy cream, add the grilled paneer, and simmer for 5 minutes.\n6. Garnish with fresh coriander and serve hot with naan.', 45, 'Hard', '/uploads/default_paneer.jpg', 2, 'USER')
ON DUPLICATE KEY UPDATE id=id;
