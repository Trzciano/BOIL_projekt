from algorytm_funkcje import *

tasks = [
    TableCMPRight(action='A', duration=3, sequence='1-2'),
    TableCMPRight(action='B', duration=4, sequence='2-3'),
    TableCMPRight(action='C', duration=6, sequence='2-4'),
    TableCMPRight(action='D', duration=7, sequence='3-5'),
    TableCMPRight(action='E', duration=1, sequence='5-7'),
    TableCMPRight(action='F', duration=7, sequence='4-7'),
    TableCMPRight(action='G', duration=3, sequence='4-6'),
    TableCMPRight(action='H', duration=4, sequence='6-7'),
    TableCMPRight(action='I', duration=1, sequence='7-8'),
    TableCMPRight(action='J', duration=2, sequence='8-9'),
]

tasks = convert_table(tasks)

calculate_early_start_finish(tasks)
calculate_late_start_finish(tasks)
calculate_reserve(tasks)
find_critical_paths(tasks)

for task in tasks:
    print(task.action,"\t ",task.duration,"\t ",task.early_start, "\t ",task.early_finish,"\t ",task.late_start,"\t ",task.late_finish, "\t ", task.reserve, "\t ", task.is_critical)