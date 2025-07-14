#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Replace with your network credentials
#define WIFI_SSID "your-SSID"
#define WIFI_PASSWORD "your-PASSWORD"

// Firebase project credentials
#define API_KEY "your-FIREBASE-API-KEY"
#define DATABASE_URL "https://your-project-id.firebaseio.com/"
#define USER_EMAIL "your@email.com"
#define USER_PASSWORD "your-password"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Configure Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (millis() - lastSendTime > 1000) {
    int randNum = random(0, 100);
    Serial.print("Sending: ");
    Serial.println(randNum);

    if (Firebase.RTDB.setInt(&fbdo, "/esp32/random", randNum)) {
      Serial.println("Sent successfully");
    } else {
      Serial.print("Failed: ");
      Serial.println(fbdo.errorReason());
    }

    lastSendTime = millis();
  }
}
