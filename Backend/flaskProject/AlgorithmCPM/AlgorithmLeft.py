from AlgorithmCPM.AlgorithmFunctions import *
from AlgorithmCPM.GanttChart import generate_gantt_chart_image


def calculate_cpm_left(tasks):
    calculate_early_start_finish(tasks)
    calculate_late_start_finish(tasks)
    calculate_reserve(tasks)
    find_critical_paths(tasks)

    generate_gantt_chart_image(tasks)

    return tasks
