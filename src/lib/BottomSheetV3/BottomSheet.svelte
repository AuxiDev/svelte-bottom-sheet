<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import type { Snippet } from 'svelte';
	import { setSheetContext } from './context.js';
	import { measurementToPx } from '$lib/utils/other.js';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import type { SheetPositions } from './index.js';

	let {
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		onsnap,
		isSheetOpen = $bindable(false),
		closeThreshold = 0.9,
		disableBackgroundInteraction = false,
		disableClickOutside = false,
		disableFocusTrap = false,
		disableEscape = false,
		autoCloseThreshold = 0.1,
		maxHeight = 0.7,
		snapPoints = [1],
		startingSnapPoint,
		disableDragging = false,
		position = 'bottom',
		disableClosing = false,
		maxDragPoint = -0.1,
		enableScrollDragTakeover = true,
		child,
		children,
		...rest
	}: {
		onopen?: () => void;
		onclose?: () => void;
		onsheetdrag?: () => void;
		onsheetdragstart?: () => void;
		onsheetdragend?: () => void;
		onsnap?: (point: number) => void;
		isSheetOpen?: boolean;
		closeThreshold?: number;
		disableBackgroundInteraction?: boolean;
		autoCloseThreshold?: number;
		maxHeight?: number;
		snapPoints?: number[];
		startingSnapPoint?: number;
		disableDragging?: boolean;
		position?: SheetPositions;
		disableClosing?: boolean;
		maxDragPoint?: number;
		enableScrollDragTakeover?: boolean;
		disableClickOutside?: boolean;
		disableFocusTrap?: boolean;
		disableEscape?: boolean;
		child?: Snippet<[{ props: Record<string, any> }]>;
		children?: Snippet<[]>;
	} = $props();

	let maxHeightPx = $state(0);

	let contentElement: HTMLDivElement | null = $state(null);
	let translateY = $state(0);
	let isDragging = $state(false);

	const startHeight = $derived(
		startingSnapPoint ? measurementToPx(startingSnapPoint, maxHeightPx) : maxHeightPx
	);
	const convertedSnappoints = $derived(snapPoints.map((p) => measurementToPx(p, maxHeightPx)));
	const convertedCloseTreshold = $derived(measurementToPx(closeThreshold, maxHeightPx));
	const convertedAutoCloseTreshold = $derived(measurementToPx(autoCloseThreshold, maxHeightPx));
	const convertedMaxDragPoint = $derived(measurementToPx(maxDragPoint, maxHeightPx));

	const contentId = `bottomsheet-content-${Math.random().toString(36).substring(2, 9)}`;
	const triggerId = `bottomsheet-trigger-${Math.random().toString(36).substring(2, 9)}`;

	$effect(() => {
		if (maxHeight > 1) {
			maxHeightPx = maxHeight;
		} else {
			const isSidePosition = position === 'left' || position === 'right';
			const dimension = isSidePosition ? (innerWidth.current ?? 0) : (innerHeight.current ?? 0);

			maxHeightPx = dimension * maxHeight;
		}

		if (isSheetOpen) {
			onopen?.();
			translateY = maxHeightPx - startHeight;
		} else {
			onclose?.();
			// Reset for next time
			translateY = maxHeightPx;
		}
	});

	/**
	 * Allows you to change the snap-point a snap-able sheet is snapped to.
	 * You can only snap the sheet to snap-points defined in the settings.
	 * @param {number} point - The point you want to snap to.
	 * @param {boolean} throwEvent [OPTIONAL] - Whether a onsnap event is emitted or not. Default: true
	 * @returns {boolean} Whether the snap was sucessful or not.
	 */
	export const setSnapPoint = (point: number, throwEvent: boolean = true): boolean => {
		if (snapPoints.includes(point)) {
			translateY = maxHeightPx - measurementToPx(point, maxHeightPx);
			if (throwEvent) {
				onsnap?.(point);
			}
			return true;
		}
		return false;
	};

	setSheetContext({
		get startHeight() {
			return startHeight;
		},
		get maxHeight() {
			return maxHeightPx;
		},
		get isSheetOpen() {
			return isSheetOpen;
		},
		toggleSheet: () => {
			isSheetOpen = !isSheetOpen;
		},
		get contentElement() {
			return contentElement;
		},
		set contentElement(el: HTMLDivElement | null) {
			contentElement = el;
		},
		get translateY() {
			return translateY;
		},
		set translateY(value: number) {
			translateY = value;
		},
		get isDragging() {
			return isDragging;
		},
		set isDragging(value: boolean) {
			isDragging = value;
		},
		get enableScrollDragTakeover() {
			return enableScrollDragTakeover;
		},
		get contentId() {
			return contentId;
		},
		get triggerId() {
			return triggerId;
		},
		get disableBackgroundInteraction() {
			return disableBackgroundInteraction;
		},
		get snapPoints() {
			return convertedSnappoints;
		},
		get closeTreshold() {
			return convertedCloseTreshold;
		},
		get autoCloseTreshold() {
			return convertedAutoCloseTreshold;
		},
		get disableDragging() {
			return disableDragging;
		},
		get disableClosing() {
			return disableClosing;
		},
		get maxDragPoint() {
			return convertedMaxDragPoint;
		},
		get position() {
			return position;
		},
		get disableClickOutside() {
			return disableClickOutside;
		},
		get disableEscape() {
			return disableEscape;
		},
		onSheetDrag: () => {
			onsheetdrag?.();
		},
		onSheetDragStart: () => {
			onsheetdragstart?.();
		},
		onSheetDragEnd: () => {
			onsheetdragend?.();
		},
		onSnap: (point: number) => {
			onsnap?.(point);
		},
		get disableFocusTrap() {
			return disableFocusTrap;
		}
	});

	const mergedProps = $derived(mergeProps(rest, {}));
</script>

{@render children?.()}
