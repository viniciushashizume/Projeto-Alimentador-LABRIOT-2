# Project: IoT Pet Feeder

This repository contains the files for an IoT-based project to monitor the food level in a pet feeder. It uses an ESP8266 microcontroller with an ultrasonic sensor to measure the distance to the food, sends this data to a web server and an MQTT broker, and provides tools for data storage, analysis, and visualization.

## How it Works

The system consists of three main components:

1.  **ESP8266 Microcontroller (`alimentador.ino`)**:

      * An ESP8266 board equipped with an ultrasonic sensor measures the distance to the food level inside the feeder.
      * It connects to a local WiFi network to gain internet access.
      * The collected data (distance and a timestamp) is sent via two methods:
          * An **HTTP POST request** to a Flask web server.
          * Published to **MQTT topics** (`Sala/Sensor_1` and `Sala/Sensor_1/Tempo`) for real-time monitoring.

2.  **Flask Web Server (`receberDadosAlimentador.py`)**:

      * A simple Python server built with Flask.
      * It listens for incoming POST requests on the `/data` endpoint.
      * Upon receiving data, it saves the distance and timestamp into a `sensor_data.csv` file for logging and later analysis.

3.  **Data Analysis and Visualization**:

      * **Analysis Script (`torchAlimentador.py`)**: A Python script that uses `pandas` and `matplotlib` to read the `sensor_data.csv` file and generate a bar chart showing the number of sensor readings over time. This helps visualize feeding patterns.
      * **Web Interface (`interface/`)**: A basic HTML page that embeds a Node-RED dashboard using an `<iframe>`. This dashboard can be configured to subscribe to the MQTT topics and display the food level in real-time.

## How to Use

Follow these steps to set up and run the project.

### Prerequisites

  * Hardware:
      * ESP8266 board
      * HC-SR04 Ultrasonic Sensor
  * Software:
      * Arduino IDE with ESP8266 board support
      * Python 3.x
      * Node-RED (Optional, for dashboard)

### Step-by-Step Guide

#### 1\. Hardware Setup

Connect the ultrasonic sensor to the ESP8266 board as follows:

  * **VCC** -\> **3.3V**
  * **GND** -\> **GND**
  * **Trig Pin** -\> **GPIO 12 (D6)**
  * **Echo Pin** -\> **GPIO 14 (D5)**

#### 2\. Configure and Upload the ESP8266 Sketch

1.  Open `alimentador.ino` in the Arduino IDE.
2.  Install the required libraries from the Library Manager: `PubSubClient` by Nick O'Leary. The `ESP8266WiFi` and `ESP8266HTTPClient` libraries are included with the ESP8266 board package.
3.  Update the following variables in the code with your credentials:
      * `ssid` and `password`: Your WiFi network credentials.
      * `mqtt_server`: The IP address of your MQTT broker.
      * `MQTT_username` and `MQTT_password`: Your MQTT broker credentials.
      * `serverName`: The URL of the Flask server. Replace `"http://192.000.000.000:5000/data"` with the IP address of the computer that will run the `receberDadosAlimentador.py` script.
4.  Upload the sketch to your ESP8266 board. You can monitor the serial output (Baud Rate: 9600) to check for connection status and sensor readings.

#### 3\. Run the Flask Server

1.  Open a terminal or command prompt on your computer.
2.  Navigate to the `alimentador` directory.
3.  Install the required Python libraries:
    ```bash
    pip install Flask pandas
    ```
4.  Run the server:
    ```bash
    python receberDadosAlimentador.py
    ```
5.  The server will start, and a file named `sensor_data.csv` will be created in the same directory as soon as the first data from the ESP8266 is received.

#### 4\. Analyze the Data

1.  After the system has been running for a while and has collected data in `sensor_data.csv`, you can visualize it.
2.  Install the additional libraries for the analysis script:
    ```bash
    pip install torch matplotlib seaborn
    ```
3.  Run the analysis script:
    ```bash
    python torchAlimentador.py
    ```
4.  This will generate and display a chart of the feeding activity and save it as `leituras_por_data_horario.png`.

#### 5\. (Optional) View the Real-time Dashboard

1.  Set up a Node-RED instance.
2.  Create a flow that subscribes to the MQTT topics: `Sala/Sensor_1` (for distance) and `Sala/Sensor_1/Tempo` (for timestamp).
3.  Design a dashboard (using `node-red-dashboard` nodes) to display the data, for example, using a gauge or a chart.
4.  Open the `interface/index.html` file in a web browser.
      * **Note**: You may need to update the `src` attribute of the `<iframe>` in `index.html` to point to your specific Node-RED dashboard URL.

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=viniciushashizume/projeto-alimentador-labriot-2/Projeto-Alimentador-LABRIOT-2-d836a768ac40730b12546eb14fce062f8b9685d5/LICENSE) file for details.
