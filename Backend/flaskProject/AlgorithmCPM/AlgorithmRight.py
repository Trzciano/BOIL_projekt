from AlgorithmCPM.AlgorithmFunctions import *


def calculate_cpm_right(tasks):
    tasks = convert_table(tasks)

    calculate_early_start_finish(tasks)
    calculate_late_start_finish(tasks)
    calculate_reserve(tasks)
    find_critical_paths(tasks)

    return tasks
    