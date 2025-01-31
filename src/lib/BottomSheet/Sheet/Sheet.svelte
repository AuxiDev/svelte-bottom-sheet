<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { BottomSheetSettings, SheetContext } from '$lib/types.js';
	import { get } from 'svelte/store';

	const { isSheetVisible, closeSheet, getSettings } = getContext<SheetContext>('sheetStateContext');

	let {
		children
	}: {
		children?: any;
	} = $props();

	let maxHeight = getSettings().maxHeight ?? '70%';
	let snapPoints: number[] = getSettings().snapPoints ?? [];

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
				closeSheet();
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
			closeSheet();
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
	let visibilityUpdate = $state(false);

	isSheetVisible.subscribe((state) => {
		visibilityUpdate = state;
	});

	$effect(() => {
		if (visibilityUpdate) {
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'auto';
		}
	});
</script>

{#if $isSheetVisible}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

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
{/if}

<style>
	.prevent-select {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.bottom-sheet {
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		justify-content: center;
		align-self: flex-end;
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
