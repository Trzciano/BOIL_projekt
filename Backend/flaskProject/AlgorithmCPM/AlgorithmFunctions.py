from Classes.TableCMPLeft import TableCMPLeft
from Classes.TableCMPRight import TableCMPRight


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

    # Przypisywanie source i target
    for task_l, task_r in zip(tasks_left, tasks_right):
        source_target = task_r.sequence.split('-')
        task_l.source = source_target[0]
        task_l.target = source_target[1]

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
