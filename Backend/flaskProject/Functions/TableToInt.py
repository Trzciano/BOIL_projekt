def convert_to_int(table):
    return [[int(element) if element else 0 for element in row] for row in table]