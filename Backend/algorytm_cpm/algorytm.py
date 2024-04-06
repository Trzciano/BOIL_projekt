from algorytm_funkcje import *

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

calculate_early_start_finish(tasks)
calculate_late_start_finish(tasks)
calculate_reserve(tasks)
find_critical_paths(tasks)

for task in tasks:
    print(task.action,"\t ",task.duration,"\t ",task.early_start, "\t ",task.early_finish,"\t ",task.late_start,"\t ",task.late_finish, "\t ", task.reserve, "\t ", task.is_critical)

#################################  GANTT CHART  ##################################

import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()

for i, task in enumerate(tasks):
    #Harmonogram ASAP
    ax.broken_barh([(task.early_start, task.duration)], (i*10, 9), facecolors='tab:blue')

    #Harmonogram ALAP
    ax.broken_barh([(task.late_start, task.duration)], ((i+0.5)*10, 4), facecolors='tab:orange')

ax.set_yticks([i*10+5 for i in range(len(tasks))])
ax.set_yticklabels([task.action for task in tasks])
ax.invert_yaxis()

ax.set_xlabel('Czas')
ax.set_xticks(np.arange(0, max(task.late_finish for task in tasks)+1, 1))

ax.set_title('GANTT CHART')
ax.legend(['ASAP', 'ALAP'])

plt.savefig('wykres.jpg', format='jpg')
plt.show()
