<script lang="ts">
	import { getContext, onMount, type ComponentType, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { BottomSheetSettings, SheetContext } from '$lib/types.js';
	import { get } from 'svelte/store';
	import type { HTMLAttributes } from 'svelte/elements';
	import Handle from '../Handle/Handle.svelte';
	import Content from '../Content/Content.svelte';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
	const sheetContext = getContext<SheetContext>('sheetStateContext');
	if (!sheetContext) {
		throw new Error('BottomSheet.Sheet must be inside a BottomSheet component');
	}
	const { isSheetVisible, closeSheet, getSettings, onSheetDrag, onSheetDragEnd, onSheetDragStart } =
		sheetContext;

	let maxHeight = getSettings().maxHeight ?? '70%';
	let snapPoints: number[] = getSettings().snapPoints ?? [];

	// svelte-ignore non_reactive_update
	let sheetElement: HTMLDivElement;
	let sheetContent: HTMLDivElement | null = $state(null);
	let currentHeight: number = $state(0);
	let isMovingSheet: boolean = $state(false);
	let noScrolledTop: number = 0;
	let isDraggingFromHandle: boolean = false;

	let startY: number = 0;
	let startHeight: number = 0;
	let isDragging: boolean = $state(false);
	let maxHeightPx: number = 0;

	let visibilityUpdate = $state(false);

	isSheetVisible.subscribe((state) => {
		visibilityUpdate = state;
	});

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
		noScrolledTop = sheetContent?.scrollTop ?? 0;
		onSheetDragStart();
	};

	const mouseMoveEvent = (event: MouseEvent) => {
		if (!isDragging) return;
		let offset: number;

		if (isDraggingFromHandle) {
			offset = Math.max(0, event.clientY - startY + startHeight);
		} else {
			offset = Math.max(0, event.clientY - startY - noScrolledTop + startHeight);
		}

		currentHeight = offset;
		onSheetDrag();
	};

	const touchMoveEvent = (event: TouchEvent) => {
		if (!isDragging) return;
		onSheetDrag();

		if (sheetContent?.scrollTop !== 0 && !isDraggingFromHandle) {
			isMovingSheet = false;
			return;
		}

		let offset: number;

		// event.touches[0].clientY - startY - normal offset
		// noScrolledTop - because we calculate with clientY, when you scroll before through the content and then you close the sheet, the offset would have a jump in it
		// startHeight - offset when we not start at the top with dragging
		if (isDraggingFromHandle) {
			// Is used for scrollable sheets. Allows to user to close the sheet when not scrolled to the top, but dragging from the handle.
			offset = Math.max(0, event.touches[0].clientY - startY + startHeight);
		} else {
			offset = Math.max(0, event.touches[0].clientY - startY - noScrolledTop + startHeight);
		}

		if (currentHeight != 0) {
			isMovingSheet = true;
		}

		currentHeight = offset;
	};

	const moveEnd = () => {
		onSheetDragEnd();
		const snappointToPxValue = (percentage: number): number =>
			maxHeightPx - (percentage / 100) * maxHeightPx;

		// If there is only 1 snappoint (must be 100), there will be a bigger buffer to close the sheet (default behaviour)
		if (snapPoints.length === 1) {
			if (currentHeight > snappointToPxValue(100 - (getSettings().closePercentage ?? 10))) {
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
		isDraggingFromHandle = false;
	};

	const preventPullToRefresh = (event: TouchEvent) => {
		if (window.scrollY === 0 && event.touches[0].clientY > 50) {
			event.preventDefault();
		}
	};

	$effect(() => {
		if (visibilityUpdate) {
			document.body.style.overflowY = 'hidden';
			document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
		} else {
			document.body.style.overflowY = 'auto';
			document.removeEventListener('touchmove', preventPullToRefresh);
		}

		if (sheetContent) {
			// Allows dragging a Scrollable Sheet down when it's not scrolled to the top if you use the handle.
			// Set isDraggingFromHandle = true, which is then used in the moveEvents
			let handle: HTMLElement | null = sheetElement.querySelector('.handle-container');
			if (handle) {
				handle.remove();
				sheetElement.insertBefore(handle, sheetElement.firstChild);
				handle.addEventListener('touchmove', () => {
					isDraggingFromHandle = true;
				});
				handle.addEventListener('mousemove', () => {
					isDraggingFromHandle = true;
				});
			}
		}
	});
</script>

{#if $isSheetVisible}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

	<div
		{...rest}
		bind:this={sheetElement}
		class="bottom-sheet {isDragging ? 'prevent-select' : ''}"
		style="height: {maxHeight};  transform: translateY({currentHeight}px); transition: {isDragging
			? ''
			: 'transform 0.3s ease-in-out'}; {rest.style} "
		role="dialog"
		ontouchstart={touchStartEvent}
		ontouchmove={touchMoveEvent}
		ontouchend={moveEnd}
		onmousedown={mouseDownEvent}
		onmousemove={mouseMoveEvent}
		onmouseup={moveEnd}
		transition:slide={{ duration: 500, easing: cubicOut }}
	>
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
		max-width: 100%;
		margin: 0 auto;
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
</style>
