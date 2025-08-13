#include <WiFi.h>
#include <Firebase_ESP_Client.h>
// Helper functions for token generation & debug
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ------------------ WiFi Credentials ------------------
#define WIFI_SSID "Redmi 12C"
#define WIFI_PASSWORD "Sanju@21"

// ------------------ Firebase Credentials ------------------
#define API_KEY "AIzaSyB7qBosrYxSVwmEPXw7o-f_uQc8wXtErK8"
#define DATABASE_URL "https://retroclash-f7bf0-default-rtdb.firebaseio.com/"
#define USER_EMAIL "xyz@xyz.com"
#define USER_PASSWORD "xyzxyz"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Declare FirebaseJson object
FirebaseJson gameData;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

// Game state variables (matching your Node.js code)
int player1Score = 10;  // Initial score for xyz
int player2Score = 15;  // Initial score for abc
String player1Name = "xyz";
String player2Name = "abc";
String gameMode = "medium";
bool mirrorMode = true;
bool isPlaying = false;

// Latest match tracking
int latestMatchId = 0;
bool matchIdFound = false;

void setup()
{
  Serial.begin(115200);
  
  // Initialize random seed
  randomSeed(analogRead(0));
  
  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.println("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Assign the api key (required)
  config.api_key = API_KEY;
  // Assign the RTDB URL
  config.database_url = DATABASE_URL;
  
  // Sign up with email and password
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  
  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);
  
  // Assign the callback function for the token generation task
  config.token_status_callback = tokenStatusCallback;
  
  // Begin Firebase
  Firebase.begin(&config, &auth);
  
  Serial.println("Firebase initialized. Getting matches array length...");
  
  // Get the matches array length to find latest match
  getMatchesArrayLength();
}

void loop()
{
  // Update every 1 second (matching your Node.js setInterval)
  if (Firebase.ready() && matchIdFound && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();
    
    // Increment scores randomly (0, 1, or 2 points) - matching Node.js logic
    player1Score += random(0, 3);
    player2Score += random(0, 3);
    
    // Update latest match with new game data
    updateLatestMatch();
  }
}

// Alternative method: Get matches array length using Firebase array methods
void getMatchesArrayLength()
{
  Serial.println("Getting matches array length...");
  
  // Method 1: Try to get array size directly
  if (Firebase.RTDB.getArray(&fbdo, "matches"))
  {
    FirebaseJsonArray arr = fbdo.jsonArray();
    latestMatchId = arr.size();
    
    Serial.println("Matches array length: " + String(latestMatchId));
    
    if (latestMatchId > 0)
    {
      Serial.println("Will update match: " + String(latestMatchId));
      matchIdFound = true;
      loadExistingMatchData();
    }
    else
    {
      Serial.println("Empty array, starting with match/1");
      latestMatchId = 1;
      matchIdFound = true;
    }
  }
  else
  {
    Serial.println("Failed to get array, trying JSON method...");
    findLatestMatch(); // Fallback to the previous method
  }
}

// Function to find the latest match ID by getting matches array length
void findLatestMatch()
{
  Serial.println("Getting matches collection length...");
  
  // Get all matches data to count the array length
  if (Firebase.RTDB.getJSON(&fbdo, "matches"))
  {
    if (fbdo.dataType() == "json")
    {
      FirebaseJson json = fbdo.jsonObject();
      
      // Count the number of keys/matches in the collection
      size_t matchCount = json.iteratorBegin();
      String key, value = "";
      int type = 0;
      int count = 0;
      
      // Count all the match entries
      for (size_t i = 0; i < matchCount; i++)
      {
        json.iteratorGet(i, type, key, value);
        if (key.length() > 0)
        {
          count++;
          // Keep track of the highest numeric key
          int keyNum = key.toInt();
          if (keyNum > latestMatchId)
          {
            latestMatchId = keyNum;
          }
        }
      }
      json.iteratorEnd();
      
      Serial.println("Total matches found: " + String(count));
      Serial.println("Highest match ID: " + String(latestMatchId));
      
      if (latestMatchId > 0)
      {
        Serial.println("Will update match: " + String(latestMatchId));
        matchIdFound = true;
        
        // Load existing data from the latest match
        loadExistingMatchData();
      }
      else
      {
        Serial.println("No matches found, will create match/1");
        latestMatchId = 1;
        matchIdFound = true;
      }
    }
    else
    {
      Serial.println("Matches collection is empty, starting with match/1");
      latestMatchId = 1;
      matchIdFound = true;
    }
  }
  else
  {
    Serial.println("Failed to access matches: " + fbdo.errorReason());
    Serial.println("Defaulting to match/1");
    latestMatchId = 1;
    matchIdFound = true;
  }
}

