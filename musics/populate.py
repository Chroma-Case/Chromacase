#!/bin/env python3

import sys
import os
import requests
import glob
from configparser import ConfigParser 

url = os.environ.get("API_URL")

def getOrCreateAlbum(name, artistId):
	res = requests.post(f"{url}/album", json={
		"name": name,
		"artist": artistId,
	})
	out = res.json()
	print(out)
	return out["id"]

def getOrCreateGenre(name):
	res = requests.post(f"{url}/genre", json={
		"name": name,
	})
	out = res.json()
	print(out)
	return out["id"]

def getOrCreateArtist(name):
	res = requests.post(f"{url}/artist", json={
		"name": name,
	})
	out = res.json()
	print(out)
	return out["id"]

def populateFile(path, midi, mxl):
	config = ConfigParser()
	config.read(path)
	metadata = config["Metadata"];
	dificulties = dict(config["Difficulties"])
	artistId = getOrCreateArtist(metadata["Artist"])
	print(f"Populating {metadata['Name']}")
	res = requests.post(f"{url}/song", json={
		"name": metadata["Name"],
		"midiPath": f"/musics/{midi}",
		"musicXmlPath": f"/musics/{mxl}",
		"difficulties": dificulties,
		"artist": artistId,
		"album": getOrCreateAlbum(metadata["Album"], artistId),
		"genre": getOrCreateGenre(metadata["Genre"]),
	})
	print(res.json())


def main():
	global url
	if url == None:
		url = "http://localhost:3000"
	print("Searching for files...")
	for file in glob.glob("**/*.ini", recursive=True):
		print(f"File found: {file}")
		path = os.path.splitext(file)[0]
		populateFile(file, path + ".midi", path + ".mxl")
	
if __name__ == "__main__":
	exit(main())