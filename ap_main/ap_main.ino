// BLE Server - http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_server.html#a4e73a6a59133915aa7212d3e87f60084
// BLE github - https://github.com/nkolban/ESP32_BLE_Arduino
// BLE Connected device addres - https://www.esp32.com/viewtopic.php?t=8525

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAddress.h>

class MyBLEServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* p_server, esp_ble_gatts_cb_param_t *p_param) {
    String addres = BLEAddress(p_param->connect.remote_bda).toString().c_str();
    Serial.println(String("Connect: " + addres));
  }
  void onDisconnect(BLEServer* p_server) {
    Serial.println("Disconnect: ");
    BLEDevice::startAdvertising();
  }
};

void setup() {
  Serial.begin(115200);
  while(!Serial);

  BLEDevice::init("BLE Server");
  
  BLEServer *p_server = BLEDevice::createServer();
  p_server->setCallbacks(new MyBLEServerCallbacks());
  
  BLEDevice::startAdvertising();
}

void loop() {
}
