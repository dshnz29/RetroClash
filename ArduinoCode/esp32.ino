#include <WiFi.h>
#include <Firebase_ESP_Client.h>


#define WIFI_SSID "Dialog 4G"
#define WIFI_PASSWORD "YGLG51T8TD0"


#define FIREBASE_HOST "https://retroclash-f7bf0-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "AIzaSyB7qBosrYxSVwmEPXw7o-f_uQc8wXtErK8"


FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

// Simple token status logging (replaces TokenHelper.h)
void tokenStatusCallback(FirebaseAuth *auth, FirebaseConfig *config) {
  Serial.println("Token event occurred.");
  Serial.print("Auth token: ");
  if (auth->token.uid != "") {
    Serial.println(auth->token.uid.c_str());
  } else {
    Serial.println("(empty)");
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // Assign the API key and database URL
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Sign up anonymously
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase signup successful");
    signupOK = true;
  } else {
    Serial.print("Signup failed: ");
    Serial.println(config.signer.signupError.message.c_str());
  }

  // Set token status callback
  config.token_status_callback = tokenStatusCallback;

  // Start Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK &&
      (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Write an integer
    if (Firebase.RTDB.setInt(&fbdo, "test/int", count)) {
      Serial.println("Wrote int successfully: " + String(count));
    } else {
      Serial.println("Failed to write int: " + fbdo.errorReason());
    }
    count++;

    // Write a float
    float randomFloat = 0.01 + random(0, 100);
    if (Firebase.RTDB.setFloat(&fbdo, "test/float", randomFloat)) {
      Serial.println("Wrote float successfully: " + String(randomFloat));
    } else {
      Serial.println("Failed to write float: " + fbdo.errorReason());
    }
  }
}