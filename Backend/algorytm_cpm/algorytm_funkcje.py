class TableCMPLeft:
    def __init__(self, action, actions_before, duration):
        self.action = action
        self.actions_before = actions_before
        self.duration = duration
        self.early_start = 0
        self.early_finish = 0
        self.late_start = 0
        self.late_finish = 0
        self.is_critical = False
        self.reserve = 0

class TableCMPRight:
    def __init__(self, action, duration, sequence):
        self.action = action
        self.duration = duration
        self.sequence = sequence
        self.is_critical = False

def convert_table(tasks_right):
    # Tworzymy słownik, który przechowuje dla każdej akcji listę akcji, które muszą być wykonane wcześniej
    actions_before = {task.action: [] for task in tasks_right}
    for task in tasks_right:
        _, sequence_end = task.sequence.split('-')
        for t in tasks_right:
            if t.sequence.startswith(sequence_end):
                actions_before[t.action].append(task.action)

    # Tworzymy nową listę zadań w formacie TableCMPLeft
    tasks_left = [TableCMPLeft(action=task.action, actions_before=''.join(actions_before[task.action]), duration=task.duration) for task in tasks_right]

    return tasks_left

def calculate_early_start_finish(tasks):
    for task in tasks:
        if not task.actions_before:
            task.early_start = 0
            task.early_finish = task.duration
        else:
            max_early_finish = 0
            for action in task.actions_before:
                for t in tasks:
                    if t.action == action and t.early_finish > max_early_finish:
                        max_early_finish = t.early_finish
            task.early_start = max_early_finish
            task.early_finish = task.early_start + task.duration

def calculate_late_start_finish(tasks):
    tasks[-1].late_finish = tasks[-1].early_finish
    tasks[-1].late_start = tasks[-1].late_finish - tasks[-1].duration

    for task in reversed(tasks[:-1]):
        min_late_start = min([t.late_start for t in tasks if task.action in t.actions_before], default=tasks[-1].late_finish)
        task.late_finish = min_late_start
        task.late_start = task.late_finish - task.duration
    
def calculate_reserve(tasks):
    for task in tasks:
        task.reserve = task.late_start - task.early_start
    
# def find_critical_paths(tasks):
#     # Znajdź zadania, które mają rezerwę równą 0
#     critical_tasks = [task for task in tasks if task.reserve == 0]

#     # Znajdź najdłuższą ścieżkę krytyczną
#     critical_path = []
#     max_duration = 0
#     for task in critical_tasks:
#         path = [task]
#         duration = task.duration
#         while True:
#             # Znajdź następne zadanie, które zależy od ostatniego zadania na ścieżce
#             next_tasks = [t for t in critical_tasks if path[-1].action in t.actions_before]
#             if not next_tasks:
#                 break
#             # Wybierz zadanie z największym czasem trwania
#             next_task = max(next_tasks, key=lambda t: t.duration)
#             path.append(next_task)
#             duration += next_task.duration
#         # Jeśli ścieżka jest dłuższa niż obecna ścieżka krytyczna, zaktualizuj ścieżkę krytyczną
#         if duration > max_duration:
#             critical_path = path
#             max_duration = duration

#     # Oznacz zadania na ścieżce krytycznej
#     for task in critical_path:
#         task.is_critical = True
        
def find_critical_paths(tasks):
    # Znajdź zadania, które mają rezerwę równą 0
    critical_tasks = [task for task in tasks if task.reserve == 0]

    # Znajdź wszystkie ścieżki krytyczne
    critical_paths = []
    for task in critical_tasks:
        find_paths(task, [task], critical_paths, critical_tasks)

    # Oznacz zadania na ścieżkach krytycznych
    for path in critical_paths:
        for task in path:
            task.is_critical = True

    return critical_paths

def find_paths(task, path, critical_paths, critical_tasks):
    next_tasks = [t for t in critical_tasks if task.action in t.actions_before]
    if not next_tasks:
        critical_paths.append(path)
    else:
        for next_task in next_tasks:
            find_paths(next_task, path + [next_task], critical_paths, critical_tasks)
