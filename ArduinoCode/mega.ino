#include <AccelStepper.h>

// --- CoreXY motor pins ---
#define stepPinA 28
#define dirPinA 29
#define stepPinB 24
#define dirPinB 25

// --- Motors ---
AccelStepper motorA(AccelStepper::DRIVER, stepPinA, dirPinA);
AccelStepper motorB(AccelStepper::DRIVER, stepPinB, dirPinB);

// --- Constants ---
const int widthMM = 34;
const int heightMM = 19;
const int stepsPerMM = 80;

const int maxXSteps = widthMM * stepsPerMM;
const int maxYSteps = heightMM * stepsPerMM;

// --- Motion config ---
int xSpeed = 550;
int ySpeed = 550;

// --- Ball state ---
long xSteps = 17 * stepsPerMM;  // Ball starts at x=17mm
long ySteps = 9.5 * stepsPerMM; // Ball starts at y=9.5mm
bool xDir = true;
bool yDir = true;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);   // ESP32 communication (TX2=16, RX2=17)

  motorA.setMaxSpeed(5000);
  motorB.setMaxSpeed(5000);
  motorA.setAcceleration(0);
  motorB.setAcceleration(0);

  // Set ball starting position to x=17mm, y=9.5mm
  // For CoreXY: motorA = x + y, motorB = x - y
  float startX = 17.0; // mm
  float startY = 9.5;  // mm
  
  long startXSteps = startX * stepsPerMM;
  long startYSteps = startY * stepsPerMM;
  
  long motorAStart = startXSteps + startYSteps;
  long motorBStart = startXSteps - startYSteps;
  
  motorA.setCurrentPosition(motorAStart);
  motorB.setCurrentPosition(motorBStart);
  
  Serial.println("Ball starting at position (17mm, 9.5mm)");
  
  // Move ball to center (0, 0) after startup
  delay(1000); // Wait 1 second
  moveBallToPosition(0, 0);
  Serial.println("Ball moved to center (0mm, 0mm)");
}

void loop() {
  if (Serial2.available()) {
    String msg = Serial2.readStringUntil('\n');
    Serial.print("From ESP32: ");
    Serial.println(msg);
  }

  updateBallPosition();
  runCoreXY();
}

void runCoreXY() {
  int xVel = xDir ? xSpeed : -xSpeed;
  int yVel = yDir ? ySpeed : -ySpeed;

  long speedA = xVel + yVel;
  long speedB = xVel - yVel;

  motorA.setSpeed(speedA);
  motorB.setSpeed(speedB);

  motorA.runSpeed();
  motorB.runSpeed();
}

void updateBallPosition() {
  // Update ball position from motor positions
  xSteps = (motorA.currentPosition() + motorB.currentPosition()) / 2;
  ySteps = (motorA.currentPosition() - motorB.currentPosition()) / 2;

  // Convert to coordinate system where boundaries are at 0 to maxXSteps and 0 to maxYSteps
  long minXSteps = 0;
  long maxXStepsLimit = maxXSteps;
  long minYSteps = 0;
  long maxYStepsLimit = maxYSteps;

  // Bounce off walls
  if (xSteps >= maxXStepsLimit) {
    xDir = false;
    Serial.println("Ball hit right wall");
  }
  if (xSteps <= minXSteps) {
    xDir = true;
    Serial.println("Ball hit left wall");
  }
  
  if (ySteps >= maxYStepsLimit) {
    yDir = false;
    Serial.println("Ball hit top wall");
  }
  if (ySteps <= minYSteps) {
    yDir = true;
    Serial.println("Ball hit bottom wall");
  }

  // Debug output every 1000ms
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug >= 1000) {
    lastDebug = millis();
    Serial.print("Ball position - X: ");
    Serial.print(xSteps);
    Serial.print(" steps (");
    Serial.print(xSteps / (float)stepsPerMM);
    Serial.print("mm), Y: ");
    Serial.print(ySteps);
    Serial.print(" steps (");
    Serial.print(ySteps / (float)stepsPerMM);
    Serial.println("mm)");
  }
}

// Function to move ball to a specific position
void moveBallToPosition(float targetXmm, float targetYmm) {
  Serial.print("Moving ball to position (");
  Serial.print(targetXmm);
  Serial.print("mm, ");
  Serial.print(targetYmm);
  Serial.println("mm)");
  
  // Calculate target motor positions
  long targetXSteps = targetXmm * stepsPerMM;
  long targetYSteps = targetYmm * stepsPerMM;
  
  long motorATarget = targetXSteps + targetYSteps;
  long motorBTarget = targetXSteps - targetYSteps;
  
  // Set motors to move to target positions
  motorA.setMaxSpeed(2000); // Slower speed for positioning
  motorB.setMaxSpeed(2000);
  motorA.setAcceleration(1000);
  motorB.setAcceleration(1000);
  
  motorA.moveTo(motorATarget);
  motorB.moveTo(motorBTarget);
  
  // Wait for movement to complete
  while (motorA.isRunning() || motorB.isRunning()) {
    motorA.run();
    motorB.run();
  }
  
  // Update ball position variables
  xSteps = targetXSteps;
  ySteps = targetYSteps;
  
  // Reset motor settings for normal operation
  motorA.setMaxSpeed(5000);
  motorB.setMaxSpeed(5000);
  motorA.setAcceleration(0);
  motorB.setAcceleration(0);
  
  Serial.println("Ball positioning complete");
}