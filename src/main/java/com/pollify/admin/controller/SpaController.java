package com.pollify.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to handle SPA routing.
 * Forwards all non-API routes to index.html for React Router to handle.
 */
@Controller
public class SpaController {

    /**
     * Forward all SPA routes to index.html
     * These routes don't conflict with /api/** backend endpoints
     */
    @GetMapping({
        "/login",
        "/register",
        "/reset-password",
        "/dashboard",
        "/dashboard/**",
        "/polls",
        "/polls/**",
        "/surveys",
        "/surveys/**",
        "/analytics",
        "/analytics/**",
        "/settings",
        "/settings/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
