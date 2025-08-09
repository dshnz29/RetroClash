#include <WiFi.h>
#include <FirebaseESP32.h>


#define WIFI_SSID "Dialog 4G"
#define WIFI_PASSWORD "YGLG51T8TD0"


#define FIREBASE_HOST "https://retroclash-f7bf0-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "mw8lJmTM3QNn3Mcz4Upb7cQY57UWMJkk3C9Ev3Wt"


FirebaseData fbdo;

struct Player {
  String name;
  int score;
};

struct GameData {
  Player player1;
  Player player2;
  String gameMode;
  bool mirrorMode;
  bool isPlaying;
};

GameData gameData = {
  {"xyz", 10},
  {"abc", 15},
  "medium",
  true,
  true
};

String matchId = "match123"; // This will be your node in DB

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected.");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  // Get current matches count and set matchId
  if (Firebase.RTDB.getJSON(&fbdo, "/matches")) {
    if (fbdo.dataType() == "json") {
      String jsonStr = fbdo.jsonData();
      // Parse jsonStr to count keys - rough way: count occurrences of '{' at first level or use FirebaseJson
      FirebaseJson json;
      json.setJsonData(jsonStr);
      size_t count = 0;
      json.get(jsonStr, ""); // Root json object

      FirebaseJsonArray arr(&json);
      // Unfortunately FirebaseJson does not provide direct length for json object
      // We can try a workaround counting children by keys

      FirebaseJsonData jsonData;
      if (json.get(jsonData, "")) {
        if (jsonData.type == FirebaseJson::JSON_OBJECT) {
          count = jsonData.count; // This is how many keys at root
        }
      }
      
      Serial.printf("Found %d matches\n", (int)count);
      matchId = String(count + 1);
      Serial.printf("New matchId set: %s\n", matchId.c_str());
    } else {
      Serial.println("Matches node is not a JSON object");
      matchId = "1";
    }
  } else {
    Serial.print("Failed to get matches node: ");
    Serial.println(fbdo.errorReason());
    matchId = "1"; // fallback
  }
}

void updateMatch() {
  if (matchId == "") {
    Serial.println("Match ID not set yet!");
    return;
  }
  String path = "/matches/" + matchId;

  FirebaseJson json;
  json.set("player1/name", gameData.player1.name);
  json.set("player1/score", gameData.player1.score);
  json.set("player2/name", gameData.player2.name);
  json.set("player2/score", gameData.player2.score);
  json.set("gameMode", gameData.gameMode);
  json.set("mirrorMode", gameData.mirrorMode);
  json.set("isPlaying", gameData.isPlaying);

  if (Firebase.RTDB.updateNode(&fbdo, path.c_str(), &json)) {
    Serial.println("Match updated successfully.");
  } else {
    Serial.print("Failed to update match: ");
    Serial.println(fbdo.errorReason());
  }
}

void loop() {
  // Only update after matchId is set
  if (matchId == "") {
    delay(1000);
    return;
  }

  // Increment scores randomly
  gameData.player1.score += random(0, 3);
  gameData.player2.score += random(0, 3);

  updateMatch();

  delay(1000);
}
