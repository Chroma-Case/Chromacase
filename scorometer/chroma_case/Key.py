class Key:
	def __init__(self, key: int, start: int, duration: int):
		self.key = key
		self.start = start
		self.duration = duration
		self.done = False
		self.half_done = False

	def __repr__(self):
		return f"{self.key} ({self.start} - {self.duration})"
