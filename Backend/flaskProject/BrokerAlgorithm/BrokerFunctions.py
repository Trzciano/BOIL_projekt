import numpy as np

from Functions.TableToInt import convert_to_int


def broker_algorithm(data):
    supply, demand, selling_price, buying_price, transport_cost = setup_data(data)

    no_of_suppliers = len(supply)
    no_of_demanders = len(demand)
    profit_matrix = [[0 for _ in range(no_of_demanders)] for _ in range(no_of_suppliers)]

    for i in range(no_of_suppliers):
        for j in range(no_of_demanders):
            profit_matrix[i][j] = buying_price[j] - selling_price[i] - transport_cost[i][j]

    sum1 = np.sum(demand)
    sum2 = np.sum(supply)
    supply.append(sum1)
    demand.append(sum2)
    print(demand)
    print(supply,"\n")

    # Dodanie wiersza wypełnionego zerami na końcu
    profit_matrix.append([0] * len(profit_matrix[0]))

    # Dodanie kolumny wypełnionej zerami
    for row in profit_matrix:
        row.append(0)
    for wiersz in profit_matrix:
        print(wiersz)

    print("\n")

    transport_matrix = optymalny_plan_przewozow(supply, demand, profit_matrix)

    # Wyświetlenie optymalnego planu przewozów
    for row in transport_matrix:
        print(row)

    l = 0
    k = 0 
    result_transport = 0
    result_from_buying = 0
    result_from_selling = 0
    for row in transport_cost:
        l = 0
        for col in row:
            result_transport += col * transport_matrix[k][l]
            result_from_buying += transport_matrix[k][l] * selling_price[k]
            result_from_selling += transport_matrix[k][l] * buying_price[l]
            l+=1
        k+=1
        
    print(f"Koszty transportu: {result_transport}")
    print(f"Koszty zakupu: {result_from_buying}")
    print(f"Przychód: {result_from_selling}")
    profit = result_from_selling - result_from_buying - result_transport
    print(f"Zysk: {profit}")

    return transport_matrix, result_transport, result_from_selling, result_from_buying, profit


def setup_data(data):
    data = convert_to_int(data)

    supply = [row[0] for row in data [1:-1]]
    demand = data[0][1:-1]
    selling_price = [row[-1] for row in data[1:-1]]
    buying_price = data[-1][1:-1]
    transport_cost = [row[1:-1] for row in data[1:-1]]

    return supply, demand, selling_price, buying_price, transport_cost





def znajdz_max_zysk(profit_matrix):
    max_zysk = -float('inf')  # Inicjalizujemy maksymalny zysk na bardzo małą wartość
    indeks_max = None  # Inicjalizujemy indeks maksymalnego zysku na None

    # Przechodzimy przez każdy element macierzy zysków
    for i in range(len(profit_matrix)):
        for j in range(len(profit_matrix[0])):
            if profit_matrix[i][j] > max_zysk:
                max_zysk = profit_matrix[i][j]
                indeks_max = (i, j)  # Zapisujemy indeks maksymalnego zysku

    return max_zysk, indeks_max

def dodaj_transport(transport_matrix, supply, demand, indeks):
    i, j = indeks
    ilosc_transportu = min(supply[i], demand[j])  # Wybieramy mniejszą wartość spośród podaży i popytu
    transport_matrix[i][j] = ilosc_transportu  # Aktualizujemy ilość transportu w macierzy transportu
    supply[i] -= ilosc_transportu  # Aktualizujemy podaż
    demand[j] -= ilosc_transportu  # Aktualizujemy popyt

def optymalny_plan_przewozow(supply, demand, profit_matrix):
    transport_matrix = [[0 for _ in range(len(demand))] for _ in range(len(supply))]  # Tworzymy macierz transportu

    while True:
        max_zysk, indeks_max = znajdz_max_zysk(profit_matrix)  # Znajdujemy maksymalny zysk i jego indeks

        if max_zysk <= 0:  # Jeśli nie ma już dodatnich zysków, przerywamy pętlę
            break

        dodaj_transport(transport_matrix, supply, demand, indeks_max)  # Dodajemy transport

        # Ustawiamy na bardzo małą wartość zysk w miejscu, gdzie już przeprowadziliśmy transport
        i, j = indeks_max
        profit_matrix[i][j] = -float('inf')

    return transport_matrix
