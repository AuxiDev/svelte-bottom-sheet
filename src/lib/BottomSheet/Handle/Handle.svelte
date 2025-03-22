<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { measurementToPx } from '$lib/utils.js';
	import { getContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();

	const handleKeyDown = (event: KeyboardEvent) => {
		if (sheetContext.settings.disableDragging) return;
		const maxHeightPx = sheetContext.maxHeightPx;
		const snapPoints = sheetContext.settings.snapPoints;

		let snapPointsInPx = snapPoints
			.map((point) => measurementToPx(point, maxHeightPx))
			.sort((a, b) => b - a);

		const currentIndex = snapPointsInPx.findIndex(
			(point) => Math.abs(point - sheetContext.sheetHeight) < 10
		);

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (currentIndex < snapPointsInPx.length - 1) {
					sheetContext.sheetHeight = snapPointsInPx[currentIndex + 1];
				}
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (currentIndex > 0) {
					sheetContext.sheetHeight = snapPointsInPx[currentIndex - 1];
				} else if (!sheetContext.settings.disableClosing) {
					sheetContext.closeSheet();
				}
				break;
			case 'Home':
				event.preventDefault();
				sheetContext.sheetHeight = snapPointsInPx[snapPointsInPx.length - 1];
				break;
			case 'End':
				event.preventDefault();
				sheetContext.sheetHeight = snapPointsInPx[0];
				break;
		}
	};
</script>

<div
	class="handle-container position-{sheetContext.settings.position}"
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
		position: sticky;
		height: 40px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		z-index: 51;
	}

	.position-left,
	.position-right {
		width: 40px;
		height: 100%;
	}

	.position-left .bottom-sheet-handle,
	.position-right .bottom-sheet-handle {
		transform: rotate(90deg);
	}

	.position-bottom {
		top: 0;
	}

	.position-top {
		bottom: 0;
	}

	.position-left {
		right: 0;
	}

	.position-right {
		left: 0;
	}

	.handle-container:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.2);
		outline-offset: 2px;
	}
</style>
