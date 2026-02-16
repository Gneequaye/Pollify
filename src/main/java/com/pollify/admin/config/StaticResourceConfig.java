package com.pollify.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

/**
 * Static resource caching configuration.
 * 
 * This configuration implements an intelligent caching strategy:
 * - Hashed assets (built by Vite with content hashes) are cached for 1 year
 * - index.html is never cached (must always be fresh)
 * 
 * Vite generates filenames like: index-BDk2GE_u.js, styles-abc123.css
 * These hashed filenames change when content changes, making aggressive caching safe.
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Aggressive caching for hashed assets (1 year)
        // Vite generates files like: index-BDk2GE_u.js, styles-abc123.css
        // These files have content hashes, so they never change
        registry
            .addResourceHandler("/assets/**")
            .addResourceLocations("classpath:/static/assets/")
            .setCacheControl(CacheControl.maxAge(Duration.ofDays(365))
                .cachePublic()
                .immutable());
        
        // No caching for index.html
        // Must always be fresh to load the latest version of the app
        registry
            .addResourceHandler("/", "/index.html")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.noCache()
                .mustRevalidate());
        
        // Moderate caching for other static resources (images, fonts, etc.)
        // These might not have content hashes
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.maxAge(Duration.ofHours(1))
                .cachePublic());
    }
}
