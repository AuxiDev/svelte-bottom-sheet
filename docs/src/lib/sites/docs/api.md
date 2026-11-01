# API Reference

The Bottom Sheet API consists of a root component that manages state and behavior, along with components for the sheet, trigger, content, handle and overlay.

## Components

| Component | Description                               |
| --------- | ----------------------------------------- |
| `Root`    | Configures and controls the bottom sheet. |
| `Sheet`   | Defines the sheet container.              |
| `Trigger` | Opens or toggles the sheet.               |
| `Content` | Contains the sheet's main content.        |
| `Handle`  | Provides a draggable handle.              |
| `Overlay` | Renders the backdrop behind the sheet.    |

## Root props

`Root` manages the sheet's state.

### State and layout

| Prop                 | Type            | Default    | Description                                                                                              |
| -------------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `isSheetOpen`        | `boolean`       | `false`    | Controls whether the sheet is open. Supports two-way binding. (**bind:**)                                |
| `position`           | `SheetPosition` | `'bottom'` | The edge from which the sheet appears.                                                                   |
| `maxHeight`          | `number*`       | `0.9`      | Maximum sheet height.                                                                                    |
| `snapPoints`         | `number[]`      | `[1]`      | Points to snap to after letting go.                                                                      |
| `startingSnapPoint`  | `number`        | -          | Initial snap point; must match a configured point.                                                       |
| `fitContent`         | `boolean`       | `false`    | Sizes the sheet to its content. (Counting height of `BottomSheet.Sheet`. **Will overwrite `maxHeight`**) |
| `sheetSideOffset`    | `number*`       | `0`        | Offset from the edge where the sheet opens.                                                              |
| `maxDragPoint`       | `number*`       | `-0.1`     | Maxium point you can drag to.                                                                            |
| `closeThreshold`     | `number*`       | `0.8`      | Point to which you have to drag to to close the sheet.                                                   |
| `autoCloseThreshold` | `number*`       | `0`        | Point after which the sheet automatically closes. Set to `0` to disable automatic closing.               |

#### Numeric values

Numeric props use different units depending on their purpose.

- Values between `0` and `1` represent a fraction of the sheet size. For example, `0.9` represents 90%.
- Values greater than or equal to `1` represent pixels. For example, `200` represents 200 pixels.

They are marked with `*`

#### SheetPosition

Defines the edge from which the sheet appears.

Value: `bottom` | `top` | `left` | `right`

### Interaction

| Prop                           | Type      | Default | Description                                                        |
| ------------------------------ | --------- | ------- | ------------------------------------------------------------------ |
| `disableClosing`               | `boolean` | `false` | Prevents closing through Escape, outside clicks and dragging.      |
| `disableDragging`              | `boolean` | `false` | Disables pointer and touch dragging.                               |
| `disableClickOutside`          | `boolean` | `false` | Prevents outside clicks from closing the sheet.                    |
| `disableEscape`                | `boolean` | `false` | Prevents closing with Escape.                                      |
| `disableFocusTrap`             | `boolean` | `false` | Disables focus trapping.                                           |
| `disableBackgroundInteraction` | `boolean` | `true`  | Prevents background interaction while open.                        |
| `disableRubberband`            | `boolean` | `false` | Disables elastic overscroll while dragging.                        |
| `onlyTopSheetInteractive`      | `boolean` | `true`  | Restricts interaction to the topmost sheet when sheets are nested. |

### Animations

| Prop               | Type             | Description                                      |
| ------------------ | ---------------- | ------------------------------------------------ |
| `sheetAnimation`   | `AnimationProps` | Configures sheet opening and closing animations. |
| `overlayAnimation` | `AnimationProps` | Configures overlay animations.                   |

Both accept the following optional properties:

| Property       | Type     | Description                         |
| -------------- | -------- | ----------------------------------- |
| `durationInMs` | `number` | Animation duration in milliseconds. |
| `easing`       | `string` | CSS-style easing value.             |

## Events

`Root` provides callbacks for sheet lifecycle and drag interactions.

| Event              | Signature                 | Description                                   |
| ------------------ | ------------------------- | --------------------------------------------- |
| `onopen`           | `() => void`              | Fires when opening begins.                    |
| `onclose`          | `() => void`              | Fires when closing begins.                    |
| `onsheetdragstart` | `() => void`              | Fires when dragging starts.                   |
| `onsheetdrag`      | `() => void`              | Fires during dragging.                        |
| `onsheetdragend`   | `() => void`              | Fires when dragging ends.                     |
| `onsnap`           | `(point: number) => void` | Fires when the sheet settles on a snap point. |

