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
    max_duration = max(task.early_finish for task in tasks)
    for task in tasks:
        if task.early_finish == max_duration or task.late_start == task.early_start:
            task.is_critical = True

calculate_early_start_finish(tasks)
calculate_late_start_finish(tasks)
calculate_reserve(tasks)
find_critical_paths(tasks)

for task in tasks:
    #print(task.early_start)
    #print(task.early_finish)
    #print(task.late_start)
    #print(task.late_finish)
    #print(task.reserve)
    print(task.action,"\t ",task.duration,"\t ",task.early_start, "\t ",task.early_finish,"\t ",task.late_start,"\t ",task.late_finish, "\t ", task.reserve, "\t ", task.is_critical)