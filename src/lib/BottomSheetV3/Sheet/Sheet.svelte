<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withPortal } from '$lib/utils/portal.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import { type Snippet, untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSheetContext } from '../context.js';
	import { preventScroll } from '$lib/utils/preventOusideInteraction.js';
	import { measurementToPx } from '$lib/utils/other.js';
	import { clickOutside } from '$lib/utils/click-outside.js';
	import { focusUtils } from '$lib/utils/focus.js';

	let {
		ref = $bindable(),
		children,
		child,
		...rest
	}: {
		ref?: HTMLDivElement;
		children?: Snippet<[]>;
		child?: Snippet<[{ props: Record<string, any> }]>;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getSheetContext();

	type GestureMode = 'idle' | 'pending' | 'scroll' | 'drag';

	const DRAG_START_THRESHOLD = 4;
	const SCROLL_EDGE_EPSILON = 1;

	let rerenderTrigger = $state(false);

	let gestureMode: GestureMode = 'idle';
	let startY = 0;
	let lastY = 0;
	let startTranslateY = 0;
	let activeScrollTarget: HTMLElement | null = null;
	let activeTouchId: number | null = null;
	let stopGlobalTouchMoveBlock: (() => void) | null = null;

	const isVerticallyScrollable = (element: HTMLElement) => {
		const { overflowY } = window.getComputedStyle(element);
		const allowsScroll = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';

		return allowsScroll && element.scrollHeight > element.clientHeight;
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

	const canScrollForDelta = (element: HTMLElement, deltaY: number) => {
		let scrollTop = 0;
		let scrollHeight = 0;
		let elementHeight = 0;

		switch (sheetContext.position) {
			case 'top':
			case 'bottom':
				scrollTop = element.scrollTop;
				scrollHeight = element.scrollHeight;
				elementHeight = element.clientHeight;
				break;
			case 'left':
			case 'right':
				scrollTop = element.scrollLeft;
				scrollHeight = element.scrollWidth;
				elementHeight = element.clientWidth;
				break;
		}

		const atTop = scrollTop <= SCROLL_EDGE_EPSILON;
		const atBottom = scrollHeight - elementHeight - scrollTop <= SCROLL_EDGE_EPSILON;

		if (deltaY > 0) {
			return !atTop;
		}

		if (deltaY < 0) {
			return !atBottom;
		}

		return false;
	};

	const getTrackedTouch = (event: TouchEvent): Touch | null => {
		const allTouches = [...event.touches, ...event.changedTouches];

		if (activeTouchId === null) {
			return allTouches[0] ?? null;
		}

		return allTouches.find((touch) => touch.identifier === activeTouchId) ?? null;
	};

	const setupGlobalTouchMoveBlock = () => {
		if (stopGlobalTouchMoveBlock) return;

		const stopBodyScrollWhileDragging = (event: TouchEvent) => {
			if (gestureMode !== 'drag') return;
			if (event.cancelable) {
				event.preventDefault();
			}
		};

		document.addEventListener('touchmove', stopBodyScrollWhileDragging, {
			capture: true,
			passive: false
		});

		stopGlobalTouchMoveBlock = () => {
			document.removeEventListener('touchmove', stopBodyScrollWhileDragging, true);
			stopGlobalTouchMoveBlock = null;
		};
	};

	const startDragGesture = () => {
		sheetContext.onSheetDragStart();
		gestureMode = 'drag';
		sheetContext.isDragging = true;
		setupGlobalTouchMoveBlock();
	};

	const endGesture = () => {
		if (gestureMode === 'drag') {
			sheetContext.onSheetDragEnd();
			const currentTranslate = sheetContext.translateY;
			const currentHeight = sheetContext.maxHeight - currentTranslate;

			if (sheetContext.snapPoints.length > 0) {
				const snapPoints = sheetContext.snapPoints;
				// Close if we are below the lowest snappoint
				const lowestSnappoint = Math.min(...snapPoints);

				if (currentHeight < lowestSnappoint && !sheetContext.disableClosing) {
					sheetContext.translateY = sheetContext.maxHeight;
					cleanUpStates();
					return;
				} else if (currentHeight < lowestSnappoint && sheetContext.disableClosing) {
					sheetContext.translateY = sheetContext.maxHeight - lowestSnappoint;
					cleanUpStates();
					return;
				}

				const isMovingUp = sheetContext.translateY < startTranslateY;
				const buffer = measurementToPx(0.05, sheetContext.maxHeight);

				// If the sheet is less than 5% below/up a point, snap back to the beginning
				if (
					(isMovingUp && startTranslateY <= currentTranslate + buffer) ||
					(!isMovingUp && startTranslateY >= currentTranslate - buffer)
				) {
					sheetContext.translateY = startTranslateY;
					cleanUpStates();
					return;
				}

				const candidates = snapPoints.filter((point) =>
					isMovingUp
						? point >= currentHeight
						: point <= currentHeight && point >= sheetContext.maxDragPoint
				);

				// Candiates can be null if there are snappoints below the maxDragPoint
				if (candidates.length === 0) {
					sheetContext.translateY = startTranslateY;
				} else {
					// When going up, the lowest candidate is the one we want to go to
					// When going down, the biggest is the nearest
					const closestCandidate = isMovingUp ? Math.min(...candidates) : Math.max(...candidates);
					sheetContext.translateY = sheetContext.maxHeight - closestCandidate;
					sheetContext.onSnap(sheetContext.translateY);
				}
			} else {
				// Close normal because no snappoints
				if (!sheetContext.disableClosing) {
					sheetContext.translateY =
						currentHeight < sheetContext.closeTreshold ? sheetContext.maxHeight : 0;
				} else {
					sheetContext.translateY = 0;
				}
			}
		}

		cleanUpStates();
	};

	const cleanUpStates = () => {
		sheetContext.isDragging = false;
		gestureMode = 'idle';
		activeScrollTarget = null;
		activeTouchId = null;
		stopGlobalTouchMoveBlock?.();
	};

	$effect(() => {
		let unblock: () => void;
		let trapCleanup: () => void;
		if (ref) {
			if (!sheetContext.disableFocusTrap) {
				focusUtils
					.trap(ref, {
						autoFocus: true,
						restoreFocus: true
					})
					.then((cleanup) => {
						trapCleanup = cleanup;
					});
			}
			ref.addEventListener('touchmove', touchMove, { passive: false });
			document.addEventListener('keydown', handleGlobalKeyDown);
			if (sheetContext.disableBackgroundInteraction) {
				unblock = preventScroll(ref);
			}
		}

		const contentEl = sheetContext.contentElement;
		const cancelScroll = (e: TouchEvent) => {
			if (gestureMode === 'drag' && e.cancelable) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		if (contentEl) {
			contentEl.addEventListener('touchmove', cancelScroll, { passive: false, capture: true });
		}

		return () => {
			if (contentEl) {
				contentEl.removeEventListener('touchmove', cancelScroll, true);
			}
			document.removeEventListener('keydown', handleGlobalKeyDown);
			ref?.removeEventListener('touchmove', touchMove);
			stopGlobalTouchMoveBlock?.();
			unblock?.();
			trapCleanup?.();
		};
	});

	const handleGlobalKeyDown = (event: KeyboardEvent) => {
		if (sheetContext.disableClosing || sheetContext.disableEscape) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			sheetContext.translateY = sheetContext.maxHeight;
		}
	};

	$effect(() => {
		if (sheetContext.disableClickOutside) return;
		if (!ref) return;

		const { destroy } = clickOutside(ref, handleOutsideClick);
		return () => {
			destroy();
		};
	});

	const handleOutsideClick = () => {
		if (sheetContext.isSheetOpen && !sheetContext.disableClosing) {
			// Trigger close animation, ontransition end will handle unmount
			sheetContext.translateY = sheetContext.maxHeight;
		}
	};

	const mouseStart = (e: MouseEvent) => {
		if (sheetContext.disableDragging) return;
		// Only track left click
		if (e.button !== 0) return;

		switch (sheetContext.position) {
			case 'bottom':
			case 'top':
				startY = e.clientY;
				lastY = e.clientY;
				break;
			case 'left':
			case 'right':
				startY = e.clientX;
				lastY = e.clientX;
				break;
		}

		startTranslateY = sheetContext.translateY;
		gestureMode = 'pending';
		activeScrollTarget = null;
		sheetContext.isDragging = false;

		window.addEventListener('mousemove', mouseMove);
		window.addEventListener('mouseup', mouseEnd);
	};

	const mouseMove = (e: MouseEvent) => {
		const contentEl = sheetContext.contentElement;
		if (!contentEl) return;

		let currentActiveMouse = 0;
		switch (sheetContext.position) {
			case 'bottom':
			case 'top':
				currentActiveMouse = e.clientY;
				break;
			case 'left':
			case 'right':
				currentActiveMouse = e.clientX;
				break;
		}

		const deltaY = currentActiveMouse - startY;
		const stepDeltaY = currentActiveMouse - lastY;
		lastY = currentActiveMouse;

		if (gestureMode === 'pending' && Math.abs(deltaY) < DRAG_START_THRESHOLD) {
			return;
		}

		if (gestureMode === 'pending') {
			startDragGesture();
		}

		if (gestureMode !== 'drag') {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		let nextTranslateY = 0;
		switch (sheetContext.position) {
			case 'bottom':
			case 'right':
				nextTranslateY = Math.max(0, Math.min(startTranslateY + deltaY, sheetContext.maxHeight));
				break;
			case 'top':
			case 'left':
				nextTranslateY = -Math.min(0, Math.min(-startTranslateY + deltaY, sheetContext.maxHeight));
				break;
		}

		const currentHeight = sheetContext.maxHeight - nextTranslateY;
		if (currentHeight < sheetContext.autoCloseTreshold && !sheetContext.disableClosing) {
			sheetContext.translateY = sheetContext.maxHeight;
			window.removeEventListener('mousemove', mouseMove);
			window.removeEventListener('mouseup', mouseEnd);
			cleanUpStates();
			return;
		}

		if (currentHeight < sheetContext.maxDragPoint) {
			nextTranslateY = sheetContext.maxHeight - sheetContext.maxDragPoint;
		}
		sheetContext.onSheetDrag();
		sheetContext.translateY = nextTranslateY;
	};

	const mouseEnd = () => {
		window.removeEventListener('mousemove', mouseMove);
		window.removeEventListener('mouseup', mouseEnd);
		endGesture();
	};

	const touchStart = (e: TouchEvent) => {
		if (sheetContext.disableDragging) return;
		if (e.touches.length === 0) return;

		const activeTouch = e.touches[0];
		activeTouchId = activeTouch.identifier;

		switch (sheetContext.position) {
			case 'bottom':
			case 'top':
				startY = activeTouch.clientY;
				lastY = activeTouch.clientY;
				break;
			case 'left':
			case 'right':
				startY = activeTouch.clientX;
				lastY = activeTouch.clientX;
				break;
		}

		startTranslateY = sheetContext.translateY;
		gestureMode = 'pending';
		activeScrollTarget = null;
		sheetContext.isDragging = false;
	};

	const touchMove = (e: TouchEvent) => {
		const activeTouch = getTrackedTouch(e);
		if (!activeTouch) return;

		const contentEl = sheetContext.contentElement;

		if (!contentEl) return;

		let currentActiveTouch = 0;

		switch (sheetContext.position) {
			case 'bottom':
			case 'top':
				currentActiveTouch = activeTouch.clientY;
				break;
			case 'left':
			case 'right':
				currentActiveTouch = activeTouch.clientX;
				break;
		}

		const deltaY = currentActiveTouch - startY;
		const stepDeltaY = currentActiveTouch - lastY;
		lastY = currentActiveTouch;

		if (gestureMode === 'pending' && Math.abs(deltaY) < DRAG_START_THRESHOLD) {
			return;
		}

		if (gestureMode === 'pending') {
			const scrollTarget = getScrollableTarget(e.target, contentEl);

			let startsInsideContent = e.target instanceof Node && contentEl.contains(e.target);

			const shouldStartDraggingSheet =
				!startsInsideContent || (deltaY > 0 && !canScrollForDelta(scrollTarget, deltaY));

			if (shouldStartDraggingSheet) {
				startDragGesture();
			} else {
				gestureMode = 'scroll';

				activeScrollTarget = scrollTarget;
			}
		}

		// Scrolltakeover lets you go from scrolling to dragging
		if (gestureMode === 'scroll' && sheetContext.enableScrollDragTakeover) {
			let scrollTarget = activeScrollTarget ?? getScrollableTarget(e.target, contentEl);

			activeScrollTarget = scrollTarget;

			const shouldTakeOverForDrag = stepDeltaY > 0 && !canScrollForDelta(scrollTarget, stepDeltaY);

			if (shouldTakeOverForDrag) {
				startDragGesture();
				// Trigger a rerender
				// It is used in mergeProps, which causes it to rerender / remount removing the active scroll
				rerenderTrigger = true;
				rerenderTrigger = false;
				if (scrollTarget) {
					lockScrollTop = scrollTarget.scrollTop;
				}
				startY = activeTouch.clientY;

				startTranslateY = sheetContext.translateY;
			}
		}

		if (gestureMode !== 'drag') {
			return;
		}

		if (e.cancelable) {
			e.preventDefault();
		}
		e.stopPropagation();

		let nextTranslateY = 0;
		switch (sheetContext.position) {
			case 'bottom':
			case 'right':
				nextTranslateY = Math.max(0, Math.min(startTranslateY + deltaY, sheetContext.maxHeight));
				break;
			case 'top':
			case 'left':
				nextTranslateY = -Math.min(0, Math.min(-startTranslateY + deltaY, sheetContext.maxHeight));
				break;
		}

		const currentHeight = sheetContext.maxHeight - nextTranslateY;
		// Check if we get below the autoCloseTreshold, if yes, close
		if (currentHeight < sheetContext.autoCloseTreshold && !sheetContext.disableClosing) {
			sheetContext.translateY = sheetContext.maxHeight;
			cleanUpStates();
			return;
		}

		// Check if we would below maxDragPoint and if yes, stop

		if (currentHeight < sheetContext.maxDragPoint) {
			nextTranslateY = sheetContext.maxHeight - sheetContext.maxDragPoint;
		}
		sheetContext.onSheetDrag();
		sheetContext.translateY = nextTranslateY;
	};

	const touchEnd = () => {
		endGesture();
	};

	const touchCancel = () => {
		endGesture();
	};

	const handleTransitionEnd = (e: TransitionEvent) => {
		// When the close transition finishes, toggle it to off
		if (e.propertyName === 'transform' && sheetContext.translateY >= sheetContext.maxHeight) {
			sheetContext.toggleSheet();
		}
	};

	const transformStyle = () => {
		switch (sheetContext.position) {
			case 'bottom':
				return `translateY(${sheetContext.translateY}px)`;
			case 'top':
				return `translateY(-${sheetContext.translateY}px)`;
			case 'left':
				return `translateX(-${sheetContext.translateY}px)`;
			case 'right':
				return `translateX(${sheetContext.translateY}px)`;
		}
	};

	const positionStyle = () => {
		switch (sheetContext.position) {
			case 'bottom':
				return { left: 0, bottom: 0, right: 0, height: `${sheetContext.maxHeight}px` };
			case 'top':
				return { top: 0, left: 0, right: 0, height: `${sheetContext.maxHeight}px` };
			case 'left': {
				return {
					top: 0,
					left: 0,
					width: `${sheetContext.maxHeight}px`,
					height: `100%`
				};
			}
			case 'right': {
				return { top: 0, right: 0, width: `${sheetContext.maxHeight}px`, height: `100%` };
			}
		}
	};

	const mergedProps = $derived(
		mergeProps(
			{
				id: sheetContext.contentId,
				role: 'dialog',
				'aria-modal': 'true',
				'data-state': sheetContext.isSheetOpen ? 'open' : 'closed',
				'data-position': sheetContext.position,
				'data-bottomsheet-sheet': '',
				'data-rerender-active': rerenderTrigger ? '' : undefined,
				onmousedown: mouseStart,
				ontouchstart: touchStart,
				ontouchend: touchEnd,
				ontouchcancel: touchCancel,
				ontransitionend: handleTransitionEnd,
				style: {
					position: 'fixed',
					height: `${sheetContext.maxHeight}px`,
					left: 0,
					bottom: 0,
					right: 0,
					margin: '0 auto',
					'z-index': 100,
					'overscroll-behavior': 'contain',
					'overscroll-behavior-y': 'contain'
				}
			},
			rest,
			withRef((el) => (ref = el as HTMLDivElement)),
			withPortal()
		)
	);

	// Direct performance-optimized DOM mutation side effect
	$effect(() => {
		if (!ref) return;

		ref.style.transform = transformStyle();
		ref.style.transition = sheetContext.isDragging
			? 'none'
			: 'transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)';
		ref.style.userSelect = sheetContext.isDragging ? 'none' : '';
	});

	$effect(() => {
		return () => {
			window.removeEventListener('mousemove', mouseMove);
			window.removeEventListener('mouseup', mouseEnd);
		};
	});
</script>

{#if sheetContext.isSheetOpen}
	{#if child}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
