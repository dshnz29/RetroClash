#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Replace with your network credentials
#define WIFI_SSID "Dialog 4G 128"
#define WIFI_PASSWORD "8A1c939D"

// Firebase settings
#define DATABASE_URL "https://test-dfc0e-default-rtdb.firebaseio.com/"
#define DATABASE_SECRET "QLiepUBYqpaqnejFuZjGFiAI1fa8RFgv9gXCTG1h"  // Legacy Token

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Set Firebase credentials
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (millis() - lastSendTime > 1000) {
    int randNum = random(0, 100);
    Serial.print("Sending random number: ");
    Serial.println(randNum);

    if (Firebase.RTDB.setInt(&fbdo, "/esp32/random", randNum)) {
      Serial.println("Sent successfully.");
    } else {
      Serial.print("Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }

    lastSendTime = millis();
  }
}
