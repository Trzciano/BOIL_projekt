import os

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin

from AlgorithmCPM.AlgorithmLeft import calculate_cpm_left
from AlgorithmCPM.AlgorithmRight import calculate_cpm_right
from BrokerAlgorithm.BrokerFunctions import broker_algorithm
from Classes.TableCMPLeft import TableCMPLeft
from Classes.TableCMPRight import TableCMPRight
from Functions.TableToJson import convert_table_to_json, convert_broker_data_to_json


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ""}}, supports_credentials=False)

@app.route('/cpmtable_left', methods=['POST'])
@cross_origin()
def post_cpm_table_left():
    if request.method == 'POST':
        data = request.get_json()

        if 'cpm_table' in data:
            data_list = data['cpm_table']
            cpm_data = []

            for item in data_list:
                action = item.get('action')
                actions_before = item.get('actions_before')
                duration = item.get('duration')

                new_row = TableCMPLeft(action, actions_before, duration)
                cpm_data.append(new_row)
            
            if len(cpm_data) < 2:
                return jsonify({'error': 'Not enough data'})

            result = calculate_cpm_left(cpm_data)
            return convert_table_to_json(result)

    else:
        return jsonify({'error': 'Wrong method'})


@app.route('/cpmtable_right', methods=['POST'])
@cross_origin()
def post_cpm_table_right():
    if request.method == 'POST':
        data = request.get_json()

        if 'cpm_table' in data:
            data_list = data['cpm_table']
            cpm_data = []

            for item in data_list:
                action = item.get('action')
                duration = item.get('duration')
                sequence = item.get('sequence')

                new_row = TableCMPRight(action, duration, sequence)
                cpm_data.append(new_row)

            if len(cpm_data) < 2:
                return jsonify({'error': 'Not enough data'})

            result = calculate_cpm_right(cpm_data)

            return convert_table_to_json(result)

    else:
        return jsonify({'error': 'Wrong method'})

    
@app.route('/gantt_chart', methods=['GET'])
@cross_origin()
def send_gant_chart():
    image_path = "AlgorithmCPM/ImageFolder/wykres.jpg"

    if os.path.exists(image_path):
        return send_file(image_path)
    else:
        return jsonify({'error': 'The file is not yet generated'})


@app.route('/broker_algorithm', methods=['POST'])
@cross_origin()
def post_broker_algorithm():
    if request.method == 'POST':
        data = request.get_json()
        
        transport_matrix, result_transport, result_from_selling, result_from_buying, profit = broker_algorithm(data)
        response = convert_broker_data_to_json(transport_matrix, 
                                               result_transport, result_from_selling, result_from_buying, profit)
        
        return response
