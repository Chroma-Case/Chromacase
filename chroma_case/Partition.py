import asyncio, datetime
from typing import Callable

from .Note import Note

async def wait_until(dt):
    # sleep until the specified datetime
    now = datetime.datetime.now()
    await asyncio.sleep((dt - now).total_seconds())

async def run_at(dt, coro):
    await wait_until(dt)
    return await coro

class Partition:
    
    def __init__(self, name:str, notes:list[Note]) -> None:

        self.__name = name
        self.__notes = notes

    
    def play(self, output_lambda:Callable[[str, tuple[int, int, int], int], None]):
        now = datetime.datetime.now()
        tasks_to_wait = []
        for note in self.__notes:
            tasks_to_wait.append(
                asyncio.create_task(
                    lambda: asyncio.wait(
                            run_at(
                            now + datetime.timedelta(milliseconds= note.get_start_time()),
                            output_lambda(
                                note.get_key(),
                                note.get_color(),
                                note.get_duration()
                            )
                        )
                    )
                )
            )
        asyncio.wait(tasks_to_wait)
