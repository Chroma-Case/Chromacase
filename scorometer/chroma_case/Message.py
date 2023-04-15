import json
from dataclasses import dataclass
from typing import Literal, Tuple

from validated_dc import ValidatedDC, get_errors, is_valid


@dataclass
class InvalidMessage:
	message: str


@dataclass
class StartMessage(ValidatedDC):
	id: int
	bearer: str
	mode: Literal["normal", "practice"]
	type: Literal["start"] = "start"


@dataclass
class EndMessage(ValidatedDC):
	type: Literal["end"] = "end"


@dataclass
class NoteOnMessage(ValidatedDC):
	time: int
	note: int
	id: int
	type: Literal["note_on"] = "note_on"


@dataclass
class NoteOffMessage(ValidatedDC):
	time: int
	note: int
	id: int
	type: Literal["note_off"] = "note_off"


@dataclass
class PauseMessage(ValidatedDC):
	paused: bool
	time: int
	type: Literal["pause"] = "pause"


message_map = {
	"start": StartMessage,
	"end": EndMessage,
	"note_on": NoteOnMessage,
	"note_off": NoteOffMessage,
	"pause": PauseMessage,
}


def getMessage() -> (
	Tuple[
		StartMessage
		| EndMessage
		| NoteOnMessage
		| NoteOffMessage
		| PauseMessage
		| InvalidMessage,
		str,
	]
):
	try:
		msg = input()
		obj = json.loads(msg)
		res = message_map[obj["type"]](**obj)
		if is_valid(res):
			return res, msg
		else:
			return InvalidMessage(str(get_errors(res))), msg
	except Exception as e:
		return InvalidMessage(str(e)), ""
