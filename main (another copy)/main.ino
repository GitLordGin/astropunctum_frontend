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

#include <AccelStepper.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define IN1 4
#define IN2 16
#define IN3 17
#define IN4 18


#define IN5 26
#define IN6 25
#define IN7 33
#define IN8 32

#define FULLSTEP 4

const int steps_per_revolution = 2048;
AccelStepper stepper_a(FULLSTEP, IN1, IN3, IN2, IN4);
AccelStepper stepper_b(FULLSTEP, IN5, IN7, IN6, IN8);

JsonArray points;

int current_position_x = 0;
int current_position_y = 0;

bool g_laser_new = false;
bool g_laser_loop = false;
bool g_laser_final = false;
bool g_laser_calibrate = false;
String g_laser_array_string;
JsonArray g_laser_array;

class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, value);

    g_laser_loop = doc["loop"];
    g_laser_final = doc["final"];
    g_laser_array_string = doc["array"].as<String>();
    g_laser_calibrate = doc["calibrate"];
    
    g_laser_array = doc["array"].as<JsonArray>();

    g_laser_new = true;

    points = g_laser_array;

    Serial.println("-------------------");
    Serial.println(g_laser_loop);
    Serial.println(g_laser_final);
    Serial.println(g_laser_calibrate);
    Serial.println(g_laser_array_string);
    Serial.println("===================");
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
  stepper_a.setMaxSpeed(400.0);
  stepper_a.setAcceleration(400.0);
  stepper_a.setSpeed(400);
  stepper_a.moveTo(0);

  stepper_b.setMaxSpeed(400.0);
  stepper_b.setAcceleration(400.0);
  stepper_b.setSpeed(400);
  stepper_b.moveTo(0);
  
//  stepper_a.setSpeed(5);
//  stepper_b.setSpeed(5);
}

void loop() {
  loop_laser_array();
}

void loop_laser_array() {
  if(g_laser_new) {
    g_laser_new = false;
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, g_laser_array_string);
    JsonArray laser_array = doc.as<JsonArray>();
    h_loop_laser_array(laser_array);
    while(g_laser_loop && !g_laser_new) {
      h_loop_laser_array(laser_array);
    }
  }
}

void h_loop_laser_array(JsonArray laser_array) {
  for(JsonVariant v : laser_array) {
    JsonObject obj = v.as<JsonObject>();
    String str_x = (obj["x"]);
    String str_y = (obj["y"]);
    String str_rpm = (obj["rpm"]);
    
    double rpm = str_rpm.toDouble();
    rpm = rpm * 360 / 60;
    rpm = get_steps(rpm);
    int x = get_steps(str_x.toDouble());
    int y = get_steps(str_y.toDouble());
    int rel_x = (int)abs(x - stepper_a.currentPosition());
    int rel_y = (int)abs(y - stepper_b.currentPosition());

    long num_x = rel_x * rel_x;
    long num_y = rel_y * rel_y;
    long num = num_x + num_y;

    double t = sqrt(num)/rpm;
    
    int rpm_x = (int)(rel_x/t);
    int rpm_y = (int)(rel_y/t);

    Serial.println(rpm_x);
    Serial.println(rpm_y);
//
//    rpm_x = 500;
//    rpm_y = 500;

    stepper_a.setMaxSpeed(rpm_x);
    stepper_a.setAcceleration(rpm_x);
    stepper_a.setSpeed(rpm_x);

    stepper_b.setMaxSpeed(rpm_y);
    stepper_b.setAcceleration(rpm_y);
    stepper_b.setSpeed(rpm_y);

    
    go_to_position(x, y);
    delay(333);
  }
}

int get_steps(double deg) {
  int deg_int = deg * 100;
  deg_int = deg_int % 36000;
  int steps = steps_per_revolution * deg_int / 36000;
  return(steps);
}

void go_to_position(int new_position_x, int new_position_y){
  int step_number_x = new_position_x;
  int step_number_y = new_position_y;
  if(!g_laser_calibrate) {
    step_number_x = step_number_x - current_position_x;
    current_position_x = new_position_x;
    step_number_y = step_number_y - current_position_y;
    current_position_y = new_position_y;
  }
  stepper_a.moveTo(new_position_x);
  stepper_b.moveTo(new_position_y);

  Serial.println(new_position_x);
  Serial.println(new_position_y);
  

  bool flag = true;
  while(flag) {
    bool a = stepper_a.distanceToGo() == 0;
    bool b = stepper_b.distanceToGo() == 0;
    if(!a) {
      stepper_a.run();
    }
    if(!b) {
      stepper_b.run();
    }
    if(a && b) {
      flag = false;
    }
  }
//  
//  stepper_a.step(-step_number_x);
//  stepper_b.step(-step_number_y);
//  Serial.println(step_number_x);
//  Serial.println(step_number_y);
}
