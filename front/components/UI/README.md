## IconButton

The `IconButton`  is a responsive component displaying an interactive icon. It can toggle between active and inactive states, with customizable animations and styles for each state.

### Features:

- Toggle between active and inactive icons.
- Scale animation on press.
- Full customization of icon colors, sizes, and variants.
- Customizable styles for both the icon and its container.

### Preview

```jsx
<IconButton 
    color="#000"
    icon={SomeIcon}
    onPress={() => console.log('Icon pressed!')}
/>
```

With active states:
```jsx
<IconButton 
    isActive={true}
    color="#000"
    colorActive="#ff0000"
    icon={SomeIcon}
    iconActive={SomeActiveIcon}
    onPress={() => console.log('Icon toggled!')}
/>
```

### Props

| Prop              | Type         | Description                                        | Default Value  |
|-------------------|--------------|----------------------------------------------------|----------------|
| isActive          | boolean      | Indicates if the button starts in an active state. | false          |
| color             | string       | Color of the icon.                                 | -              |
| colorActive       | string       | Optional active state color for the icon.          | Value of color |
| icon              | Component    | Icon to display.                                   | -              |
| iconActive        | Component    | Optional icon to display when active.              | -              |
| variant           | string       | Icon's variant style.                              | "Outline"      |
| activeVariant     | string       | Icon's variant style when active.                  | "Outline"      |
| size              | number       | Size of the icon.                                  | 24             |
| scaleFactor       | number       | Scale factor for animation.                        | 1.25           |
| animationDuration | number       | Animation duration in milliseconds.                | 250            |
| padding           | number       | Padding around the icon.                           | 0              |
| onPress           | function     | Callback triggered on button press.                | -              |
| style             | object/style | Custom style for the icon.                         | -              |
| containerStyle    | object/style | Custom style for the icon's container.             | -              |


## MusicItem

The MusicItem is a responsive component designed to display individual music tracks with key details and interactive buttons, adapting its layout and design across various screen sizes.

### Features:

- Displays artist name, song title, and track cover image.
- Provides interactivity through a play button and a like button.
- Indicates song difficulty level, last score, and best score with automatic number formatting based on user's language preference.
- Optimized for performance, ensuring smooth rendering even in extensive lists.

### Preview

```jsx
<MusicItem 
    artist="John Doe"
    song="A Beautiful Song"
    image="https://example.com/image.jpg"
    level={5}
    lastScore={3200}
    bestScore={5000}
    liked={true}
    onLike={() => console.log('Music liked!')}
    onPlay={() => console.log('Play music!')}
/>
```

### Props

| Prop      | Type     | Description                                           | Default Value |
|-----------|----------|-------------------------------------------------------|---------------|
| artist    | string   | Artist's name.                                        | -             |
| song      | string   | Song's title.                                         | -             |
| image     | string   | URL for the song's cover image.                       | -             |
| level     | number   | Level of the song difficulty.                         | -             |
| lastScore | number   | Last score achieved for this song.                    | -             |
| bestScore | number   | Highest score achieved for this song.                 | -             |
| liked     | boolean  | Whether the song is liked/favorited by the user.      | false         |
| onLike    | function | Callback triggered when the like button is pressed.   | -             |
| onPlay    | function | Callback triggered when the song is played. Optional. | -             |
