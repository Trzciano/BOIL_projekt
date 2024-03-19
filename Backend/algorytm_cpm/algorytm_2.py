class TableCMPRight:
    def __init__(self, action, duration, sequence):
        self.action = action
        self.duration = duration
        self.sequence = sequence
        self.is_critical = False

tasks = [
    TableCMPRight(action='A', duration=3, sequence='1-2'),
    TableCMPRight(action='B', duration=4, sequence='2-3'),
    TableCMPRight(action='C', duration=6, sequence='2-4'),
    TableCMPRight(action='D', duration=7, sequence='3-5'),
    TableCMPRight(action='E', duration=1, sequence='5-7'),
    TableCMPRight(action='F', duration=2, sequence='4-7'),
    TableCMPRight(action='G', duration=3, sequence='4-6'),
    TableCMPRight(action='H', duration=4, sequence='6-7'),
    TableCMPRight(action='I', duration=1, sequence='7-8'),
    TableCMPRight(action='J', duration=2, sequence='8-9'),
]

class OutputGraph:
    def __init__(self, id, t0, t1, l, is_critical=False):
        self.id = id
        self.t0 = t0
        self.t1 = t1
        self.l = l
        self.is_critical = is_critical

def calculate_start_time(tasks):
    events = {}

    # Przypisanie zdarzeniom id i czasu początkowego na podstawie akcji
    for task in tasks:
        id_1, id_2 = map(int, task.sequence.split('-'))
        if id_1 not in events:
            events[id_1] = OutputGraph(id=id_1, t0=0, t1=0, l=0)
        if id_2 not in events:
            events[id_2] = OutputGraph(id=id_2, t0=0, t1=0, l=0)

    # Obliczenie czasu początkowego dla każdego zdarzenia (t0)
    for task in tasks:
        id_1, id_2 = map(int, task.sequence.split('-'))
        start_time = events[id_1].t0 + task.duration
        events[id_2].t0 = max(events[id_2].t0, start_time)

    # Przypisanie czasu t0 jako czasu t1 dla ostatniego zdarzenia
    last_event_id = max(events.keys())
    events[last_event_id].t1 = events[last_event_id].t0

    # Obliczenie czasu końcowego dla każdego zdarzenia (t1)
    for task in reversed(tasks):
        id_1, id_2 = map(int, task.sequence.split('-'))
        end_time = events[id_2].t1 - task.duration
        if events[id_1].t1 == 0:  # Jeśli czas t1 nie był jeszcze ustawiony
            events[id_1].t1 = end_time
        else:
            events[id_1].t1 = min(events[id_1].t1, end_time)

    # Obliczanie wartości l (różnica t1 - t0) dla każdego zdarzenia
    for event_id, event in events.items():
        event.l = event.t1 - event.t0

    # Posortuj events po event_id
    events = dict(sorted(events.items()))

    return events

# Wywołanie funkcji i wydrukowanie wyników
events = calculate_start_time(tasks)
for event_id, event in events.items():
    print(f"Id: {event_id}, t0: {event.t0}, t1: {event.t1}, l: {event.l}")
