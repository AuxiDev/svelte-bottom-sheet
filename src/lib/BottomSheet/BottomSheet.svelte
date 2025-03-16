<!--
NOTE! Depending on the sheets position (bottom, top, left, right ), the sheets works with height / width. 
For an easier usage and because the sheet can only be at one position, it's every variable which has something
to has "height" in it's name.  
-->

<script lang="ts">
	import {
		type SheetContext,
		type BottomSheetSettings,
		type SheetIdentificationContext
	} from '$lib/types.js';
	import { measurementToPx } from '$lib/utils.js';
	import { onMount, setContext, type Snippet } from 'svelte';

	let {
		isSheetOpen = $bindable(false),
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		onsnap,
		settings,
		children
	}: {
		isSheetOpen?: boolean;
		settings?: BottomSheetSettings;
		children: Snippet<[]>;
		onopen?: () => void;
		onclose?: () => void;
		onsheetdrag?: () => void;
		onsheetdragstart?: () => void;
		onsheetdragend?: () => void;
		onsnap?: (point: number) => void;
	} = $props();

	const defaultSheetSettings: Required<BottomSheetSettings> = {
		closeThreshold: 0.9,
		autoCloseThreshold: 0,
		maxHeight: 0.7,
		snapPoints: [1],
		startingSnapPoint: 1,
		disableDragging: false,
		position: 'bottom'
	};

	const sheetSettings: Required<BottomSheetSettings> = { ...defaultSheetSettings, ...settings };

	if (!sheetSettings.snapPoints.includes(1)) {
		sheetSettings.snapPoints.push(1);
	}

	onMount(() => {
		if (sheetSettings.maxHeight > 1) {
			maxHeightPx = sheetSettings.maxHeight;
		} else if (sheetSettings.position === 'left' || sheetSettings.position === 'right') {
			maxHeightPx = window.innerWidth * sheetSettings.maxHeight;
		} else {
			maxHeightPx = window.innerHeight * sheetSettings.maxHeight;
		}
		setSnapPoint(sheetSettings.startingSnapPoint, false);
	});

	$effect(() => {
		if (isSheetOpen) {
			onopen?.();
		} else {
			onclose?.();
			setSnapPoint(sheetSettings.startingSnapPoint, false);
		}
	});

	// States & Vars needed for sheet-positon calculation.
	let sheetHeight = $state(0);
	let isDraggingFromHandle = $state(false);
	let maxHeightPx = $state(0);
	let sheetContent: HTMLDivElement | null = $state(null);
	let isDragging = $state(false);
	let isMovingSheet = $state(false);
	let startY: number;
	let startHeight: number;
	let noScrolledTop: number = 0;
	let startX: number = 0;

	// A11Y related IDs
	const sheetId = `bottom-sheet-${Math.random().toString(36).substr(2, 9)}`;
	const headingId = `${sheetId}-heading`;
	const descriptionId = `${sheetId}-description`;

	/**
	 * Allows you to change the snap-point a snap-able sheet is snapped to.
	 * You can only snap the sheet to snap-points defined in the settings.
	 * @param {number} point - The point you want to snap to.
	 * @param {boolean} throwEvent [OPTIONAL] - Whether a onsnap event is emitted or not. Default: true
	 * @returns {boolean} Whether the snap was sucessful or not.
	 */
	export const setSnapPoint = (point: number, throwEvent: boolean = true): boolean => {
		if (sheetSettings.snapPoints.includes(point)) {
			sheetHeight = measurementToPx(point, maxHeightPx);
			if (throwEvent) {
				onsnap?.(point);
			}
			return true;
		}
		return false;
	};

	/**
	 * Tries to automatically close the bottom sheet if it exceeds the auto-close threshold.
	 */
	const tryAutoClose = () => {
		if (sheetHeight > measurementToPx(sheetSettings.autoCloseThreshold, maxHeightPx)) {
			sheetHeight = 0;
			sheetContext.closeSheet();
			resetStatesAfterMove();
			return;
		}
	};

	/**
	 * Handles the touch start event, initializing the drag operation.
	 *
	 * @param {TouchEvent} event - The touch event.
	 */
	const touchStartEvent = (event: TouchEvent) => {
		initializeMove(event.touches[0].clientY, event.touches[0].clientX);
	};

	/**
	 * Handles the mouse down event, initializing the drag operation.
	 *
	 * @param {MouseEvent} event - The mouse event.
	 */
	const mouseDownEvent = (event: MouseEvent) => {
		initializeMove(event.clientY, event.clientX);
	};

	/**
	 * Initializes the movement logic when dragging starts.
	 *
	 * @param {number} clientStartY - The Y position of the initial touch/click.
	 * @param {number} clientStartX - The X position of the initial touch/click.
	 */
	const initializeMove = (clientStartY: number, clientStartX: number) => {
		if (sheetSettings.disableDragging) return;
		startY = clientStartY;
		startX = clientStartX;
		startHeight = sheetHeight;
		isDragging = true;
		noScrolledTop = sheetContent?.scrollTop ?? 0;
		onsheetdragstart?.();
	};

	/**
	 * Calculates the offset based on the current X- and Y-Position and the general sheet position.
	 *
	 * @param {number} clientY - The Y position of the current touch/click.
	 * @param {number} clientX - The X position of the current touch/click.
	 */
	const calculateOffSet = (clientY: number, clientX: number) => {
		let offset: number = 0;
		if (sheetSettings.position === 'bottom') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, clientY - startY + startHeight);
			} else {
				offset = Math.max(0, clientY - startY - noScrolledTop + startHeight);
			}
		} else if (sheetSettings.position === 'top') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, startY - clientY + startHeight);
			} else {
				offset = Math.max(0, startY - clientY - noScrolledTop + startHeight);
			}
		} else if (sheetSettings.position === 'left') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, startX - clientX + startHeight);
			} else {
				offset = Math.max(0, startX - clientX - noScrolledTop + startHeight);
			}
		} else if (sheetSettings.position === 'right') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, clientX - startX + startHeight);
			} else {
				offset = Math.max(0, clientX - startX - noScrolledTop + startHeight);
			}
		}

		return offset;
	};

	/**
	 * Handles mouse movement while dragging the bottom sheet.
	 *
	 * @param {MouseEvent} event - The mouse event.
	 */
	const mouseMoveEvent = (event: MouseEvent) => {
		if (!isDragging) return;
		let offset: number = calculateOffSet(event.clientY, event.clientX);

		sheetHeight = offset;
		onsheetdrag?.();
		tryAutoClose();
	};

	/**
	 * Handles touch movement while dragging the bottom sheet.
	 *
	 * @param {TouchEvent} event - The touch event.
	 */
	const touchMoveEvent = (event: TouchEvent) => {
		if (!isDragging) return;

		if (sheetContent?.scrollTop !== 0 && !isDraggingFromHandle) {
			isMovingSheet = false;
			return;
		}

		let offset: number = calculateOffSet(event.touches[0].clientY, event.touches[0].clientX);

		if (sheetHeight != 0) {
			isMovingSheet = true;
		}

		sheetHeight = offset;
		onsheetdrag?.();
		tryAutoClose();
	};

	/**
	 * Handles the end of a drag movement, determining whether to close or snap to a point.
	 */
	const moveEnd = () => {
		if (sheetSettings.disableDragging) return;
		onsheetdragend?.();

		// If there is only one snap point (1), apply a larger buffer for closing behavior
		if (sheetSettings.snapPoints.length === 1) {
			if (sheetHeight > measurementToPx(sheetSettings.closeThreshold, maxHeightPx)) {
				sheetContext.closeSheet();
				sheetHeight = 0;
			} else {
				sheetHeight = 0;
			}
			resetStatesAfterMove();
			return;
		}

		let snapPointsInPx = sheetSettings.snapPoints.map((point) =>
			measurementToPx(point, maxHeightPx)
		);

		// Check if the current height is above the lowest snap point; otherwise, close it
		const lowestSnapPointPx = Math.max(...snapPointsInPx);
		if (sheetHeight > lowestSnapPointPx) {
			sheetHeight = 0;
			sheetContext.closeSheet();
			resetStatesAfterMove();
			return;
		}

		// Determine movement direction (snapping up or down)
		const isMovingUp = sheetHeight < startHeight;
		const buffer = measurementToPx(0.95, maxHeightPx);

		// Prevent accidental snapping if the movement is small
		if (
			(isMovingUp && sheetHeight > startHeight - buffer) ||
			(!isMovingUp && sheetHeight < startHeight + buffer)
		) {
			sheetHeight = startHeight;
			resetStatesAfterMove();
			return;
		}

		// Find valid snap points based on the movement direction
		const validPoints = sheetSettings.snapPoints
			.map((point) => ({ original: point, converted: measurementToPx(point, maxHeightPx) }))
			.filter((item) => (isMovingUp ? item.converted < sheetHeight : item.converted > sheetHeight));

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
			onsnap?.(closest.original);
			sheetHeight = closest.converted;
		}

		resetStatesAfterMove();
	};

	/**
	 * Resets state variables after movement has ended.
	 */
	const resetStatesAfterMove = () => {
		isDragging = false;
		isMovingSheet = false;
		isDraggingFromHandle = false;
	};

	const sheetContext: SheetContext = {
		get sheetHeight() {
			return sheetHeight;
		},
		set sheetHeight(height: number) {
			sheetHeight = height;
		},
		get isSheetOpen() {
			return isSheetOpen;
		},
		set isSheetOpen(state: boolean) {
			isSheetOpen = state;
		},
		get isDragging() {
			return isDragging;
		},
		set isDragging(state: boolean) {
			isDragging = state;
		},
		get isMovingSheet() {
			return isMovingSheet;
		},
		set isMovingSheet(state: boolean) {
			isMovingSheet = state;
		},
		get isDraggingFromHandle() {
			return isDraggingFromHandle;
		},
		set isDraggingFromHandle(state: boolean) {
			isDraggingFromHandle = state;
		},
		get sheetContent() {
			return sheetContent!;
		},
		set sheetContent(element: HTMLDivElement) {
			sheetContent = element;
		},
		get maxHeightPx() {
			return maxHeightPx;
		},
		set maxHeightPx(number: number) {
			maxHeightPx = number;
		},
		settings: sheetSettings,
		touchStartEvent: touchStartEvent,
		mouseDownEvent: mouseDownEvent,
		mouseMoveEvent: mouseMoveEvent,
		touchMoveEvent: touchMoveEvent,
		moveEnd: moveEnd,
		openSheet: () => {
			isSheetOpen = true;
		},
		closeSheet: () => {
			isSheetOpen = false;
		},
		toggleSheet: () => {
			isSheetOpen = !isSheetOpen;
		}
	};

	let sheetIdentifcationContext: SheetIdentificationContext = {
		sheetId: sheetId,
		headingId: headingId,
		descriptionId: descriptionId
	};

	setContext<SheetContext>('sheetContext', sheetContext);
	setContext<SheetIdentificationContext>('sheetIdentificationContext', sheetIdentifcationContext);
</script>

<div>
	{@render children?.()}
</div>
