from flask import Flask, request, jsonify
from Classes.TableCMPLeft import TableCMPLeft
from Classes.TableCMPRight import TableCMPRight

app = Flask(__name__)

@app.route('/cpmtable_left', methods=['POST'])
def post_cpm_table():
    if request.method == 'POST':
        data = request.get_json()

        if 'cpm_table' in data:
            data_list = data['cpm_table']
            cpm_data = []

            for item in data_list:
                action = item.get('action')
                action_before = item.get('item_before')
                duration = item.get('duration')

                new_row = TableCMPLeft(action, action_before, duration)
                cpm_data.append(new_row)

            return jsonify({'message': 'Data received successfully'})

    else:
        return jsonify({'error': 'Wrong method'})
