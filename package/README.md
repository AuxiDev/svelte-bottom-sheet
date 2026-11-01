# Svelte Bottom Sheet

A flexible and customizable sheet component for Svelte.

<p align="center">
  <a href="https://www.npmjs.com/package/svelte-bottom-sheet">
    <img src="https://img.shields.io/npm/v/svelte-bottom-sheet?style=flat-square&logo=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/svelte-bottom-sheet">
    <img src="https://img.shields.io/npm/dm/svelte-bottom-sheet?style=flat-square&logo=npm" alt="npm downloads" />
  </a>
  <a href="https://github.com/AUXIDev/svelte-bottom-sheet/blob/master/LICENSE.txt">
    <img src="https://img.shields.io/github/license/AUXIDev/svelte-bottom-sheet?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/AUXIDev/svelte-bottom-sheet/stargazers">
    <img src="https://img.shields.io/github/stars/AUXIDev/svelte-bottom-sheet?style=flat-square&logo=github" alt="GitHub stars" />
  </a>
  <a href="https://github.com/AUXIDev/svelte-bottom-sheet/issues">
    <img src="https://img.shields.io/github/issues/AUXIDev/svelte-bottom-sheet?style=flat-square" alt="GitHub issues" />
  </a>
</p>

<p align="center">
  <a href="https://bottomsheet.auxi.studio/"><strong>Live Demo</strong></a>
  ·
  <a href="https://bottomsheet.auxi.studio/docs/getting-started"><strong>Documentation</strong></a>
  ·
  <a href="https://github.com/AUXIDev/svelte-bottom-sheet/issues"><strong>Report an Issue</strong></a>
</p>

## Installation

```bash
npm install svelte-bottom-sheet
```

## Quick Start

```svelte
<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root>
	<BottomSheet.Trigger>Open sheet</BottomSheet.Trigger>

	<BottomSheet.Overlay />

	<BottomSheet.Sheet>
		<BottomSheet.Handle />

		<BottomSheet.Content>
			<h2>Meet the Sheet</h2>
			<p>Sheets reveal useful content without taking users away from the page.</p>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
```

For configuration, examples, and advanced usage, check out the [documentation](https://bottomsheet.auxi.studio/docs/getting-started).

## Features

- **Customizable**: Control the style, maximum height and snap points of the sheet.
- **Snap Points**: Option to let the Bottom Sheet snap to specific positions.
- **Smooth Animations**: Sleek transitions for opening, closing, and dragging the sheet.
- **Lightweight & Easy to Integrate**: Just add the component and configure the settings.
- **Event Handling**: Built-in events such as `onopen` and `onclose` to track user interactions.
- **Different Position**: Position the sheet not only on the `bottom` but also on the `sides` and on the `top`
- **Nested Sheets**: Support for opening a Bottom Sheet from within another Bottom Sheet.
- **Rubberband**: Smooth overscrolling at the top of the sheet.
- ... and many, many more!

## Contributing

Contributions, bug reports, and feature suggestions are welcome. Feel free to open an issue or submit a pull request.

## License

[MIT](https://github.com/AUXIDev/svelte-bottom-sheet/blob/master/LICENSE.txt)
