package com.campus.canteen.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "status", "UP",
            "project", "Smart Campus Canteen Pre-Ordering & Live Token System",
            "backendPort", 8081,
            "h2DatabaseConsole", "http://localhost:8081/h2-console",
            "message", "Spring Boot Backend is running successfully!"
        );
    }
}
