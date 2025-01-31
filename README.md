# Svelte Bottom Sheet

## Overview

The **BottomSheet** component is a sleek, interactive UI element for mobile-first and desktop applications. It provides a smooth and customizable sliding sheet that can be triggered from the bottom of the screen. Whether you're building a mobile app or a responsive web app, the BottomSheet component offers an intuitive and engaging way to display additional content or options.

### Preview

[Bottom Sheet Preview](https://bottomsheet.auxi.studio/)

## Features

- **Customizable Heights**: Control the maximum height and snap points of the sheet.
- **Event Handling**: Built-in events such as `onopen` and `onclose` to track user interactions.
- **Smooth Animations**: Sleek transitions for opening, closing, and dragging the sheet.
- **Disable Scroll**: Option to prevent scrolling on the background when the sheet is open.
- **Lightweight & Easy to Integrate**: Just add the component and configure the settings.

## Installation

You can use the BottomSheet component in any SvelteKit project.

1. **Install the Component**

   If you're starting from scratch, create a SvelteKit project:

   ```bash
   npx create sv my-app
   cd my-app
   ```

2. **NPM Install the Bottom Sheet**

   ```bash
   npm i svelte-bottom-sheet
   ```

3. **Import the component**

   ```javascript
    <script lang="ts">
   	    import BottomSheet from 'svelte-bottom-sheet';
        let isOpen = $state(false);
    </script>

    <button onclick={() => (isOpen = true)}>Open Bottom Sheet</button>

    <BottomSheet bind:isOpen={isOpen} maxHeight="70%">
        <h3>Content inside the bottom sheet</h3>
        <p>Here you can put any content you need.</p>
    </BottomSheet>
   ```

## Configuration

### Properties

| Property     | Type                  | Default   | Description                                                                          |
| ------------ | --------------------- | --------- | ------------------------------------------------------------------------------------ |
| `isOpen`     | `boolean`             | `false`   | Determines whether the bottom sheet is visible.                                      |
| `maxHeight`  | `string`              | `'70%'`   | Defines the maximum height of the bottom sheet as a percentage of the screen height. |
| `snapPoints` | `number[]`            | `[]`      | An array of percentage values where the bottom sheet should snap to when dragged.    |
| `settings`   | `BottomSheetSettings` | `default` | Settings for the BottomSheet.                                                        |

### Events

| Event       | Description                         |
| ----------- | ----------------------------------- |
| `onopen()`  | Fires when the Bottom Sheet opens.  |
| `onclose()` | Fires when the Bottom Sheet closes. |

### Methods

| Method         | Description                                         |
| -------------- | --------------------------------------------------- |
| `opensheet()`  | Opens the bottom sheet (sets `isOpen` to `true`).   |
| `closesheet()` | Closes the bottom sheet (sets `isOpen` to `false`). |

### Types

| Name                  | Format                                 | Default                             |
| --------------------- | -------------------------------------- | ----------------------------------- |
| `BottomSheetSettings` | `{ disableScrollingOutside: boolean }` | `{ disableScrollingOutside: true }` |

### Settings

| Setting                   | Description                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `disableScrollingOutside` | Prevents the body (everything outside from the Bottom Sheet) from scrolling when the bottom sheet is open. |

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/AUXIDev/svelte-bottom-sheet).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AuxiDev/svelte-bottom-sheet/blob/master/LICENSE.txt) file for more details.
