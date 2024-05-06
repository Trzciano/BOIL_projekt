import numpy as np

dostawcy_podaz = [20,30]
dostawcy_zakup = [10,12]
odbiorcy_popyt = [10,28,27]
odbiorcy_cena_sprzedazy = [30,25,30]

koszty_trans = [[8,14,17],
                [12,9,19]]

ilosc_dostawcow = len(dostawcy_podaz)
ilosc_odbiorcow = len(odbiorcy_popyt)
macierz_zyskow = [[0 for _ in range(ilosc_odbiorcow)] for _ in range(ilosc_dostawcow)]

for i in range(ilosc_dostawcow):
    for j in range(ilosc_odbiorcow):
        macierz_zyskow[i][j] = odbiorcy_cena_sprzedazy[j] - dostawcy_zakup[i] - koszty_trans[i][j]

sum1 = np.sum(odbiorcy_popyt)
sum2 = np.sum(dostawcy_podaz)
dostawcy_podaz.append(sum1)
odbiorcy_popyt.append(sum2)
print(odbiorcy_popyt)
print(dostawcy_podaz,"\n")

# Dodanie wiersza wypełnionego zerami na końcu
macierz_zyskow.append([0] * len(macierz_zyskow[0]))

# Dodanie kolumny wypełnionej zerami
for row in macierz_zyskow:
    row.append(0)
for wiersz in macierz_zyskow:
    print(wiersz)

print("\n")

def znajdz_max_zysk(macierz_zyskow):
    max_zysk = -float('inf')  # Inicjalizujemy maksymalny zysk na bardzo małą wartość
    indeks_max = None  # Inicjalizujemy indeks maksymalnego zysku na None

    # Przechodzimy przez każdy element macierzy zysków
    for i in range(len(macierz_zyskow)):
        for j in range(len(macierz_zyskow[0])):
            if macierz_zyskow[i][j] > max_zysk:
                max_zysk = macierz_zyskow[i][j]
                indeks_max = (i, j)  # Zapisujemy indeks maksymalnego zysku

    return max_zysk, indeks_max

def dodaj_transport(transport_matrix, dostawcy_podaz, odbiorcy_popyt, indeks):
    i, j = indeks
    ilosc_transportu = min(dostawcy_podaz[i], odbiorcy_popyt[j])  # Wybieramy mniejszą wartość spośród podaży i popytu
    transport_matrix[i][j] = ilosc_transportu  # Aktualizujemy ilość transportu w macierzy transportu
    dostawcy_podaz[i] -= ilosc_transportu  # Aktualizujemy podaż
    odbiorcy_popyt[j] -= ilosc_transportu  # Aktualizujemy popyt

def optymalny_plan_przewozow(dostawcy_podaz, odbiorcy_popyt, macierz_zyskow):
    transport_matrix = [[0 for _ in range(len(odbiorcy_popyt))] for _ in range(len(dostawcy_podaz))]  # Tworzymy macierz transportu

    while True:
        max_zysk, indeks_max = znajdz_max_zysk(macierz_zyskow)  # Znajdujemy maksymalny zysk i jego indeks

        if max_zysk <= 0:  # Jeśli nie ma już dodatnich zysków, przerywamy pętlę
            break

        dodaj_transport(transport_matrix, dostawcy_podaz, odbiorcy_popyt, indeks_max)  # Dodajemy transport

        # Ustawiamy na bardzo małą wartość zysk w miejscu, gdzie już przeprowadziliśmy transport
        i, j = indeks_max
        macierz_zyskow[i][j] = -float('inf')

    return transport_matrix

transport_matrix = optymalny_plan_przewozow(dostawcy_podaz, odbiorcy_popyt, macierz_zyskow)

# Wyświetlenie optymalnego planu przewozów
for row in transport_matrix:
    print(row)

l = 0
k = 0 
result_transport = 0
result_cena_zakupu = 0
result_cena_sprzedazy = 0
for row in koszty_trans:
    l = 0
    for col in row:
        result_transport += col * transport_matrix[k][l]
        result_cena_zakupu += transport_matrix[k][l] * dostawcy_zakup[k]
        result_cena_sprzedazy += transport_matrix[k][l] * odbiorcy_cena_sprzedazy[l]
        l+=1
    k+=1
    
print(result_transport)
print(result_cena_zakupu)
print(result_cena_sprzedazy)
print(f"Zysk: {result_cena_sprzedazy - result_cena_zakupu - result_transport}")
