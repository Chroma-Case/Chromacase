# Install Pillow: pip install Pillow
from PIL import Image, ImageDraw, ImageFont, ImageOps
import sys
import numpy as np

# Command line parameters
song_id = sys.argv[1]  # Get the song ID from the command line
title = sys.argv[2]  # Get the song title from the command line
artist = sys.argv[3]  # Get the artist from the command line
genre = sys.argv[4]  # Get the genre from the command line

# Create a new image with RGB mode
img = Image.new('RGB', (500, 500), color=(73, 109, 137))

# Gradient
top = Image.new('RGB', (500, 500), color=(69, 33, 124))  # changed color
bottom = Image.new('RGB', (500, 500), color=(87, 217, 163))  # changed color

alpha = np.array([np.linspace(0, 255, 500)]*500).astype('uint8')
mask = Image.fromarray(alpha)
img = Image.composite(top, bottom, mask)

# Add pattern on the image
pattern = Image.open('pattern.png').convert('RGB')  # You should have a pattern.png in your directory
img = Image.blend(img, pattern.resize(img.size), alpha=0.5)  # adjust alpha to set the pattern transparency

# Create a draw object
d = ImageDraw.Draw(img)

# Use a truetype font
fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)

# Draw the text in the middle
w, h = d.textsize(f'Song ID: {song_id}', font=fnt)
d.text(((500-w)/2, 150), f'Song ID: {song_id}', font=fnt, fill=(255, 255, 255))

w, h = d.textsize(f'Title: {title}', font=fnt)
d.text(((500-w)/2, 200), f'Title: {title}', font=fnt, fill=(255, 150, 0))

w, h = d.textsize(f'Artist: {artist}', font=fnt)
d.text(((500-w)/2, 250), f'Artist: {artist}', font=fnt, fill=(0, 255, 0))

w, h = d.textsize(f'Genre: {genre}', font=fnt)
d.text(((500-w)/2, 300), f'Genre: {genre}', font=fnt, fill=(150, 0, 255))

# Save the image as a PNG file
img.save(f'./images/{song_id}.png')
