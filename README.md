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

3. **Import the component**

   ```javascript
    <script lang="ts">
   	 import BottomSheet from 'svelte-bottom-sheet';
        let isOpen = $state(false);
    </script>

    <button onclick={() => (isOpen = true)}>Open Bottom Sheet</button>

    <BottomSheet bind:isOpen={isOpen} settings={{maxHeight: '70%'}}>
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

## Configuration

### Properties

| Property   | Type                  | Default   | Description                                                            |
| ---------- | --------------------- | --------- | ---------------------------------------------------------------------- |
| `isOpen`   | `boolean`             | `false`   | Determines whether the bottom sheet is visible. BINDABLE (bind:isOpen) |
| `settings` | `BottomSheetSettings` | `default` | Settings for the BottomSheet.                                          |

### BottomSheetSettings Type

#### Properties

| Name              | Type       | Description                                                                                                                                                                   | Default Value |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `maxHeight`       | `string`   | Sets the maximum height of the Bottom Sheet. The value should be in percentage (`90%`).                                                                                       | `70%`         |
| `snapPoints`      | `number[]` | An array of snap points for the Bottom Sheet. Each value represents a height at which the sheet can stop during the transition. Values in percentage points. (`[25, 50, 75]`) | `[]`          |
| `closePercentage` | `number`   | The percentage of the Bottom Sheet's height that the user must drag for it to close, measured in percentage points.                                                           | `10`          |

### Events

| Event                | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `onopen()`           | Fires when the Bottom Sheet opens.                      |
| `onclose()`          | Fires when the Bottom Sheet closes.                     |
| `onsheetdragstart()` | Fires when the Bottom Sheet starts being dragged.       |
| `onsheetdragend()`   | Fires when the Bottom Sheet ends being dragged.         |
| `onsheetdrag()`      | Fires when the Bottom Sheet is currently being dragged. |

## BottomSheet Component Usage

There is a lot of stuff you can use inside `BottomSheet` which will be explained after the example usage.

### Example Usage

```javascript

<script lang="ts">
   let isSheetOpen = $state(false);
<script>

<BottomSheet bind:isOpen={isSheetOpen}>
	<BottomSheet.Trigger>
		<p>Click to open the sheet.</p>
	</BottomSheet.Trigger>
	<BottomSheet.Overlay>
		<BottomSheet.Sheet>
         <BottomSheet.Handle />
			<BottomSheet.Content>
				<h3>Bottom Sheet Title</h3>
				<p>Text</p>
			</BottomSheet.Content>
		</BottomSheet.Sheet>
	</BottomSheet.Overlay>
</BottomSheet>
```

### Key Features

1. **Binding the `isOpen` Property:**  
   The `isOpen` property is bound to a variable (here, `isEventsSheetOpen`) to track whether the bottom sheet is open or closed. You can control the sheet’s state programmatically by modifying the bound variable.

   Example:

   ```javascript
   let isEventsSheetOpen = $state(false);
   ```

2. **Trigger Area:**  
   The `BottomSheet.Trigger` component defines the area that opens / closes the bottom sheet when clicked. You can style it and use any content inside the trigger.

   Example:

   ```javascript
   <BottomSheet.Trigger>Trigger</BottomSheet.Trigger>
   ```

3. **Handling Open/Close Events:**  
   You can listen to `onopen` and `onclose` events to trigger custom logic when the sheet is opened or closed. This is useful for tracking interactions or performing other actions.

   Example:

   ```javascript
   <BottomSheet
   	onopen={() => logEvent('Bottom Sheet opened.')}
   	onclose={() => logEvent('Bottom Sheet closed.')}
   >
   	...
   </BottomSheet>
   ```

4. **Overlay & Content & Handle:**
   If you want to add a Overlay, you can do that by wrapping the `BottomSheet.Sheet` with `BottomSheet.Overlay`. You can style the overlay using the `style` property.

   You can use `BottomSheet.Content` inside `BottomSheet.Sheet` to display content. It's optional, but you are able to style it.

   When you place `BottomSheet.Handle` inside `BottomSheet.Sheet` you will get a style-able handle.

5. **Customizing the Sheet:**  
   The content inside the `BottomSheet.Sheet` component is fully customizable. You can add everything (really everything).

6. **Notes on Trigger and `isOpen`:**  
   You can both use the `Trigger Area` and the `isOpen State` for opening and closing the sheet. Depends on your preferences.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/AUXIDev/svelte-bottom-sheet).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AuxiDev/svelte-bottom-sheet/blob/master/LICENSE.txt) file for more details.
