package com.example.userservice;

import org.springframework.web.bind.annotation.*;
import java.sql.*;
import java.io.*;

@RestController
@RequestMapping("/dummy")
public class DummyVulnerable {

    // SQL Injection vulnerability
    @GetMapping("/sql")
    public String sqlInjection(@RequestParam String username) {
        String query = "SELECT * FROM users WHERE username = '" + username + "'";
        // Execute query (simulated)
        return "Query: " + query;
    }

    // XSS vulnerability
    @GetMapping("/xss")
    public String xss(@RequestParam String input) {
        return "<div>" + input + "</div>";
    }

    // Command injection
    @GetMapping("/cmd")
    public String commandInjection(@RequestParam String cmd) {
        try {
            Process process = Runtime.getRuntime().exec("cmd /c " + cmd);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            return output.toString();
        } catch (IOException e) {
            return "Error: " + e.getMessage();
        }
    }

    // Path traversal
    @GetMapping("/file")
    public String pathTraversal(@RequestParam String filename) {
        try {
            File file = new File("/app/files/" + filename);
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String content = reader.readLine();
            reader.close();
            return content;
        } catch (IOException e) {
            return "Error: " + e.getMessage();
        }
    }

    // Hardcoded credentials
    private static final String API_KEY = "sk-1234567890abcdef";
    private static final String DB_PASSWORD = "admin123";

    @GetMapping("/secret")
    public String getSecret() {
        return "API Key: " + API_KEY + ", DB Password: " + DB_PASSWORD;
    }

    // Insecure random
    @GetMapping("/random")
    public String insecureRandom() {
        return "Random: " + Math.random();
    }

    // Log injection
    @GetMapping("/log")
    public String logInjection(@RequestParam String message) {
        System.out.println("User message: " + message);
        return "Logged: " + message;
    }
}