## Components

The package exports six components.

### Component summary

| Component | Base props              | Underlying element  |
| --------- | ----------------------- | ------------------- |
| `Root`    | `BottomSheetProps`      | -                   |
| `Sheet`   | `SheetPropsWithChild`   | `HTMLDivElement`    |
| `Trigger` | `TriggerPropsWithChild` | `HTMLButtonElement` |
| `Content` | `ContentPropsWithChild` | `HTMLDivElement`    |
| `Handle`  | `HandlePropsWithChild`  | `HTMLDivElement`    |
| `Overlay` | `OverlayPropsWithChild` | `HTMLDivElement`    |

### `SheetPropsWithChild`

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop       | Type                                        | Description                                                          |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `children` | `Snippet<[]>`                               | Optional snippet rendered inside the sheet.                          |
| `ref`      | `HTMLDivElement / null`                     | Optional reference to the underlying element.                        |
| `child`    | `Snippet<[{ props: Record<string, any> }]>` | Child snippet to render the coponent wit hthe element in your hands. |

### `TriggerPropsWithChild`

Extends `HTMLButtonAttributes`.

| Prop       | Type                                        | Description                                                          |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `children` | `Snippet<[]>`                               | Optional snippet rendered inside the trigger.                        |
| `ref`      | `HTMLButtonElement / null`                  | Optional reference to the underlying button element.                 |
| `child`    | `Snippet<[{ props: Record<string, any> }]>` | Child snippet to render the coponent wit hthe element in your hands. |

### `ContentPropsWithChild`

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop       | Type                                        | Description                                                          |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `children` | `Snippet<[]>`                               | Optional snippet rendered inside the content area.                   |
| `ref`      | `HTMLDivElement / null`                     | Optional reference to the underlying element.                        |
| `child`    | `Snippet<[{ props: Record<string, any> }]>` | Child snippet to render the coponent wit hthe element in your hands. |

### `HandlePropsWithChild`

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop       | Type                                        | Description                                                          |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `children` | `Snippet<[]>`                               | Optional snippet rendered inside the handle.                         |
| `ref`      | `HTMLDivElement / null`                     | Optional reference to the underlying element.                        |
| `child`    | `Snippet<[{ props: Record<string, any> }]>` | Child snippet to render the coponent wit hthe element in your hands. |

### `OverlayPropsWithChild`

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop       | Type                                        | Description                                                          |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `children` | `Snippet<[]>`                               | Optional snippet rendered inside the overlay.                        |
| `ref`      | `HTMLDivElement / null`                     | Optional reference to the underlying element.                        |
| `child`    | `Snippet<[{ props: Record<string, any> }]>` | Child snippet to render the coponent wit hthe element in your hands. |

## Exports

Import components individually or use the compound `BottomSheet` export.

```ts
import { Root, Sheet, Trigger, Content, Handle, Overlay } from 'svelte-bottom-sheet';
// or
import { BottomSheet } from 'svelte-bottom-sheet';
// or
import * as BottomSheet from 'svelte-bottom-sheet';
```

The compound export exposes the same components as properties:

```svelte
<BottomSheet.Root>
	<BottomSheet.Trigger>Open sheet</BottomSheet.Trigger>
	<BottomSheet.Sheet>
		<BottomSheet.Handle />
		<BottomSheet.Content>Sheet content</BottomSheet.Content>
	</BottomSheet.Sheet>
	<BottomSheet.Overlay />
</BottomSheet.Root>
```

### Types

The package exports these public types:

- `SheetPosition`
- `AnimationProps`
- `BottomSheetProps`
- `SheetProps`
- `TriggerProps`
- `ContentProps`
- `HandleProps`
- `OverlayProps`
- `SheetPropsWithChild`
- `TriggerPropsWithChild`
- `ContentPropsWithChild`
- `HandlePropsWithChild`
- `OverlayPropsWithChild`
- `GripProps`
- `GripPropsWithChild`
- `SheetContextType`
- `TypeOfBottomSheet`
- `TypeOfSheet`
- `TypeOfContent`
- `TypeOfHandle`
- `TypeOfOverlay`
- `TypeOfTrigger`

The `WithChild` types extend their corresponding component prop types with an optional custom-rendering snippet. The `TypeOf...` aliases represent the component types themselves.

Most only need the component exports. Import these types when you need explicit TypeScript annotations.
