package com.pollify.pollify.config;

import com.pollify.pollify.security.JwtAuthenticationFilter;
import com.pollify.pollify.security.TenantResolutionFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for Pollify.
 * JWT-based stateless authentication with tenant-aware filters.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final TenantResolutionFilter tenantResolutionFilter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            TenantResolutionFilter tenantResolutionFilter,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.tenantResolutionFilter = tenantResolutionFilter;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - MUST come first
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                // Protected endpoints
                .requestMatchers("/api/super-admin/**").authenticated()
                .requestMatchers("/api/admin/**").authenticated()
                .requestMatchers("/api/voter/**").authenticated()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Add filters in correct order
            .addFilterBefore(tenantResolutionFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
