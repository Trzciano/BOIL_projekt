import os

import matplotlib.pyplot as plt
import numpy as np


def generate_gantt_chart_image(tasks):
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

    path_to_folder = os.path.dirname(os.path.abspath(__file__))

    plt.savefig(path_to_folder + '\ImageFolder\wykres.jpg', format='jpg')
