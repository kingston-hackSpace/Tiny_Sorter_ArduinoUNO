// Tiny Sorter - plain Serial version (works on Uno, Nano, Leonardo, etc.)
// Receives a single byte from the browser:
//   1 -> sort to one side ("cereal")
//   2 -> sort to the other side ("mallow")
// For testing in the Serial Monitor you can also type the characters 1 or 2.

#include <Servo.h>

Servo myservo;
const int servoPin = 9;
int pos = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("Sketch begins.");
  myservo.attach(servoPin);
  myservo.write(60);
}

void loop() {
  if (Serial.available()) {
    int command = Serial.read();

    if (command == 1 || command == '1') {
      myservo.write(0);
      delay(2000);
      for (pos = 0; pos <= 75; pos++) {      // ease back to the middle
        myservo.write(pos);
        delay(5);
      }
      delay(1000);
      Serial.println("cereal detected.");
    }
    else if (command == 2 || command == '2') {
      myservo.write(180);
      delay(2000);
      for (pos = 180; pos >= 75; pos--) {    // fixed: original counted the wrong way
        myservo.write(pos);
        delay(20);
      }
      delay(1000);
      Serial.println("mallow detected.");
    }

    // Discard anything that arrived while the servo was busy
    while (Serial.available()) {
      Serial.read();
    }
  }
  else {
    // Idle wiggle: shakes the ramp so objects slide down
    for (pos = 60; pos <= 90; pos++) {
      myservo.write(pos);
      delay(3);
    }
    for (pos = 90; pos >= 60; pos--) {
      myservo.write(pos);
      delay(3);
    }
  }
}
