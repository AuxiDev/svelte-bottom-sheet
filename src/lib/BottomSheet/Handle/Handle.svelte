<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { measurementToPx } from '$lib/utils.js';
	import { getContext, onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Grip from '../Grip/Grip.svelte';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}

	let { children, ...rest }: { children?: Snippet<[]> } & HTMLAttributes<HTMLDivElement> = $props();

	let handleContainer: HTMLDivElement = $state({} as HTMLDivElement);
	let handleWrapper: HTMLDivElement = $state({} as HTMLDivElement);

	// This is a workaround to the "transform: rotate()" bounding client issues, where the parent element still uses the old width
	onMount(() => {
		if (sheetContext.settings.position === 'left' || sheetContext.settings.position === 'right') {
			handleContainer.style.width = `${handleWrapper.getBoundingClientRect().width}px`;
		}
	});

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
	bind:this={handleContainer}
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
	{...rest}
>
	{#if children}
		<div bind:this={handleWrapper} class="handle-grip-wrapper">
			{@render children?.()}
		</div>
	{:else}
		<div bind:this={handleWrapper} class="handle-grip-wrapper">
			<Grip />
		</div>
	{/if}
</div>

<style>
	.handle-container {
		position: sticky;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: white;
		z-index: 51;
		padding: 8px 0px;
	}

	.handle-grip-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.position-left,
	.position-right {
		padding: 0px 8px;
	}

	.position-right .handle-grip-wrapper,
	.position-left .handle-grip-wrapper {
		transform: rotate(90deg);
	}

	.position-right .handle-grip-wrapper {
		flex-direction: column-reverse;
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

	.handle-container:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.2);
		outline-offset: 2px;
	}
</style>
