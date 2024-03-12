from flask import Flask, request, jsonify
from flask_cors import CORS
from Classes.TableCMPLeft import TableCMPLeft
from Classes.TableCMPRight import TableCMPRight
from algorytm_cpm.algorytm import calculate_cpm_left


app = Flask(__name__)
CORT(app, resources={r"/*": {"origins": ""}}, supports_credentials=False)


@app.route('/cpmtable_left', methods=['POST'])
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

            calculate_cpm_left(cpm_data)
            return jsonify({'message': 'Data received successfully'})

    else:
        return jsonify({'error': 'Wrong method'})


@app.route('/cpmtable_right', methods=['POST'])
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

            return jsonify({'message': 'Data received successfully'})

    else:
        return jsonify({'error': 'Wrong method'})
