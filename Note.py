

class Note:
    def __init__(self, key, color, start_time, duration) -> None:

        self.__key = key
        self.__color = color
        self.__start_time = start_time
        self.__duration = duration

    def get_key(self):
        return self.__key

    def get_start_time(self):
        return self.__start_time
    
    def get_duration(self):
        return self.__duration