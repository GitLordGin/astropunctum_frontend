// BLE Server - http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_server.html#a4e73a6a59133915aa7212d3e87f60084
// BLE github - https://github.com/nkolban/ESP32_BLE_Arduino
// BLE Connected device addres - https://www.esp32.com/viewtopic.php?t=8525
// BLE Disconect device - https://github.com/nkolban/esp32-snippets/issues/387

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAddress.h>

const int c_ble_timeout = 10000;

BLEServer* g_ble_p_server;
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

void setup() {
  Serial.begin(115200);
  while(!Serial);

  BLEDevice::init("BLE Server");
  
  g_ble_p_server = BLEDevice::createServer();
  g_ble_p_server->setCallbacks(new MyBLEServerCallbacks());
  
  BLEDevice::startAdvertising();
}

void loop() {
  if(g_ble_connected) {
    f_ble_timeout();
  }
}

void f_ble_timeout() {
  if(millis() - g_ble_last_callback > c_ble_timeout) {
    g_ble_p_server->disconnect(g_ble_p_server->getConnId());
  }
}
