<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();

	const handleKeyDown = (event: KeyboardEvent) => {
		const maxHeightPx =
			window.innerHeight * (parseInt(sheetContext.settings.maxHeight ?? '70%') / 100);
		const snapPoints = sheetContext.settings.snapPoints || [100];

		const snapPointsPx = snapPoints
			.map((point) => maxHeightPx - (point / 100) * maxHeightPx)
			.sort((a, b) => b - a);

		const currentIndex = snapPointsPx.findIndex(
			(point) => Math.abs(point - sheetContext.sheetHeight) < 10
		);

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (currentIndex < snapPointsPx.length - 1) {
					sheetContext.sheetHeight = snapPointsPx[currentIndex + 1];
				}
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (currentIndex > 0) {
					sheetContext.sheetHeight = snapPointsPx[currentIndex - 1];
				} else {
					sheetContext.closeSheet();
				}
				break;
			case 'Home':
				event.preventDefault();
				sheetContext.sheetHeight = snapPointsPx[snapPointsPx.length - 1];
				break;
			case 'End':
				event.preventDefault();
				sheetContext.sheetHeight = snapPointsPx[0];
				break;
		}
	};
</script>

<div
	class="handle-container"
	onmousemove={() => (sheetContext.isDraggingFromHandle = true)}
	ontouchmove={() => (sheetContext.isDraggingFromHandle = true)}
	role="slider"
	tabindex="0"
	aria-label="Sheet height control"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={Math.round((1 - sheetContext.sheetHeight / window.innerHeight) * 100)}
	onkeydown={handleKeyDown}
>
	<div {...rest} class="bottom-sheet-handle {rest.class}" aria-hidden="true"></div>
</div>

<style>
	.bottom-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
	}
	.handle-container {
		height: 40px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.handle-container:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.2);
		outline-offset: 2px;
	}
</style>
