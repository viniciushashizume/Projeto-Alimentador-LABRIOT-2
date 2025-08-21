from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pandas as pd
import os

app = Flask(__name__)
CORS(app) #comunicacao com a api do ts

@app.route('/data', methods=['POST', 'GET']) 
def handle_data():
    if request.method == 'POST': #POST para o arduino
        distancia = request.form.get('distancia') 
        tempo = request.form.get('timestamp')

        if distancia is None or tempo is None:
            return jsonify({"error": "Missing parameters"}), 400

        try:
            distancia_float = float(distancia)
            tempo_dt = datetime.fromtimestamp(int(tempo))
            
            save_to_csv(distancia_float, tempo_dt)

            return jsonify({"message": "Data received"}), 200
        except ValueError:
            return jsonify({"error": "Invalid data format"}), 400
            
    if request.method == 'GET': #GET para o react
        filename = 'sensor_data.csv'
        if not os.path.isfile(filename):
            return jsonify({"error": "Ainda não há dados disponíveis"}), 404
        
        try:
            df = pd.read_csv(filename)
            if df.empty:
                return jsonify({"error": "Arquivo de dados vazio"}), 404

            last_entry = df.iloc[-1].to_dict()
            return jsonify(last_entry), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


def save_to_csv(distance, tempo):
    filename = 'sensor_data.csv'
    df = pd.DataFrame([{'tempo': tempo.isoformat(), 'distance': distance}])

    if not os.path.isfile(filename):
        df.to_csv(filename, index=False, mode='w', header=True)
    else: 
        df.to_csv(filename, index=False, mode='a', header=False)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)