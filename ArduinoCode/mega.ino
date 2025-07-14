#include <AccelStepper.h>

// --- CoreXY motor pins ---
#define stepPinA 28
#define dirPinA 29
#define stepPinB 24
#define dirPinB 25

// --- Paddle motor pins ---
#define stepPinPaddle1 26
#define dirPinPaddle1 27
#define stepPinPaddle2 22
#define dirPinPaddle2 23

// --- Paddle encoder pins ---
#define enc1PinA 2
#define enc1PinB 3
#define enc2PinA 18
#define enc2PinB 19

// --- Motors ---
AccelStepper motorA(AccelStepper::DRIVER, stepPinA, dirPinA);
AccelStepper motorB(AccelStepper::DRIVER, stepPinB, dirPinB);
AccelStepper paddleMotor1(AccelStepper::DRIVER, stepPinPaddle1, dirPinPaddle1);
AccelStepper paddleMotor2(AccelStepper::DRIVER, stepPinPaddle2, dirPinPaddle2);

// --- Constants ---
const int widthMM = 34;
const int heightMM = 19;
const int stepsPerMM = 80;

const int maxXSteps = widthMM * stepsPerMM;
const int maxYSteps = heightMM * stepsPerMM;

const int paddleWidthMM = 6;
const int paddleWidthSteps = paddleWidthMM * stepsPerMM;

// --- Motion config ---
int xSpeed = 550;
int ySpeed = 550;

// --- Ball state ---
long xSteps = 0;
long ySteps = 0;
bool xDir = true;
bool yDir = true;

// --- Paddle state ---
volatile long encoderDelta1 = 0;
volatile long encoderDelta2 = 0;
long paddleXSteps1 = maxXSteps / 2;
long paddleXSteps2 = maxXSteps / 2;
long lastPaddleTarget1 = paddleXSteps1;
long lastPaddleTarget2 = paddleXSteps2;

// --- Score state ---
int player1Score = 0;
int player2Score = 0;

void setup() {
  Serial.begin(115200);  // USB serial monitor
  Serial2.begin(9600);   // ESP32 communication (TX2=16, RX2=17)

  motorA.setMaxSpeed(5000);
  motorB.setMaxSpeed(5000);
  motorA.setAcceleration(0);
  motorB.setAcceleration(0);

  paddleMotor1.setMaxSpeed(1500);
  paddleMotor1.setAcceleration(1000);
  paddleMotor1.setCurrentPosition(paddleXSteps1);

  paddleMotor2.setMaxSpeed(1500);
  paddleMotor2.setAcceleration(1000);
  paddleMotor2.setCurrentPosition(paddleXSteps2);

  float centerXmm = widthMM / 2.0;
  float centerYmm = heightMM / 2.0;
  long startA = (centerXmm + centerYmm) * stepsPerMM;
  long startB = (centerXmm - centerYmm) * stepsPerMM;
  motorA.setCurrentPosition(startA);
  motorB.setCurrentPosition(startB);

  pinMode(enc1PinA, INPUT_PULLUP);
  pinMode(enc1PinB, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(enc1PinA), handleEnc1A, CHANGE);
  attachInterrupt(digitalPinToInterrupt(enc1PinB), handleEnc1B, CHANGE);

  pinMode(enc2PinA, INPUT_PULLUP);
  pinMode(enc2PinB, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(enc2PinA), handleEnc2A, CHANGE);
  attachInterrupt(digitalPinToInterrupt(enc2PinB), handleEnc2B, CHANGE);
}

void loop() {
  static unsigned long lastPaddleUpdate = 0;
  if (Serial2.available()) {
    String msg = Serial2.readStringUntil('\n');
    Serial.print("From ESP32: ");
    Serial.println(msg);
  }

  if (millis() - lastPaddleUpdate >= 20) {
    lastPaddleUpdate = millis();
    updatePaddle1();
    updatePaddle2();
  }

  updateBallPosition();
  runCoreXY();
  paddleMotor1.run();
  paddleMotor2.run();
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

void updatePaddle1() {
  noInterrupts();
  long delta = encoderDelta1;
  encoderDelta1 = 0;
  interrupts();

  if (delta != 0) {
    paddleXSteps1 += delta;
    paddleXSteps1 = constrain(paddleXSteps1, 0, maxXSteps);
    if (paddleXSteps1 != lastPaddleTarget1) {
      paddleMotor1.moveTo(paddleXSteps1);
      lastPaddleTarget1 = paddleXSteps1;
    }
  }
}

void updatePaddle2() {
  noInterrupts();
  long delta = encoderDelta2;
  encoderDelta2 = 0;
  interrupts();

  if (delta != 0) {
    paddleXSteps2 += delta;
    paddleXSteps2 = constrain(paddleXSteps2, 0, maxXSteps);
    if (paddleXSteps2 != lastPaddleTarget2) {
      paddleMotor2.moveTo(paddleXSteps2);
      lastPaddleTarget2 = paddleXSteps2;
    }
  }
}

void updateBallPosition() {
  xSteps = (motorA.currentPosition() + motorB.currentPosition()) / 2;
  ySteps = (motorA.currentPosition() - motorB.currentPosition()) / 2;

  if (xSteps >= maxXSteps) xDir = false;
  if (xSteps <= 0) xDir = true;

  // Top paddle (Player 2)
  if (ySteps >= maxYSteps) {
    float ballXmm = xSteps / (float)stepsPerMM;
    float paddleXmm = paddleXSteps2 / (float)stepsPerMM;
    float paddleLeft = paddleXmm - (paddleWidthMM / 2.0);
    float paddleRight = paddleXmm + (paddleWidthMM / 2.0);

    if (ballXmm >= paddleLeft && ballXmm <= paddleRight) {
      Serial.println("🎯 HIT (Top)");
      player2Score++;
      sendScoreToESP();
      yDir = false;
    } else {
      Serial.println("❌ MISS (Top)");
      yDir = false;
    }
  }

  // Bottom paddle (Player 1)
  if (ySteps <= 0) {
    float ballXmm = xSteps / (float)stepsPerMM;
    float paddleXmm = paddleXSteps1 / (float)stepsPerMM;
    float paddleLeft = paddleXmm - (paddleWidthMM / 2.0);
    float paddleRight = paddleXmm + (paddleWidthMM / 2.0);

    if (ballXmm >= paddleLeft && ballXmm <= paddleRight) {
      Serial.println("🎯 HIT (Bottom)");
      player1Score++;
      sendScoreToESP();
      yDir = true;
    } else {
      Serial.println("❌ MISS (Bottom)");
      yDir = true;
    }
  }
}

// --- Send Score to ESP32 ---
void sendScoreToESP() {
  String scoreJSON = "{\"player1\":" + String(player1Score) + ",\"player2\":" + String(player2Score) + "}";
  Serial2.println(scoreJSON);
}

// --- Encoder ISR handlers ---
void handleEnc1A() {
  bool A = digitalRead(enc1PinA);
  bool B = digitalRead(enc1PinB);
  encoderDelta1 += (A == B) ? 1 : -1;
}

void handleEnc1B() {
  bool A = digitalRead(enc1PinA);
  bool B = digitalRead(enc1PinB);
  encoderDelta1 += (A != B) ? 1 : -1;
}

void handleEnc2A() {
  bool A = digitalRead(enc2PinA);
  bool B = digitalRead(enc2PinB);
  encoderDelta2 += (A == B) ? 1 : -1;
}

void handleEnc2B() {
  bool A = digitalRead(enc2PinA);
  bool B = digitalRead(enc2PinB);
  encoderDelta2 += (A != B) ? 1 : -1;
}