// Function to load existing match data
void loadExistingMatchData()
{
  String matchPath = "matches/" + String(latestMatchId);
  
  if (Firebase.RTDB.getJSON(&fbdo, matchPath))
  {
    Serial.println("Loading existing match data from: " + matchPath);
    
    FirebaseJson json = fbdo.jsonObject();
    FirebaseJsonData jsonData;
    
    // Load existing scores and continue from there
    if (json.get(jsonData, "player1/score")) {
      player1Score = jsonData.intValue;
    }
    if (json.get(jsonData, "player2/score")) {
      player2Score = jsonData.intValue;
    }
    if (json.get(jsonData, "player1/name")) {
      player1Name = jsonData.stringValue;
    }
    if (json.get(jsonData, "player2/name")) {
      player2Name = jsonData.stringValue;
    }
    if (json.get(jsonData, "gameMode")) {
      gameMode = jsonData.stringValue;
    }
    if (json.get(jsonData, "mirrorMode")) {
      mirrorMode = jsonData.boolValue;
    }
    if (json.get(jsonData, "isPlaying")) {
      isPlaying = jsonData.boolValue;
    }
    
    Serial.printf("Loaded: %s: %d, %s: %d\n", 
                  player1Name.c_str(), player1Score,
                  player2Name.c_str(), player2Score);
  }
}

void updateLatestMatch()
{
  // Clear and rebuild game data JSON
  gameData.clear();
  
  // Set player1 data
  gameData.set("player1/name", player1Name);
  gameData.set("player1/score", player1Score);
  
  // Set player2 data
  gameData.set("player2/name", player2Name);
  gameData.set("player2/score", player2Score);
  
  // Set game settings
  gameData.set("gameMode", gameMode);
  gameData.set("mirrorMode", mirrorMode);
  gameData.set("isPlaying", isPlaying);
  
  // Update the latest match
  String matchPath = "matches/" + String(latestMatchId);
  
  if (Firebase.RTDB.updateNode(&fbdo, matchPath, &gameData))
  {
    Serial.println("Match " + String(latestMatchId) + " updated successfully");
    Serial.printf("Scores - %s: %d, %s: %d\n", 
                  player1Name.c_str(), player1Score, 
                  player2Name.c_str(), player2Score);
  }
  else
  {
    Serial.println("FAILED to update match " + String(latestMatchId) + ": " + fbdo.errorReason());
  }
}

void updateMatch18()
{
  // Clear and rebuild game data JSON
  gameData.clear();
  
  // Set player1 data
  gameData.set("player1/name", player1Name);
  gameData.set("player1/score", player1Score);
  
  // Set player2 data
  gameData.set("player2/name", player2Name);
  gameData.set("player2/score", player2Score);
  
  // Set game settings
  gameData.set("gameMode", gameMode);
  gameData.set("mirrorMode", mirrorMode);
  gameData.set("isPlaying", isPlaying);
  
  // Update match18 directly (not creating match1 inside it)
  if (Firebase.RTDB.updateNode(&fbdo, "matches/18", &gameData))
  {
    Serial.println("Match 18 updated successfully");
    Serial.printf("Scores - %s: %d, %s: %d\n", 
                  player1Name.c_str(), player1Score, 
                  player2Name.c_str(), player2Score);
  }
  else
  {
    Serial.println("FAILED to update match 18: " + fbdo.errorReason());
  }
}

// Optional: Function to read current latest match data and sync local variables
void readLatestMatchData()
{
  String matchPath = "matches/" + String(latestMatchId);
  
  if (Firebase.RTDB.getJSON(&fbdo, matchPath))
  {
    Serial.println("Match " + String(latestMatchId) + " data: " + fbdo.jsonString());
    
    // Parse and update local variables if needed
    FirebaseJson json = fbdo.jsonObject();
    FirebaseJsonData jsonData;
    
    if (json.get(jsonData, "player1/score")) {
      player1Score = jsonData.intValue;
    }
    if (json.get(jsonData, "player2/score")) {
      player2Score = jsonData.intValue;
    }
    if (json.get(jsonData, "player1/name")) {
      player1Name = jsonData.stringValue;
    }
    if (json.get(jsonData, "player2/name")) {
      player2Name = jsonData.stringValue;
    }
    if (json.get(jsonData, "gameMode")) {
      gameMode = jsonData.stringValue;
    }
    if (json.get(jsonData, "mirrorMode")) {
      mirrorMode = jsonData.boolValue;
    }
    if (json.get(jsonData, "isPlaying")) {
      isPlaying = jsonData.boolValue;
    }
  }
  else
  {
    Serial.println("FAILED to read match " + String(latestMatchId) + ": " + fbdo.errorReason());
  }
}

// Optional: Function to manually set game state
void setGameState(bool playing)
{
  isPlaying = playing;
  String matchPath = "matches/" + String(latestMatchId) + "/isPlaying";
  
  if (Firebase.RTDB.setBool(&fbdo, matchPath, isPlaying))
  {
    Serial.println("Game state updated to: " + String(isPlaying ? "Playing" : "Paused"));
  }
  else
  {
    Serial.println("FAILED to update game state: " + fbdo.errorReason());
  }
}

// Optional: Function to reset scores
void resetScores()
{
  player1Score = 0;
  player2Score = 0;
  Serial.println("Scores reset to 0");
}