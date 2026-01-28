package com.busticketbooking.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount = null;
            
            // First try: Environment variable (for production - Render, Heroku, etc.)
            String firebaseCredentialsJson = System.getenv("FIREBASE_CREDENTIALS_JSON");
            String firebaseCredentialsBase64 = System.getenv("FIREBASE_CREDENTIALS_BASE64");
            
            if (firebaseCredentialsJson != null && !firebaseCredentialsJson.isEmpty()) {
                // Raw JSON from environment variable
                serviceAccount = new ByteArrayInputStream(firebaseCredentialsJson.getBytes(StandardCharsets.UTF_8));
                System.out.println("Firebase: Using credentials from FIREBASE_CREDENTIALS_JSON env variable");
            } else if (firebaseCredentialsBase64 != null && !firebaseCredentialsBase64.isEmpty()) {
                // Base64 encoded JSON from environment variable
                byte[] decoded = Base64.getDecoder().decode(firebaseCredentialsBase64);
                serviceAccount = new ByteArrayInputStream(decoded);
                System.out.println("Firebase: Using credentials from FIREBASE_CREDENTIALS_BASE64 env variable");
            } else {
                // Fallback: Try to load from classpath (for local development)
                ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
                if (resource.exists()) {
                    serviceAccount = resource.getInputStream();
                    System.out.println("Firebase: Using credentials from serviceAccountKey.json file");
                }
            }
            
            if (serviceAccount != null) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    System.out.println("Firebase Admin SDK initialized successfully.");
                }
            } else {
                System.out.println("Warning: No Firebase credentials found. Firebase Admin SDK not initialized.");
                System.out.println("Set FIREBASE_CREDENTIALS_JSON or FIREBASE_CREDENTIALS_BASE64 environment variable for production.");
            }
        } catch (Exception e) {
            System.err.println("Warning: Firebase initialization failed. Continuing without Firebase.");
            System.err.println("Error: " + e.getMessage());
            // Don't crash the app if Firebase fails - just log and continue
        }
    }
}
