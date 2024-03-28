import json


def convert_table_to_json(data):
    dict_list = [row.to_dict() for row in data]
    return json.dumps(dict_list, indent=4)
