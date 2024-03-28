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
        self.source = 0
        self.target = 0

    def to_dict(self):
        return {
            'source': self.source,
            'target': self.target,
            'action': self.action,
            'duration': self.duration,
            'early_start': self.early_start,
            'early_finish': self.early_finish,
            'late_start': self.late_start,
            'late_finish': self.late_finish,
            'reserve': self.reserve,
            'is_critical': self.is_critical
        }
