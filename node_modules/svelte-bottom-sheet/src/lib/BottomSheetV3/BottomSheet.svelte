<script lang="ts">
	import type { BottomSheetProps } from './types.ts';
	import { registerOpenSheet, setSheetContext } from './context.js';
	import { innerWidth } from 'svelte/reactivity/window';
	import { measurementToPx } from '#lib/utils/other.js';
	import { unregisterOpenSheet } from '#lib/BottomSheetV3/context.js';
	import { untrack } from 'svelte';

	let {
		children,
		isSheetOpen = $bindable(false),
		maxHeight = 0.9,
		position = 'bottom',
		disableClosing = false,
		closeThreshold = 0.8,
		autoCloseThreshold = 0,
		snapPoints = [1],
		maxDragPoint = -0.1,
		fitContent = false,
		startingSnapPoint,
		disableBackgroundInteraction = true,
		disableClickOutside = false,
		disableFocusTrap = false,
		disableEscape = false,
		disableRubberband = false,
		disableDragging = false,
		sheetSideOffset = 0,
		sheetAnimation = {
			durationInMs: 500,
			easing: 'cubic-bezier(0.30, 0.94, 0.6, 1)'
		},
		overlayAnimation = {
			durationInMs: 500,
			easing: 'cubic-bezier(0.30, 0.94, 0.6, 1)'
		},
		onlyTopSheetInteractive = true,
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		onsnap
	}: BottomSheetProps = $props();

	// Internally, the sheet stays longer open to play transition than the outer state
	let isSheetOpenInternal = $state(false);
	let sheetOffsetInPx = $state(0);
	let contentElement: HTMLDivElement | null = $state(null);
	let sheetElement: HTMLDivElement | null = $state(null);

	let openAnimationFrame = 0;
	let sheetId = `bottomsheet-${Math.random().toString(36).substring(2, 9)}`;

	let viewportHeight = $state(0);

	const updateHeight = () => {
		viewportHeight = window.visualViewport?.height ?? window.innerHeight;
	};

	$effect(() => {
		window.visualViewport?.addEventListener('resize', updateHeight);
		window.visualViewport?.addEventListener('scroll', updateHeight);
		updateHeight();

		return () => {
			window.visualViewport?.removeEventListener('resize', updateHeight);
			window.visualViewport?.removeEventListener('scroll', updateHeight);
		};
	});

	// Observer for height of shheet when fit-content is active
	$effect(() => {
		if (!fitContent || !sheetElement) return;

		const observer = new ResizeObserver(([entry]) => {
			if (entry) {
				const isSidePosition = position === 'left' || position === 'right';

				if (isSidePosition) {
					maxHeightInPx = entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width;
				} else {
					maxHeightInPx = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height;
				}
			}
		});

		observer.observe(sheetElement);
		return () => observer.disconnect();
	});

	let maxHeightInPx = $derived.by(() => {
		if (maxHeight > 1) {
			return maxHeight;
		} else {
			const isSidePosition = position === 'left' || position === 'right';
			const currentWidth = innerWidth.current ?? 0;
			const dimension = isSidePosition ? currentWidth : viewportHeight;

			return dimension * maxHeight;
		}
	});

	// If we got a starting snappoint and it's included, use it, else throw it away and start at top
	const startHeightInPx = $derived(
		startingSnapPoint && snapPoints.includes(startingSnapPoint)
			? measurementToPx(startingSnapPoint, maxHeightInPx)
			: maxHeightInPx
	);

	// Conversions of the [0..1, px] number format to coordinates relative to maxHeight
	const convertedCloseTreshold = $derived(measurementToPx(closeThreshold, maxHeightInPx));
	const convertedAutoCloseTreshold = $derived(measurementToPx(autoCloseThreshold, maxHeightInPx));
	const convertedMaxDragPoint = $derived(measurementToPx(maxDragPoint, maxHeightInPx));
	const convertedSnappoints = $derived(
		snapPoints.map((point) => measurementToPx(point, maxHeightInPx))
	);

	$effect(() => {
		const shouldOpen = isSheetOpen;

		untrack(() => {
			if (shouldOpen) {
				onopen?.();
				openSheet();
			} else {
				onclose?.();
				closeSheet();
			}
		});
	});

	const openSheet = () => {
		cancelAnimationFrame(openAnimationFrame);

		isSheetOpenInternal = true;
		registerOpenSheet(sheetId);

		openAnimationFrame = requestAnimationFrame(() => {
			// Don't apply an opening position after a newer close request.
			if (!isSheetOpen) return;

			sheetOffsetInPx = maxHeightInPx - startHeightInPx;
		});
	};

	const closeSheet = () => {
		cancelAnimationFrame(openAnimationFrame);
		openAnimationFrame = 0;

		sheetOffsetInPx = maxHeightInPx + sheetSideOffset;
	};

	setSheetContext({
		get position() {
			return position;
		},
		get maxHeightInPx() {
			return maxHeightInPx;
		},
		get isSheetOpenInternal() {
			return isSheetOpenInternal;
		},
		get sheetOffsetInPx() {
			return sheetOffsetInPx;
		},
		get closeThreshold() {
			return convertedCloseTreshold;
		},
		get isClosingDisabled() {
			return disableClosing;
		},

		get autoCloseThreshold() {
			return convertedAutoCloseTreshold;
		},
		get maxDragPoint() {
			return convertedMaxDragPoint;
		},
		get snapPoints() {
			return convertedSnappoints;
		},
		get fitContent() {
			return fitContent;
		},
		get isFocusTrappedDisabled() {
			return disableFocusTrap;
		},
		get isBackgroundInteractionDisabled() {
			return disableBackgroundInteraction;
		},
		get isClickOutsideClosingDisabled() {
			return disableClickOutside;
		},
		get isEscapeClosingDisabled() {
			return disableEscape;
		},
		get isRubberbandDisabled() {
			return disableRubberband;
		},
		get isDraggingDisabled() {
			return disableDragging;
		},
		get contentElement() {
			return contentElement;
		},
		get sheetAnimation() {
			return sheetAnimation;
		},
		get overlayAnimation() {
			return overlayAnimation;
		},
		get sheetId() {
			return sheetId;
		},
		get shouldOnlyTopSheetInteractive() {
			return onlyTopSheetInteractive;
		},
		get sheetSideOffsetInPx() {
			return sheetSideOffset;
		},
		get sheetElement() {
			return sheetElement;
		},
		setSheetElement: (newElement: HTMLDivElement | null) => (sheetElement = newElement),
		setContentElement: (newElement: HTMLDivElement | null) => (contentElement = newElement),
		setSheetOffset: (offsetInPx) => (sheetOffsetInPx = offsetInPx),
		closeSheet: () => (isSheetOpen = false),
		// Function being called after transition has finished to change internal state
		finalCloseSheet: () => {
			isSheetOpenInternal = false;
			unregisterOpenSheet(sheetId);
		},
		toggleSheet: () => {
			isSheetOpen = !isSheetOpen;
		},
		onSnap: (point: number) => {
			onsnap?.(point);
		},
		onSheetDrag: () => {
			onsheetdrag?.();
		},
		onSheetDragStart: () => {
			onsheetdragstart?.();
		},
		onSheetDragEnd: () => {
			onsheetdragend?.();
		}
	});
</script>

{@render children()}
