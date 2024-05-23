import json


def convert_table_to_json(data):
    dict_list = [row.to_dict() for row in data]
    return json.dumps(dict_list, indent=4)


def convert_broker_data_to_json(transport_matrix, result_transport, result_from_selling, result_from_buying, profit):
    result = {
        "transport_matrix": transport_matrix,
        "result_transport": result_transport,
        "result_from_selling": result_from_selling,
        "result_from_buying": result_from_buying,
        "profit": profit
    }

    return json.dumps(result, indent=4)
