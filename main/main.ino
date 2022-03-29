#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include <ArduinoJson.h>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define COORDINATES_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a9"

void get_current_coordinates();

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;
BLECharacteristic *pCoordinatesCharacteristic;

bool is_connected = false;

class MyBLEServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    is_connected = true;
  }
  void onDisconnect(BLEServer* pServer) {
    is_connected = false;
    BLEDevice::startAdvertising();
  }
};

class MyBLECharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    Serial.print("I write: ");
    std::string valuee = pCharacteristic->getValue();
    Serial.println(valuee.c_str());
  }
  void onRead(BLECharacteristic *pCharacteristic) {
    Serial.print("I read: ");
    std::string valuee = pCharacteristic->getValue();
    Serial.println(valuee.c_str());
  }
};

class MyBLECoordinatesCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic *pCharacteristic) {
    get_current_coordinates();
  }
};

void setup() {
  Serial.begin(115200);
  while(!Serial);

  BLEDevice::init("BLE Server");
  
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyBLEServerCallbacks());
  
  pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  pCharacteristic->setCallbacks(new MyBLECharacteristicCallbacks());

  pCoordinatesCharacteristic = pService->createCharacteristic(
    COORDINATES_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ
  );
  pCoordinatesCharacteristic->setCallbacks(new MyBLECoordinatesCharacteristicCallbacks());

  pCharacteristic->setValue("Hello World!");

  pService->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
}

// http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_server.html
void loop() {
}


void get_current_coordinates() {
  double x = 5;
  double y = 6;
  Serial.print(x);
  Serial.print("; ");
  Serial.println(y);
}
