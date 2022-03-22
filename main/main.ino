/*
    Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleWrite.cpp
    Ported to Arduino ESP32 by Evandro Copercini
*/

// https://arduinojson.org/v6/api/jsonvariant/
// https://arduinojson.org/v6/api/jsonarray/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include <ArduinoJson.h>

#include <Stepper.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define IN1 23
#define IN2 22
#define IN3 21
#define IN4 19

#define PIN_BUTTON 25

const int steps_per_revolution = 2048;
Stepper stepper_a(steps_per_revolution, IN1, IN3, IN2, IN4);

JsonArray points;

double current_position = 0;


class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      //pCharacteristic->setValue("Hello World");
      std::string value = pCharacteristic->getValue();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, value);
      points = doc.as<JsonArray>();
    }
};

void setup() {
  Serial.begin(115200);
  BLEDevice::init("AstroPunctum");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
  stepper_a.setSpeed(5);
}

void loop() {
        for(JsonVariant v : points) {
        JsonObject obj = v.as<JsonObject>();
        String str_id = (obj["id"]);
        String str_x = (obj["x"]);
        String str_y = (obj["y"]);
        String str_rpm = (obj["rpm"]);
//        Serial.print(str_id);
//        Serial.print(" | ");
//        Serial.print(get_steps(str_x.toDouble()));
//        Serial.print(" | ");
//        Serial.print(get_steps(str_y.toDouble()));
//        Serial.print(" | ");
//        Serial.print(str_rpm);
//        Serial.println("");
        int x = get_steps(str_x.toDouble());
        Serial.println(str_x);
        Serial.println(x);
        go_to_position(x);
        delay(1000);
      }
      //delay(5000);
  // put your main code here, to run repeatedly:
}

int get_steps(double deg) {
  int deg_int = deg * 100;
  deg_int = deg_int % 36000;
  int steps = steps_per_revolution * deg_int / 36000;
  return(steps);
}

void go_to_position(int new_position){
  int step_number = new_position - current_position;
  current_position = new_position;
  stepper_a.step(-step_number);
  Serial.println(step_number);
}
