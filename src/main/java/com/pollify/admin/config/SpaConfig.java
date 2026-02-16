package com.pollify.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Configuration for Single Page Application (SPA) support.
 * 
 * This configuration ensures that:
 * 1. Static resources (JS, CSS, images) are served correctly
 * 2. All non-API routes fallback to index.html for client-side routing
 * 3. API and WebSocket routes are not affected
 * 4. Security against common scanner/bot paths
 */
@Configuration
public class SpaConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource getResource(String resourcePath, Resource location) throws IOException {
                    Resource requestedResource = location.createRelative(resourcePath);
                    
                    // Security: Block common scanner/bot paths
                    if (isBlockedPath(resourcePath)) {
                        return null;
                    }
                    
                    // If the requested resource exists, return it
                    if (requestedResource.exists() && requestedResource.isReadable()) {
                        return requestedResource;
                    }
                    
                    // Smart routing logic
                    if (!resourcePath.startsWith("api/") &&           // Not an API call
                        !resourcePath.startsWith("ws/") &&            // Not a WebSocket call
                        !isStaticResource(resourcePath)) {            // Not a static file
                        // Fallback to index.html for SPA client-side routing
                        return new ClassPathResource("/static/index.html");
                    }
                    
                    return null;
                }
            });
    }
    
    /**
     * Check if the path is a static resource (has a file extension)
     */
    private boolean isStaticResource(String path) {
        return path.contains(".") && (
            path.endsWith(".js") ||
            path.endsWith(".css") ||
            path.endsWith(".html") ||
            path.endsWith(".png") ||
            path.endsWith(".jpg") ||
            path.endsWith(".jpeg") ||
            path.endsWith(".gif") ||
            path.endsWith(".svg") ||
            path.endsWith(".ico") ||
            path.endsWith(".woff") ||
            path.endsWith(".woff2") ||
            path.endsWith(".ttf") ||
            path.endsWith(".eot") ||
            path.endsWith(".json") ||
            path.endsWith(".map")
        );
    }
    
    /**
     * Block common scanner/bot paths for security
     */
    private boolean isBlockedPath(String path) {
        return path.contains("..") ||                    // Path traversal
               path.endsWith(".php") ||                  // PHP files
               path.endsWith(".asp") ||                  // ASP files
               path.endsWith(".aspx") ||                 // ASPX files
               path.contains("wp-admin") ||              // WordPress
               path.contains("wp-content") ||            // WordPress
               path.contains("wp-includes") ||           // WordPress
               path.contains("phpMyAdmin") ||            // phpMyAdmin
               path.contains(".env") ||                  // Environment files
               path.contains(".git") ||                  // Git files
               path.contains("config.") ||               // Config files
               path.contains("backup");                  // Backup files
    }
}
