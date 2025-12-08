package com.posecalendar.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class UserDataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDefaultAdminUser() {
        return args -> {
            String adminUsername = "admin";

            if (userRepository.findByUsername(adminUsername).isPresent()) {
                log.info("Admin user '{}' already exists, skip init", adminUsername);
                return;
            }

            User admin = User.builder()
                    .username(adminUsername)
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .displayName("Pose Calendar Admin")
                    .role(UserRole.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
            log.info("Created default admin user '{}' with password 'admin123'", adminUsername);
        };
    }
}
