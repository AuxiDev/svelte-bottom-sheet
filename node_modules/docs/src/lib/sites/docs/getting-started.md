<script>
  import CopyCommandLine from '#lib/components/CopyCommandLine.svelte';
  import PreviewCodeTabs from '#lib/components/PreviewCodeTabs.svelte';
  import SheetBasic from '#lib/components/demo/SheetBasic.svelte';
  import sheetCode from '#lib/components/demo/SheetBasic.svelte?raw';
</script>

# Getting Started

Svelte Bottom Sheet is a composable Svelte 5 component for building drawers and sheets. It supports drag gestures, snap points, keyboard interactions, focus management and four entry directions.

## Installation

Install the package using your preferred package manager.

<CopyCommandLine title="Terminal" textToCopy="npm i svelte-bottom-sheet">

```bash
npm i svelte-bottom-sheet
```

</CopyCommandLine>

## Your first sheet

Import `BottomSheet` to build your sheet. The root manages state and behavior, while the remaining components define the trigger, surface, backdrop and content.

<PreviewCodeTabs language="svelte" source={sheetCode}>
  {#snippet preview()}
    <SheetBasic />
  {/snippet}
</PreviewCodeTabs>

## Component overview

- **`Root`** - Manages open state, positioning, snapping and interactions.
- **`Trigger`** - Provides a button to open or toggle the sheet.
- **`Sheet`** - Defines the sheet surface.
- **`Handle`** - Provides a drag target and keyboard resize control.
- **`Content`** - Holds the sheet's content.
- **`Overlay`** - Displays the backdrop behind the sheet.

Each component has a focused responsibility, allowing you to customize the composition without relying on a single monolithic component.

### Import

Import components individually or use the compound `BottomSheet` export.

```ts
import { Root, Sheet, Trigger, Content, Handle, Overlay } from 'svelte-bottom-sheet';
// or
import { BottomSheet } from 'svelte-bottom-sheet';
// or
import * as BottomSheet from 'svelte-bottom-sheet';
```

### Basic Structure

<CopyCommandLine title="Basic Strcuture" textToCopy="<BottomSheet.Root>
	<BottomSheet.Trigger>...</BottomSheet.Trigger>
	<BottomSheet.Overlay />
	<BottomSheet.Sheet>
		<BottomSheet.Handle />
		<BottomSheet.Content>...</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>">

```svelte
<BottomSheet.Root>
	<BottomSheet.Trigger>...</BottomSheet.Trigger>
	<BottomSheet.Overlay />
	<BottomSheet.Sheet>
		<BottomSheet.Handle />
		<BottomSheet.Content>...</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
```

</CopyCommandLine>

## Styling

The components are intentionally unstyled, so you can adapt them to your application's design system using CSS, Tailwind CSS or your own reusable components.

You can style the default elements directly. For more control over the rendered markup, components also support a `child` snippet.

See [Styling & Customization](/docs/styling) to learn about styling options and custom elements.

## Next steps

- Browse component props and events in the [API reference](/docs/api).
