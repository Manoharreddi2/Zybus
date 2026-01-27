package com.busticketbooking.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // NOTE: The user must place the serviceAccountKey.json in src/main/resources
            // If checking in, handle this securely (e.g. env vars or secret manager)
            ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
            
            if (resource.exists()) {
                InputStream serviceAccount = resource.getInputStream();

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    System.out.println("Firebase Admin SDK initialized successfully.");
                }
            } else {
                System.out.println("Warning: serviceAccountKey.json not found in resources. Firebase Admin SDK not initialized.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
