#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Wi-Fi credentials
#define WIFI_SSID "Dialog 4G"
#define WIFI_PASSWORD "YGLG51T8TD0"

// Firebase credentials
#define API_KEY "AIzaSyB7qBosrYxSVwmEPXw7o-f_uQc8wXtErK8"
#define DATABASE_URL "https://retroclash-f7bf0-default-rtdb.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;
unsigned long lastUpdate = 0;
const int updateInterval = 1000; // 1 second

// Match ID
String matchId = "match123";

// Game data
int player1Score = 10;
int player2Score = 15;
String player1Name = "xyz";
String player2Name = "abc";
String gameMode = "medium";
bool mirrorMode = true;
bool isPlaying = false;

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConnected with IP: " + WiFi.localIP().toString());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase signup OK");
    signupOK = true;
  } else {
    Serial.printf("Signup error: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK && (millis() - lastUpdate > updateInterval)) {
    lastUpdate = millis();

    // Increment scores randomly (0, 1, or 2)
    player1Score += random(0, 3);
    player2Score += random(0, 3);

    // Create JSON object
    FirebaseJson gameData;
    gameData.set("player1/name", player1Name);
    gameData.set("player1/score", player1Score);
    gameData.set("player2/name", player2Name);
    gameData.set("player2/score", player2Score);
    gameData.set("gameMode", gameMode);
    gameData.set("mirrorMode", mirrorMode);
    gameData.set("isPlaying", isPlaying);

    String path = "/matches/" + matchId;

    if (Firebase.RTDB.updateNode(&fbdo, path.c_str(), &gameData)) {
      Serial.println("Match updated successfully:");
      Serial.println(gameData.raw());
    } else {
      Serial.println("Update failed: " + fbdo.errorReason());
    }
  }
}
