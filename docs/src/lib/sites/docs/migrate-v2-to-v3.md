<script>
	import CopyCommandLine from '#lib/components/CopyCommandLine.svelte';
	 import * as BottomSheet from 'svelte-bottom-sheet';
</script>

# Migrate from v2 to v3

Version 3 changes the sheet from a pre-styled component into a full
customizable component. This guide covers the changes required to move an
existing v2 sheet to v3.

## Before you start

Install the v3 package version explicitly if you are
testing the release candidate:

<CopyCommandLine title="Terminal" textToCopy="npm install svelte-bottom-sheet@3.0.0-rc.1">

```bash
npm install svelte-bottom-sheet@3.0.0-rc.1
```

</CopyCommandLine>

Remove any v2-only imports and check the [API reference](/docs/api) after
upgrading. The package version and the migration guide should refer to the
same release.

## 1. Update the component structure

In v2, `Sheet` was nested inside `Overlay`. In v3, `Root`, `Overlay` and
`Sheet` are siblings. `Root` owns the state and configuration.

** v2 **

```svelte
<BottomSheet>
	<BottomSheet.Trigger>Open</BottomSheet.Trigger>
	<BottomSheet.Overlay>
		<BottomSheet.Sheet>
			<BottomSheet.Handle />
			<BottomSheet.Content>Content</BottomSheet.Content>
		</BottomSheet.Sheet>
	</BottomSheet.Overlay>
</BottomSheet>
```

** v3 **

```svelte
<script>
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root>
	<BottomSheet.Trigger>Open</BottomSheet.Trigger>
	<BottomSheet.Overlay />
	<BottomSheet.Sheet>
		<BottomSheet.Handle />
		<BottomSheet.Content>Content</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
```

You can also import the components individually:

```ts
import { Root, Sheet, Trigger, Content, Handle, Overlay } from 'svelte-bottom-sheet';
```

## 2. Move settings onto `Root`

The v2 `settings` prop was removed. Move its properties directly onto
`BottomSheet.Root`.

```svelte
<BottomSheet.Root maxHeight={0.8} position="bottom" snapPoints={[0.4, 0.8]} disableClosing>
	<!-- components -->
</BottomSheet.Root>
```

The value `1` is no longer added to `snapPoints` automatically. Add it
explicitly when the fully expanded position is needed.

## 3. Replace removed APIs

### `Grip`

`Grip` is no longer exported. Below are the legacy styles you can add inside `Handle` to get the grip back:

```svelte
<BottomSheet.Handle>
	<div class="sheet-grip"></div>
</BottomSheet.Handle>
```

```css
.sheet-grip {
	width: 40px;
	height: 4px;
	margin: 0.5rem;
	border-radius: 2px;
	background: #e0e0e0;
}
```

### `ContentAlignmentType`

`ContentAlignmentType` and `contentAlignment` were experimental APIs and have
been removed. Recreate the alignment with CSS on `Content`.

They were not used by default, so as long as you didn't use them you are fine.

## 4. Recreate styles and layering

V3 components are intentionally unstyled. Restore any styles your application
relied on, including:

- `Sheet` background, shadow, border radius, margins and layout
- `Content` padding and scrolling
- `Handle` background, size, position and orientation
- `Overlay` background
- `z-index` values for the sheet and overlay

Both `Sheet` and `Overlay` are rendered through a portal attached to
`document.body`. No default `z-index` is provided because they are not needed for most use cases. If you need z-index, add it.

**The `<BottomSheet.Overlay />` overlay is transparent unless a background is supplied.**

## 5. Review interaction behavior

V3 exposes separate controls for the interactions that were previously coupled.
Add the props that match your v2 behavior:

```svelte
<BottomSheet.Root
	disableClosing={false}
	disableClickOutside={false}
	disableEscape={false}
	disableFocusTrap={false}
	disableBackgroundInteraction={true}
	disableDragging={false}
	disableRubberband={false}
	onlyTopSheetInteractive={true}
>
	<!-- components -->
</BottomSheet.Root>
```

- `disableClosing` blocks all supported closing interactions.
- `disableClickOutside` keeps an outside click from closing the sheet.
- `disableEscape` keeps Escape from closing the sheet.
- `disableFocusTrap` allows focus to leave the sheet.
- `disableBackgroundInteraction` controls background scrolling and interaction.
  The current v3 implementation defaults this to `true`; set it to `false`
  explicitly when background interaction should remain available.
- `disableDragging` disables pointer and touch dragging.
- `disableRubberband` disables the elastic overscroll effect. This was introduced in V3.
- `onlyTopSheetInteractive` prevents sheets behind the topmost nested sheet
  from being dragged.

## 6. Replace custom animations

The v2 custom `slideTransition`/ fly transition was removed. V3 uses a
transform transition for `Sheet` and an opacity transition for `Overlay`.
Customize them with `sheetAnimation` and `overlayAnimation`:

```svelte
<BottomSheet.Root
	sheetAnimation={{
		durationInMs: 500,
		easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
	}}
	overlayAnimation={{
		durationInMs: 200,
		easing: 'ease-out'
	}}
>
	<!-- components -->
</BottomSheet.Root>
```

## 7. Adopt the new sizing options

V3 adds two options that commonly replace application-specific layout code:

- `fitContent` sizes the sheet to its content (Based on `BottomSheet.Sheet` because the handle counts towards the height) and therefore overrides `maxHeight`.
- `sheetSideOffset` adds a pixel offset between the sheet and the screen edge on the position axis. (So at `position=bottom` with `sheetSideOffset=0` will add a offset off 8px at the bottom)
- This is useful for [floating sheets](/docs/example-advanced#floating-sheet) **MIND THE STYLING FOR BACKGROUND**

```svelte
<BottomSheet.Root position="right" fitContent sheetSideOffset={16} snapPoints={[0.5, 1]}>
	<!-- components -->
</BottomSheet.Root>
```

This adds a 16px offset to the right and fits the sheet width to the Sheets' content.

## 8. Use child snippets where markup must be custom

Every visual component supports a `child` snippet. It receives the props
needed for behavior and lets you render your own element:

```svelte
<BottomSheet.Content>
	{#snippet child({ props })}
		<section {...props} class="custom-content">Content</section>
	{/snippet}
</BottomSheet.Content>
```

Use this instead of replacing component internals when you need custom
markup, attributes or styling. The same pattern is available on `Sheet`,
`Trigger`, `Handle` and `Overlay`.

For the complete v3 props, events and component types, see the
[API reference](/docs/api).
