// Define pins for 9 LEDs
  const int ledPins[9] = {2, 3, 4, 5, 6, 7, 8, 9, 10};

  // Sound sensor pin
  const int soundSensorPin = A0;

  // Sensitivity threshold for initial trigger (can be adjusted)
  const int MicSensitivity = 35;

  // Optional: Define thresholds for each LED based on sound levels
  // These thresholds should be tuned based on your sensor calibration
  const int thresholds[9] = {35, 45, 65, 80, 100, 120, 125, 130, 135};

  void setup() {
    // Initialize LED pins as outputs
    for (int i = 0; i < 9; i++) {
      pinMode(ledPins[i], OUTPUT);
      digitalWrite(ledPins[i], LOW); // Ensure all LEDs are off initially
    }

    Serial.begin(9600);
  }

  void loop() {
    int soundLevel = analogRead(soundSensorPin); // Read sound level
    Serial.print("Sound Level: ");
    Serial.println(soundLevel);

    // Turn on LEDs based on sound level thresholds
    for (int i = 0; i < 9; i++) {
      if (soundLevel > thresholds[i]) {
        digitalWrite(ledPins[i], HIGH);
      } else {
        digitalWrite(ledPins[i], LOW);
      }
    }

    delay(50); // Short delay for stability
  }