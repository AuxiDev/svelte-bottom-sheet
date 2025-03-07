# Svelte Bottom Sheet

## Overview

The **BottomSheet** component is a sleek, interactive UI element for mobile-first and desktop applications. It provides a smooth and customizable sliding sheet that can be triggered from the bottom of the screen. Whether you're building a mobile app or a responsive web app, the BottomSheet component offers an intuitive and engaging way to display additional content or options.

### Preview

[Bottom Sheet Preview](https://bottomsheet.auxi.studio/)

## Features

- **Customizable**: Control the style, maximum height and snap points of the sheet.
- **Snap Points**: Option to let the Bottom Sheet snap to specific positions.
- **Smooth Animations**: Sleek transitions for opening, closing, and dragging the sheet.
- **Lightweight & Easy to Integrate**: Just add the component and configure the settings.
- **Event Handling**: Built-in events such as `onopen` and `onclose` to track user interactions.

## Installation

You can use the BottomSheet component in any SvelteKit project.

1. **Install the Component**

   If you're starting from scratch, create a SvelteKit project:

   ```bash
   npx sv create my-app
   cd my-app
   ```

2. **NPM Install the Bottom Sheet**

   ```bash
   npm i svelte-bottom-sheet
   ```

3. **Import the component and use it**

   ```javascript
    <script lang="ts">
   	  import BottomSheet from 'svelte-bottom-sheet';
    </script>

    <BottomSheet settings={{maxHeight: 0.7}}>
      <BottomSheet.Trigger>
         <p>Open the sheet</p>
      </BottomSheet.Trigger>
      <BottomSheet.Overlay>
         <BottomSheet.Sheet>
            <BottomSheet.Handle />
            <BottomSheet.Content>
               <h3>Content inside the bottom sheet</h3>
               <p>Here you can put any content you need.</p>
            </BottomSheet.Content>
         </BottomSheet.Sheet>
      </BottomSheet.Overlay>

    </BottomSheet>
   ```

## Components

### BottomSheet

#### Description

This is the root component of every Bottom Sheet. It allows you to add your own configuration, attach functions which are called when a specific event is fired and add all other components which need to be used for the Bottom Sheet.

#### Properties

| Property   | Type                                 | Default   | Description                                                            |
| ---------- | ------------------------------------ | --------- | ---------------------------------------------------------------------- |
| `isOpen`   | `boolean`                            | `false`   | Determines whether the bottom sheet is visible. BINDABLE (bind:isOpen) |
| `settings` | [BottomSheetSettings](#settingstype) | `default` | Settings for the BottomSheet.                                          |

#### Events

| Event              | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `onopen`           | Fires when the Bottom Sheet opens.                        |
| `onclose`          | Fires when the Bottom Sheet closes.                       |
| `onsheetdrag`      | Fires while the Bottom Sheet is being dragged.            |
| `onsheetdragstart` | Fires when the Bottom Sheet starts being dragged.         |
| `onsheetdragend`   | Fires when the Bottom Sheet ends being dragged.           |
| `onsnap`           | Fires when a snapable Bottom Sheet snaps to a snap point. |

### BottomSheet.Trigger (Required)

#### Description

This component creates a trigger area around its children which when clicked will open or close the Bottom Sheet.

#### Properties

| Property  | Type                             | Default   | Description                           |
| --------- | -------------------------------- | --------- | ------------------------------------- |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | `default` | Default HTMLElement property options. |

### BottomSheet.Overlay (Required)

#### Description

An overlay which covers the screen while the Bottom Sheet is opened.

#### Properties

| Property  | Type                             | Default   | Description                              |
| --------- | -------------------------------- | --------- | ---------------------------------------- |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | `default` | Default HTMLDivElement property options. |

### BottomSheet.Sheet (Required)

#### Description

This is the functional Bottom Sheet component, which will be shown / hidden when the Bottom Sheet opens / closes. This applies to all children.

#### Properties

| Property  | Type                             | Default   | Description                              |
| --------- | -------------------------------- | --------- | ---------------------------------------- |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | `default` | Default HTMLDivElement property options. |

### BottomSheet.Handle (Optional)

#### Description

The handle is more than just a visual element—it provides functional support for user interactions. When dragging the handle, users can always pull down the Bottom Sheet, even if it’s not fully scrolled to the top.

Additionally, it is fully customizable and includes accessibility features, such as opening, closing, and snapping to snap points using arrow keys.

#### Properties

| Property  | Type                             | Default   | Description                              |
| --------- | -------------------------------- | --------- | ---------------------------------------- |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | `default` | Default HTMLDivElement property options. |

#### Keyboard Controls (when focused)

| Key                | Action                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Arrow Up (↑)**   | Moves the Bottom Sheet to the next snap point (if applicable).                            |
| **Arrow Down (↓)** | Moves the Bottom Sheet to the previous snap point or closes it if at the lowest position. |
| **Home**           | Moves the Bottom Sheet to the highest snappoint when snappoints are set.                  |
| **End**            | Moves the Bottom Sheet to the lowest snappoint when snappoints are set.                   |
| **Escape (Esc)**   | Closes the Bottom Sheet.                                                                  |

### BottomSheet.Content (Required)

#### Description

This is the component where your Bottom Sheet content goes into. This component also makes scrolling in the Bottom Sheet possible.

#### Properties

| Property  | Type                             | Default   | Description                              |
| --------- | -------------------------------- | --------- | ---------------------------------------- |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | `default` | Default HTMLDivElement property options. |

## <a name="settingstype"></a>**BottomSheetSettings Type**

### **Properties**

| Name                 | Type                                  | Description                                                                                                                                                   | Default Value |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `maxHeight`          | `number`                              | Sets the maximum height of the Bottom Sheet. Values between `0` and `1` are treated as percentages (e.g., `0.7` = `70%`). Anything `≥1` is treated as pixels. | `0.7`         |
| `snapPoints`         | `number[]`                            | An array of snap points for the Bottom Sheet. Values follow the same percentage and pixel rules. (`[0.25, 0.5, 0.75]` = `[25%, 50%, 75%]`)                    | `[1]`         |
| `closeThreshold`     | `number`                              | The percentage of the Bottom Sheet's height that the user must drag for it to close.                                                                          | `0.1`         |
| `autoCloseThreshold` | `number`                              | The percentage of the Bottom Sheet's height that the user must drag for it to auto-close. Use `0` to disable.                                                 | `0`           |
| `startingSnappoint`  | `number`                              | The snappoint the Bottom Sheet will start at when opened.                                                                                                     | `1`           |
| `disableDragging`    | `boolean`                             | Disable dragging of the sheet.                                                                                                                                | `false`       |
| `position`           | `"top"` `"bottom"` `"left"` `"right"` | Set the position where the sheet is positioned and moved to.                                                                                                  | `bottom`      |

### Notes

- Any value between `0` and `1` will be interpreted as a percentage (e.g., `0.7` = `70%`).
- Any value **≥1** will be interpreted as pixels (e.g., `300` = `300px`).

## **Controlling the Bottom Sheet Programmatically**

In addition to using the `Trigger` component, you can directly control the Bottom Sheet’s visibility and behavior through bindings and function calls.

### **Binding the `isOpen` Property**

The `isOpen` property can be bound to a variable, allowing you to open or close the Bottom Sheet programmatically.

#### Example Usage

```svelte
<script lang="ts">
	let isSheetOpen = $state(false);
</script>

<BottomSheet bind:isSheetOpen />
```

Now, setting isSheetOpen = true will open the Bottom Sheet, and setting it to false will close it.

### **Assigning the Bottom Sheet to a Variable**

You can also assign the Bottom Sheet to a variable using the bind:this directive. This allows you to call methods on the component instance.

### **Snapping to a Specific Snap Point**

If your Bottom Sheet has defined snapPoints, you can programmatically move it to a specific snap position using the setSnapPoint method.

#### **Method: `setSnapPoint(point: number, throwEvent: boolean = true): boolean`**

#### Parameters

| Parameter    | Type      | Default | Description                                  |
| ------------ | --------- | ------- | -------------------------------------------- |
| `point`      | `number`  | -       | The snap point to move the Bottom Sheet to.  |
| `throwEvent` | `boolean` | `true`  | Whether an `onsnap` event should be emitted. |

#### Returns

| Type      | Description                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `boolean` | `true` if snapping was successful, `false` if the provided snappoint does not exist. |

#### **Example Usage**

```svelte
<script lang="ts">
	let sheet;

	function snapToMiddle() {
		sheet?.setSnapPoint(0.5);
	}
</script>

<BottomSheet bind:this={sheet} settings={{ snapPoints: [0.25, 0.5, 0.75] }}>
	<button onclick={snapToMiddle}>Snap to 50%</button>
</BottomSheet>
```

## Bottom Sheet Positions

It is possible to not only positionthe Bottom Sheet on the `bottom`, you can also position it `left`, `right` and on the `top` of the screen. Take a look on the [Bottom Sheet Settings](#settingstype) to see how you can change the positions.

### **Note**

Before version 2.0, the sheet only supported the `bottom` position, and positioning was not configurable. The width of the sheet was configured using the `max-width` style.

With version 2.0 introducing position options, switching to `left` or `right` while using `max-width` for controlling the sheets horizontal width, will cause issues, because the positioning direction would be horizontal.

Please use the `height` and `maxHeight` style to control the sheets "width", in this case the "height".

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/AUXIDev/svelte-bottom-sheet).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AuxiDev/svelte-bottom-sheet/blob/master/LICENSE.txt) file for more details.
