<script lang="ts">
	import { untrack } from 'svelte';
	import { getSheetContext, isTopSheet } from '../context.js';
	import { mergeProps } from '#lib/utils/merge-props.js';
	import { measurementToPx } from '#lib/utils/other.js';
	import { withRef } from '#lib/utils/ref-attachment.js';
	import { clickOutside } from '#lib/utils/click-outside.js';
	import { preventScroll } from '#lib/utils/preventOusideInteraction.js';
	import { focusUtils } from '#lib/utils/focus.js';
	import { handleEscapeKey } from '#lib/utils/escape-key.js';
	import type { SheetPropsWithChild } from '../types.js';
	import { withPortal } from '#lib/utils/portal.svelte.js';
	import { onDestroy } from 'svelte';

	let { children, child, ref, ...rest }: SheetPropsWithChild = $props();

	const sheetContext = getSheetContext();

	// Basic State-Variables for the sheet
	let activeTouchId: number | null = null;
	let sheetGestureMode = $state<'idle' | 'pending' | 'scroll' | 'drag'>('idle');

	// The sheet acts like a modal when we have focus trap on and the background is not interactable
	const isModal = $derived(
		!sheetContext.isFocusTrappedDisabled && sheetContext.isBackgroundInteractionDisabled
	);

	// Positions States for the sheet
	let startY = 0;
	let lastY = 0;
	let startX = 0;
	let lastX = 0;
	let offsetAtDragStart = 0;

	// Effect for adding different listeners for focus trap, esc-close, clickOutside-close and backgroundInteraction
	// Cleans up when the sheet is closed
	$effect(() => {
		const isOpen = sheetContext.isSheetOpenInternal;
		const element = untrack(() => ref);

		if (!isOpen || !element) return;

		let cancelled = false;
		let cleanupFocus: (() => void) | undefined;
		const cleanup: (() => void)[] = [];

		if (!sheetContext.isClickOutsideClosingDisabled) {
			cleanup.push(
				clickOutside(element, () => {
					if (sheetContext.isClosingDisabled) return;
					if (!isTopSheet(sheetContext.sheetId)) return;

					sheetContext.closeSheet();
				})
			);
		}

		if (sheetContext.isBackgroundInteractionDisabled) {
			cleanup.push(preventScroll(element));
		}

		if (!sheetContext.isEscapeClosingDisabled) {
			cleanup.push(
				handleEscapeKey((event) => {
					if (!isTopSheet(sheetContext.sheetId)) return;
					if (sheetContext.isClosingDisabled) return;

					event.preventDefault();
					sheetContext.closeSheet();
				})
			);
		}

		if (!sheetContext.isFocusTrappedDisabled) {
			void focusUtils.trap(element).then((dispose) => {
				if (cancelled) {
					dispose();
				} else {
					cleanupFocus = dispose;
				}
			});
		}

		return () => {
			cancelled = true;
			cleanupFocus?.();
			cleanup.forEach((dispose) => dispose());
		};
	});

	// HELPER METHODS SECTION

	/*
	  ´Checks if the container with the current delta would be scrolled
	*/
	const isScrollMovementInContainer = (container: HTMLElement, delta: number) => {
		let scrollTop = 0;
		let scrollHeight = 0;
		let elementHeight = 0;

		switch (sheetContext.position) {
			case 'top':
			case 'bottom':
				scrollTop = container.scrollTop;
				scrollHeight = container.scrollHeight;
				elementHeight = container.clientHeight;
				break;
			case 'left':
			case 'right':
				scrollTop = container.scrollLeft;
				scrollHeight = container.scrollWidth;
				elementHeight = container.clientWidth;
				break;
		}

		const atTop = scrollTop <= 1;
		const atBottom = scrollHeight - elementHeight - scrollTop <= 1;

		if (delta > 0) {
			return !atTop;
		}

		if (delta < 0) {
			return !atBottom;
		}

		return false;
	};

	/*
	  Tries to identify the current touch
	*/
	const getTrackedTouch = (event: TouchEvent): Touch | null => {
		const allTouches = [...event.touches, ...event.changedTouches];

		if (activeTouchId === null) {
			return allTouches[0] ?? null;
		}

		return allTouches.find((touch) => touch.identifier === activeTouchId) ?? null;
	};

	/* Checks whether an element is vertically scrollable */
	const isVerticallyScrollable = (element: HTMLElement) => {
		const { overflowY } = window.getComputedStyle(element);
		const allowsScroll = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';

		return allowsScroll && element.scrollHeight > element.clientHeight;
	};

	/*
	 * Decides whether the current gesture/movement is along the sheet axis (to decide whether drag / scroll)
	 * Uses a 45° line through the sheet to decide the movement
	 */
	const isSheetAxisGesture = (deltaX: number, deltaY: number, scrollTarget: HTMLElement) => {
		if (!scrollTarget) return null;

		const isHorizontal = sheetContext.position === 'left' || sheetContext.position === 'right';
		const dragDistance = Math.abs(isHorizontal ? deltaX : deltaY);
		const crossDistance = Math.abs(isHorizontal ? deltaY : deltaX);

		if (Math.atan2(crossDistance, dragDistance) * (180 / Math.PI) > 45) {
			return false;
		}
		return isHorizontal
			? scrollTarget.scrollHeight >= scrollTarget.clientHeight
			: scrollTarget.scrollWidth >= scrollTarget.clientWidth;
	};

	const getScrollableTarget = (target: EventTarget | null, fallback: HTMLDivElement) => {
		if (!(target instanceof HTMLElement) || !fallback.contains(target)) {
			return fallback;
		}

		let current: HTMLElement | null = target;
		while (current && current !== fallback) {
			if (isVerticallyScrollable(current)) {
				return current;
			}

			current = current.parentElement;
		}

		return fallback;
	};

	// Checks whether auto close isp ossible or not
	const canAutoClose = (currentHeight: number) => {
		return currentHeight < sheetContext.autoCloseThreshold && !sheetContext.isClosingDisabled;
	};

	// Calculations for the rubber band (smooth drag over limit)
	const rubberBand = (distance: number, dimension: number) => {
		if (sheetContext.isRubberbandDisabled || dimension <= 0) return 0;

		const overflow = Math.abs(distance);
		// Elastic limit is proportional to maxHeightInPx, capped at 60px
		const limit = Math.min(dimension * 0.1, 60);
		// Higher coefficient (0.35) ensures it slows down sharply
		const resistanceCoefficient = 0.35;

		const rubberized =
			(overflow * limit * resistanceCoefficient) / (limit + overflow * resistanceCoefficient);

		return Math.sign(distance) * Math.min(rubberized, limit);
	};

	// Handles the calculation for the new sheet position on move
	const sheetDragMovementHelper = (deltaDrag: number) => {
		const isReversed = sheetContext.position === 'top' || sheetContext.position === 'left';
		const rawOffset = offsetAtDragStart + (isReversed ? -deltaDrag : deltaDrag);
		let nextOffset = 0;

		nextOffset =
			rawOffset < 0
				? rubberBand(rawOffset, sheetContext.maxHeightInPx)
				: rawOffset > sheetContext.maxHeightInPx
					? sheetContext.maxHeightInPx +
						rubberBand(rawOffset - sheetContext.maxHeightInPx, sheetContext.maxHeightInPx)
					: rawOffset;

		const currentHeight = sheetContext.maxHeightInPx - nextOffset;

		// Check if we would below maxDragPoint and if yes, stop at the min
		if (currentHeight < sheetContext.maxDragPoint) {
			sheetContext.setSheetOffset(sheetContext.maxHeightInPx - sheetContext.maxDragPoint);
			return;
		}

		// While we drag, check which height we would get as result.
		// If below the autoCloseThreshod high wise, close the sheet immediately
		if (canAutoClose(currentHeight)) {
			cleanUpStates();
			sheetContext.closeSheet();
			return;
		}

		sheetContext.setSheetOffset(nextOffset);
	};

	// EVENT HANDLES

	/*
	  Handles the start of the mouse events for the sheet (e.g. desktop, mousepad)
	*/
	const handleMouseDown = (e: MouseEvent) => {
		if ((e.target as HTMLElement).closest('[data-sheet-nodrag]')) return;
		if (sheetContext.isDraggingDisabled) return;
		if (sheetContext.shouldOnlyTopSheetInteractive && !isTopSheet(sheetContext.sheetId)) return;
		//Only track left button
		if (e.button !== 0) return;

		// Add events
		window.addEventListener('mousemove', handleMouseMove, { passive: false });
		window.addEventListener('mouseup', handleSheetMoveEnd);

		handleSheetStart(e.clientX, e.clientY);
	};

	const handleMouseMove = (e: MouseEvent) => {
		let currentClientX = e.clientX;
		let currentClientY = e.clientY;
		sheetGestureMode = 'drag';

		const moveDeltaX = currentClientX - lastX;
		const moveDeltaY = currentClientY - lastY;
		lastX = currentClientX;
		lastY = currentClientY;

		let deltaDrag =
			sheetContext.position === 'bottom' || sheetContext.position === 'top'
				? currentClientY - startY
				: currentClientX - startX;

		e.preventDefault();
		e.stopPropagation();

		sheetDragMovementHelper(deltaDrag);
	};

	/*
	  Handles the start for the touch events for the sheet (e.g. touchscreen)
	*/
	const handleTouchStart = (e: TouchEvent) => {
		if ((e.target as HTMLElement).closest('[data-sheet-nodrag]')) return;
		if (sheetContext.isDraggingDisabled) return;
		if (sheetContext.shouldOnlyTopSheetInteractive && !isTopSheet(sheetContext.sheetId)) return;
		if (e.touches.length === 0) return;
		const activeTouch = e.touches[0];
		activeTouchId = activeTouch.identifier;

		// Add events
		window.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('touchend', handleSheetMoveEnd);
		window.addEventListener('touchcancel', handleSheetMoveEnd);

		handleSheetStart(activeTouch.clientX, activeTouch.clientY);
	};

	/*
	  Method which handles all different start operation
	*/
	const handleSheetStart = (startXPos: number, startYPos: number) => {
		sheetGestureMode = 'pending';

		startX = lastX = startXPos;
		startY = lastY = startYPos;
		offsetAtDragStart = sheetContext.sheetOffsetInPx;
		sheetContext.onSheetDragStart();
	};

	/*
	  Method which handles the drag opterations during touch move
	*/
	const handleTouchMove = (e: TouchEvent) => {
		const activeTouch = getTrackedTouch(e);
		if (!activeTouch) return;
		if (sheetContext.contentElement === null) return;

		let currentClientX = activeTouch.clientX;
		let currentClientY = activeTouch.clientY;

		const moveDeltaX = currentClientX - lastX;
		const moveDeltaY = currentClientY - lastY;
		lastX = currentClientX;
		lastY = currentClientY;

		let deltaDrag =
			sheetContext.position === 'bottom' || sheetContext.position === 'top'
				? currentClientY - startY
				: currentClientX - startX;

		let eventTarget = e.target as HTMLElement;
		let scrollableTargetElement = getScrollableTarget(eventTarget, sheetContext.contentElement);
		const canTakeOver = isSheetAxisGesture(moveDeltaX, moveDeltaY, scrollableTargetElement);

		// Decides whether we start scrolling or dragiing
		if (sheetGestureMode === 'pending') {
			const isDragStartingInsideContent =
				eventTarget.closest('[data-bottomsheet-content]') !== null;

			const isScrollMovement = isScrollMovementInContainer(scrollableTargetElement, deltaDrag);

			const shouldStartDragging = !isDragStartingInsideContent || !isScrollMovement;

			// When it does not start inside content (e.g. handle) or is not scrolling gesture
			// go to drag
			if (shouldStartDragging && canTakeOver) {
				sheetGestureMode = 'drag';
			} else {
				sheetGestureMode = 'scroll';
			}
		}

		if (sheetGestureMode !== 'drag') return;
		sheetContext.onSheetDrag();
		e.preventDefault();
		e.stopPropagation();

		sheetDragMovementHelper(deltaDrag);
	};

	/*
	  Universal which handles the last calculation s when the sheet is being let go off
	*/
	const handleSheetMoveEnd = () => {
		// If we weren't dragging (e..g nothing, or scrolling), just clean up
		if (sheetGestureMode !== 'drag') {
			// Clean up States
			cleanUpStates();
			return;
		}

		sheetContext.onSheetDragEnd();

		// If above the maxheight (rubberband), jump backto offset 0 (top)
		if (sheetContext.sheetOffsetInPx < 0) {
			cleanUpStates();

			const { snapPoints, maxHeightInPx } = sheetContext;

			if (snapPoints.length > 0) {
				const highestSnapPoint = Math.max(...snapPoints);
				sheetContext.setSheetOffset(maxHeightInPx - highestSnapPoint);
				sheetContext.onSnap(highestSnapPoint);
			} else {
				sheetContext.setSheetOffset(0);
			}

			return;
		}

		if (sheetContext.sheetOffsetInPx > sheetContext.maxHeightInPx) {
			cleanUpStates();
			if (!sheetContext.isClosingDisabled) {
				sheetContext.closeSheet();
			} else {
				sheetContext.setSheetOffset(sheetContext.maxHeightInPx);
			}
			return;
		}

		const {
			snapPoints,
			maxHeightInPx,
			maxDragPoint,
			isClosingDisabled,
			closeThreshold,
			sheetOffsetInPx
		} = sheetContext;
		const currentOffset = sheetOffsetInPx;
		const currentHeight = maxHeightInPx - currentOffset;

		if (sheetContext.snapPoints.length > 0) {
			const lowestSnapPoint = Math.min(...snapPoints);

			if (currentHeight < lowestSnapPoint) {
				cleanUpStates();
				if (isClosingDisabled) {
					sheetContext.setSheetOffset(maxHeightInPx - lowestSnapPoint);
				} else {
					sheetContext.closeSheet();
				}
				return;
			}

			const isMovingUp = sheetContext.sheetOffsetInPx < offsetAtDragStart;
			const buffer = measurementToPx(0.05, maxHeightInPx);
			// Snap back to the starting point if the movement is within the buffer.
			const shouldSnapBack =
				(isMovingUp && offsetAtDragStart <= sheetOffsetInPx + buffer) ||
				(!isMovingUp && offsetAtDragStart >= sheetOffsetInPx - buffer);

			if (shouldSnapBack) {
				cleanUpStates();
				sheetContext.setSheetOffset(offsetAtDragStart);
				return;
			}

			const candidates = snapPoints.filter((point) =>
				isMovingUp ? point >= currentHeight : point <= currentHeight && point >= maxDragPoint
			);
			// No valid snap points: return to the starting position.
			if (candidates.length === 0) {
				cleanUpStates();
				sheetContext.setSheetOffset(offsetAtDragStart);
				return;
			} else {
				// Moving up: choose the smallest eligible point.
				// Moving down: choose the largest eligible point.
				const targetSnapPoint = isMovingUp ? Math.min(...candidates) : Math.max(...candidates);
				sheetContext.setSheetOffset(maxHeightInPx - targetSnapPoint);
				sheetContext.onSnap(targetSnapPoint);
				cleanUpStates();
				return;
			}
		}

		// If we got no snappoints, we will check here if we are below threshold to check if close or not
		if (currentHeight < closeThreshold && !isClosingDisabled) {
			sheetContext.closeSheet();
		} else {
			// Don't close it
			sheetContext.setSheetOffset(0);
		}

		cleanUpStates();
	};

	const handleTransitionEnd = () => {
		// If they have the same value, it means the sheet is at the bottom and should close finally
		if (sheetContext.sheetOffsetInPx >= sheetContext.maxHeightInPx) {
			sheetContext.finalCloseSheet();
		}
	};

	const cleanUpStates = () => {
		sheetGestureMode = 'idle';
		activeTouchId = null;

		if (typeof window === 'undefined') return;
		// Cleanup all potential listeners
		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handleSheetMoveEnd);
		window.removeEventListener('touchcancel', handleSheetMoveEnd);
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleSheetMoveEnd);
	};

	/*
	  Handles on different styles for the different positions the bottom sheet could have.
	*/
	const getPositionStyle = () => {
		const maxDimension = `${sheetContext.maxHeightInPx}px`;
		const offsetInPx = sheetContext.sheetOffsetInPx;
		const dimension = sheetContext.fitContent ? 'fit-content' : '100%';
		const sideOffset = sheetContext.sheetSideOffsetInPx;

		switch (sheetContext.position) {
			case 'bottom':
				return {
					'flex-direction': 'column',
					bottom: 0,
					left: 0,
					right: 0,
					height: dimension,
					maxHeight: maxDimension,
					transform: `translateY(${offsetInPx - sideOffset}px)`
				};
			case 'top':
				return {
					'flex-direction': 'column',
					top: 0,
					left: 0,
					right: 0,
					height: dimension,
					maxHeight: maxDimension,
					transform: `translateY(${-offsetInPx + sideOffset}px)`
				};
			case 'left':
				return {
					left: 0,
					top: 0,
					width: dimension,
					maxWidth: maxDimension,
					transform: `translateX(${-offsetInPx + sideOffset}px)`
				};
			case 'right':
				return {
					right: 0,
					top: 0,
					width: dimension,
					maxWidth: maxDimension,
					transform: `translateX(${offsetInPx - sideOffset}px)`
				};
		}
	};

	const portal = withPortal();

	const mergedProps = $derived(
		mergeProps(
			{
				role: 'dialog',
				tabindex: '-1',
				'data-bottomsheet-sheet': '',
				'aria-modal': isModal ? 'true' : undefined,
				'data-position': sheetContext.position,
				'data-state': sheetContext.isSheetOpenInternal ? 'open' : 'closed',
				'data-modal': String(isModal),
				'data-gesture': sheetGestureMode,
				style: {
					position: 'fixed',
					display: 'flex',
					'touch-action': 'none',
					'will-change': sheetGestureMode === 'drag' ? 'transform' : '',
					'overscroll-behavior': 'contain',
					'-webkit-overflow-scrolling': 'touch',
					'user-select': sheetGestureMode === 'drag' ? 'none' : '',
					'-webkit-user-select': sheetGestureMode === 'drag' ? 'none' : '',
					transition:
						sheetGestureMode === 'drag'
							? ''
							: `transform ${sheetContext.sheetAnimation.durationInMs}ms ${sheetContext.sheetAnimation.easing}`,

					...getPositionStyle()
				},
				class: 'sheet-container',
				ontouchstart: handleTouchStart,
				onmousedown: handleMouseDown,
				ontransitionend: handleTransitionEnd
			},
			rest,
			withRef((el) => {
				ref = el as HTMLDivElement;
				sheetContext.setSheetElement(el as HTMLDivElement);
			}),
			portal
		)
	);

	onDestroy(() => {
		cleanUpStates();
	});
</script>

{#if sheetContext.isSheetOpenInternal}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else if children}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}

<style>
	.sheet-container[data-position='top']::before,
	.sheet-container[data-position='bottom']::after,
	.sheet-container[data-position='left']::before,
	.sheet-container[data-position='right']::after {
		content: '';
		position: absolute;
		background-color: inherit;
		pointer-events: none;
	}

	.sheet-container[data-position='top']::before {
		bottom: 100%;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.sheet-container[data-position='bottom']::after {
		top: 100%;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.sheet-container[data-position='left']::before {
		top: 0;
		right: 100%;
		width: 100%;
		height: 100%;
	}

	.sheet-container[data-position='right']::after {
		top: 0;
		left: 100%;
		width: 100%;
		height: 100%;
	}
</style>
