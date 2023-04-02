class Note:
	def __init__(self, start_time, data) -> None:

		self.__start_time = start_time
		self.__data = data

	def get_start_time(self):
		return self.__start_time

	def get_data(self):
		return self.__data
