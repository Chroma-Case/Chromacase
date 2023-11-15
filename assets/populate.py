#!/usr/bin/env python3

import sys
import os
import requests
import glob
from mido import MidiFile
from configparser import ConfigParser

url = os.environ.get("API_URL")
auth_headers = {}

def getOrCreateAlbum(name, artistId):
	if not name:
		return
	res = requests.post(f"{url}/album", json={
		"name": name,
		"artist": artistId,
	},headers=auth_headers)
	out = res.json()
	print(out)
	return out["id"]

def getOrCreateGenre(names):
	ids = []
	for name in names.split(","):
		res = requests.post(f"{url}/genre", json={
			"name": name,
		},headers=auth_headers)
		out = res.json()
		print(out)
		ids += [out["id"]]
	#TODO handle multiple genres
	return ids[0]

def getOrCreateArtist(name):
	res = requests.post(f"{url}/artist", json={
		"name": name,
	},headers=auth_headers)
	out = res.json()
	print(out)
	return out["id"]

def populateFile(path, midi, mxl):
	config = ConfigParser()
	config.read(path)
	mid = MidiFile(midi)
	metadata = config["Metadata"];
	difficulties = dict(config["Difficulties"])
	difficulties["length"] = round((mid.length), 2)
	artistId = getOrCreateArtist(metadata["Artist"])
	print(f"Populating {metadata['Name']}")
	print(auth_headers)
	res = requests.post(f"{url}/song", json={
		"name": metadata["Name"],
		"midiPath": f"/assets/{midi}",
		"musicXmlPath": f"/assets/{mxl}",
		"difficulties": difficulties,
		"artist": artistId,
		"album": getOrCreateAlbum(metadata["Album"], artistId),
		"genre": getOrCreateGenre(metadata["Genre"]),
		"illustrationPath": f"/assets/{os.path.commonpath([midi, mxl])}/illustration.png"
	}, headers=auth_headers)
	print(res.json())


def main():
	global url
	if url == None:
		url = "http://localhost:3000"
	print("Connecting as guest")
	res = requests.post(f"{url}/auth/guest")
	token = (res.json())["access_token"]
	global auth_headers
	auth_headers["Authorization"] = f"Bearer {token}"
	print("Searching for files...")
	for file in glob.glob("**/*.ini", recursive=True):
		print(f"File found: {file}")
		path = os.path.splitext(file)[0]
		populateFile(file, path + ".midi", path + ".mxl")
	print("Deleting guest")
	requests.delete(f"{url}/auth/me", headers=auth_headers)

if __name__ == "__main__":
	exit(main())
