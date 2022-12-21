class Key:
    def __init__(self, key: int, start: int, duration: int):
        self.key = key
        self.start = start
        self.duration = duration

    def __str__(self):
        return f"{self.key} ({self.start} - {self.duration})"


