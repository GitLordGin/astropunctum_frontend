// BLE Server - http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_server.html#a4e73a6a59133915aa7212d3e87f60084
// BLE github - https://github.com/nkolban/ESP32_BLE_Arduino
// BLE Connected device addres - https://www.esp32.com/viewtopic.php?t=8525
// BLE Disconect device - https://github.com/nkolban/esp32-snippets/issues/387

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAddress.h>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define READ_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define WRITE_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a9"
const int c_ble_timeout = 30000;

BLEServer* g_ble_p_server;
BLEService *p_service;
BLECharacteristic *p_read_characteristic;
BLECharacteristic *p_write_characteristic;
unsigned long g_ble_last_callback = 0;
bool g_ble_connected = false;

class MyBLEServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* p_server, esp_ble_gatts_cb_param_t *p_param) {
    String addres = BLEAddress(p_param->connect.remote_bda).toString().c_str();
    Serial.println(String("Connect: " + addres));
    
    g_ble_connected = true;
    g_ble_last_callback = millis();
  }
  void onDisconnect(BLEServer* p_server) {
    Serial.println("Disconnect: ");
    
    BLEDevice::startAdvertising();
    g_ble_connected = false;
  }
};

int x = 0;
int y = 0;
int rpm = 0;
bool laser = 0;
class MyBLEReadCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic *pCharacteristic) {
    Serial.println("Read: ");
    String str = String("x:" + String(x) + " | y:" + String(y) + " | rpm:" + String(rpm) + " | laser:" + String(laser));
    pCharacteristic->setValue(str.c_str());
    g_ble_last_callback = millis();
  }
};

class MyBLEWriteCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    Serial.print(String("Write: "));
    Serial.println(pCharacteristic->getValue().c_str());
    g_ble_last_callback = millis();
  }
};

void setup() {
  Serial.begin(115200);
  while(!Serial);

  BLEDevice::init("BLE Server");
  
  g_ble_p_server = BLEDevice::createServer();
  g_ble_p_server->setCallbacks(new MyBLEServerCallbacks());

  p_service = g_ble_p_server->createService(SERVICE_UUID);

  p_read_characteristic = p_service->createCharacteristic(
    READ_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ
  );
  p_read_characteristic->setCallbacks(new MyBLEReadCharacteristicCallbacks());
  
  p_write_characteristic = p_service->createCharacteristic(
    WRITE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  p_write_characteristic->setCallbacks(new MyBLEWriteCharacteristicCallbacks());

  p_service->start();
  
  BLEDevice::startAdvertising();
}

void loop() {
  if(g_ble_connected) {
    f_ble_timeout();
    f_ble_set_characteristic();
  }
}

void f_ble_timeout() {
  if(millis() - g_ble_last_callback > c_ble_timeout) {
    g_ble_p_server->disconnect(g_ble_p_server->getConnId());
  }
}

void f_ble_set_characteristic() {
  x = random(100);
  y = random(100);
  rpm = random(100);
  laser = random(100) % 2 == 0;
}
