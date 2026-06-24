package com.cookverse.ai.config;

import com.cookverse.ai.model.Role;
import com.cookverse.ai.model.User;
import com.cookverse.ai.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedData() {
        if (!userRepository.existsByEmail("admin@cookverse.com")) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@cookverse.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Seeded Admin User: admin@cookverse.com / admin123");
        }
    }
}