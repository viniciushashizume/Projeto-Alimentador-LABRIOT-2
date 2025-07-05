#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ESP8266HTTPClient.h>
#include <time.h>

const char* ssid = "ssid";
const char* password = "password";

const char* mqtt_server = "192.000.000.000";
const char* MQTT_username = "username";
const char* MQTT_password = "password";

const char* serverName = "http://192.000.000.000:5000/data"; // URL do servidor

WiFiClient espClient1;
PubSubClient client(espClient1);
WiFiClient espClient2; // WiFiClient para uso no HTTP

const int trigPin = 12;
const int echoPin = 14;

#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanciaCM;
float lastDistanciaCM = 0; 
long lastMeasure = 0;
long now = millis();

String getTime() {
  time_t now;
  struct tm timeinfo;
  char buffer[30];
  time(&now); 
  localtime_r(&now, &timeinfo); 
  mktime(&timeinfo);
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP1_SENSOR", MQTT_username, MQTT_password)) {
      Serial.println("connected");  
      client.subscribe("room/lamp");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  configTime(-3 * 3600, 0, "pool.ntp.org");
  delay(1500); 
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  now = millis();
  if (now - lastMeasure > 3000) {
    lastMeasure = now;

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH);
    distanciaCM = map((duration * SOUND_VELOCITY / 2), 0, 55, 55, 0);
    distanciaCM = distanciaCM * 1.818181;

    if (distanciaCM < 0) {
      distanciaCM = -1; 
      Serial.println("Distancia: -1");
    } else if (abs(distanciaCM - lastDistanciaCM) >= 3) {
      String payloadDistancia = String(distanciaCM);
      String payloadTimestamp = String(time(NULL)); 

      client.publish("Sala/Sensor_1", payloadDistancia.c_str());
      client.publish("Sala/Sensor_1/Tempo", payloadTimestamp.c_str());

      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Conectado ao WiFi. Tentando enviar dados via HTTP...");

        HTTPClient http;
        http.begin(espClient2, serverName);
        http.addHeader("Content-Type", "application/x-www-form-urlencoded");

        String postData = "distancia=" + payloadDistancia + "&timestamp=" + payloadTimestamp;

        Serial.print("Enviando dados: ");
        Serial.println(postData);

        int httpResponseCode = http.POST(postData);

        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.println("Resposta do servidor: " + response);
        } else {
          Serial.print("Erro na requisição: ");
          Serial.println(httpResponseCode);
        }

        http.end();
      } else {
        Serial.println("Falha na conexão Wi-Fi.");
      }

      Serial.print("Distancia: ");
      Serial.println(distanciaCM);
      lastDistanciaCM = distanciaCM; 
    }

    delay(1000);
    if (isnan(distanciaCM)) {
      Serial.println("Falha na leitura!");
      return;
    }
  }
}
