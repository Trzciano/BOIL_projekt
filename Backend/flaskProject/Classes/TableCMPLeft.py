class TableCMPLeft:
    def __init__(self, action, actions_before, duration):
        self.action = action
        self.actions_before = actions_before
        self.duration = duration
        self.early_start = 0
        self.early_finish = 0
        self.late_start = 0
        self.late_finish = 0
        self.total_float = 0
        self.is_critical = False
