from Classes.TableCMPLeft import TableCMPLeft


tasks = [
    TableCMPLeft(action='A', actions_before='', duration=5),
    TableCMPLeft(action='B', actions_before='', duration=7),
    TableCMPLeft(action='C', actions_before='A', duration=6),
    TableCMPLeft(action='D', actions_before='A', duration=8),
    TableCMPLeft(action='E', actions_before='B', duration=3),
    TableCMPLeft(action='F', actions_before='C', duration=4),
    TableCMPLeft(action='G', actions_before='C', duration=2),
    TableCMPLeft(action='H', actions_before='EDF', duration=5),
]

def calculate_cpm_left(tasks):
    pass # TODO

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

calculate_early_start_finish(tasks)

for task in tasks:
    #print(task.early_start)
    print(task.early_finish)