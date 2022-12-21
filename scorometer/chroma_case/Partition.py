from .Key import Key

class Partition:

	def __init__(self, name:str, notes:list[Key]) -> None:

		self.__name = name
		self.__notes = notes

	def __repr__(self):
		r = f"{self.__name}\n"
		for i in self.__notes:
			r += f"{i.__repr__()}\n"
		return r

