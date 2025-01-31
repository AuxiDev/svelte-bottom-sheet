<!--
@component ### BottomSheet Component

#### Description
The `BottomSheet` component provides a flexible bottom sheet UI that can slide up from the bottom of the screen. It supports configurable height constraints and snapping behavior.

#### Properties

| Property     | Type             | Default  | Description                                                                          |
|--------------|------------------|----------|--------------------------------------------------------------------------------------|
| `isOpen`     | `boolean`        | `false`  | Determines whether the bottom sheet is visible.                                      |
| `maxHeight`  | `string`         | `'70%'`  | Defines the maximum height of the bottom sheet as a percentage of the screen height. |
| `snapPoints` | `number[]`       | `[]`     | An array of percentage values where the bottom sheet should snap to when dragged.    |
| `settings`   | `BottomSheetSettings`       | `{disableScrollingOutside:true}`     | Settings for the BottomSheet.    |
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { BottomSheetSettings } from './types.js';

	let {
		isOpen = $bindable(false),
		maxHeight = '70%',
		snapPoints = [],
		settings = { disableScrollingOutside: true },
		children,
		onopen,
		onclose
	}: {
		isOpen?: boolean;
		maxHeight?: string;
		snapPoints?: number[];
		settings?: BottomSheetSettings;
		children?: any;
		onopen?: () => void;
		onclose?: () => void;
	} = $props();

	// svelte-ignore non_reactive_update
	let sheetElement: HTMLDivElement;
	// svelte-ignore non_reactive_update
	let sheetContent: HTMLDivElement;
	let currentHeight: number = $state(0);
	let isMovingSheet: boolean = $state(false);
	let noScrolledTop: number = 0;

	let startY: number = 0;
	let startHeight: number = 0;
	let isDragging: boolean = $state(false);
	let maxHeightPx: number = 0;

	onMount(() => {
		snapPoints.push(100);
		maxHeightPx = window.innerHeight * (parseInt(maxHeight) / 100);
	});

	const touchStartEvent = (event: TouchEvent) => {
		initializeMove(event.touches[0].clientY);
	};

	const mouseDownEvent = (event: MouseEvent) => {
		initializeMove(event.clientY);
	};

	const initializeMove = (clientStartY: number) => {
		startY = clientStartY;
		startHeight = currentHeight;
		isDragging = true;
		noScrolledTop = sheetContent.scrollTop;
	};

	const mouseMoveEvent = (event: MouseEvent) => {
		if (!isDragging) return;
		const offset = Math.max(0, event.clientY - startY - noScrolledTop + startHeight);

		currentHeight = offset;
	};

	const touchMoveEvent = (event: TouchEvent) => {
		if (!isDragging) return;

		if (sheetContent.scrollTop !== 0) {
			isMovingSheet = false;
			return;
		}

		// event.touches[0].clientY - startY - normal offset
		// noScrolledTop - because we calculate with clientY, when you scroll before through the content and then you close the sheet, the offset would have a jump in it
		// startHeight - offset when we not start at the top with dragging
		const offset = Math.max(0, event.touches[0].clientY - startY - noScrolledTop + startHeight);

		if (currentHeight != 0) {
			isMovingSheet = true;
		}

		currentHeight = offset;
	};

	const moveEnd = () => {
		const snappointToPxValue = (percentage: number): number =>
			maxHeightPx - (percentage / 100) * maxHeightPx;

		// If there is only 1 snappoint (must be 100), there will be a bigger buffer to close the sheet (default behaviour)
		if (snapPoints.length === 1) {
			if (currentHeight > (sheetElement?.offsetHeight ?? 0) / 5) {
				isOpen = false;
				currentHeight = 0;
			} else {
				currentHeight = 0;
			}
			resetStatesAfterMove();
			return;
		}
		// Check if the current height is above the lowest snap point, else close it
		const lowestSnapPointPx = snappointToPxValue(Math.min(...snapPoints));
		if (currentHeight > lowestSnapPointPx) {
			currentHeight = 0;
			isOpen = false;
			resetStatesAfterMove();
			return;
		}

		// Determine movement direction (snapping up or down)
		const isMovingUp = currentHeight < startHeight;
		const buffer = snappointToPxValue(95);

		// Buffer logic: Prevent accidental snapping if the movement is small
		if (
			(isMovingUp && currentHeight > startHeight - buffer) ||
			(!isMovingUp && currentHeight < startHeight + buffer)
		) {
			currentHeight = startHeight;
			resetStatesAfterMove();
			return;
		}

		// Find valid snap points based on the direction of movement
		const validPoints = snapPoints
			.map((point) => ({ original: point, converted: snappointToPxValue(point) }))
			.filter((item) =>
				isMovingUp ? item.converted < currentHeight : item.converted > currentHeight
			);

		// Find the closest snap point
		if (validPoints.length > 0) {
			const closest = validPoints.reduce((prev, curr) =>
				isMovingUp
					? curr.converted > prev.converted
						? curr
						: prev
					: curr.converted < prev.converted
						? curr
						: prev
			);
			currentHeight = closest.converted;
		}

		resetStatesAfterMove();
	};

	const resetStatesAfterMove = () => {
		isDragging = false;
		isMovingSheet = false;
	};

	$effect(() => {
		if (isOpen) {
			onopen?.();
			if (settings?.disableScrollingOutside) {
				document.body.style.overflowY = 'hidden';
			}
		} else {
			onclose?.();
			if (settings?.disableScrollingOutside) {
				document.body.style.overflowY = 'auto';
			}
		}
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="bottom-sheet-overlay" role="button" tabindex="0" transition:fade={{ duration: 200 }}>
		<div
			bind:this={sheetElement}
			class="bottom-sheet {isDragging ? 'prevent-select' : ''}"
			style="height: {maxHeight};  transform: translateY({currentHeight}px); transition: {isDragging
				? ''
				: 'transform 0.3s ease-in-out'};"
			role="dialog"
			ontouchstart={touchStartEvent}
			ontouchmove={touchMoveEvent}
			ontouchend={moveEnd}
			onmousedown={mouseDownEvent}
			onmousemove={mouseMoveEvent}
			onmouseup={moveEnd}
			onmouseleave={moveEnd}
			transition:slide={{ duration: 500, easing: cubicOut }}
		>
			<div class="bottom-sheet-handle"></div>
			<div
				bind:this={sheetContent}
				class="bottom-sheet-content"
				style="overflow-y: {isMovingSheet ? 'hidden' : 'auto'};"
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.prevent-select {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.bottom-sheet-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 1;
		overflow: hidden;
	}

	.bottom-sheet {
		background-color: #fff;
		position: absolute;
		width: 100%;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		touch-action: none;
		border-radius: 16px 16px 0 0;
		z-index: 2;
	}

	.bottom-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
	}

	.bottom-sheet-content {
		max-height: calc(100%);
	}
	.bottom-sheet-content {
		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.bottom-sheet-content::-webkit-scrollbar {
		display: none;
	}
	@media (min-width: 768px) {
		.bottom-sheet {
			max-width: 600px;
			margin: 0 auto;
		}
	}
</style>
