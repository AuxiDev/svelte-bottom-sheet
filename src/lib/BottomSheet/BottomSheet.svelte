<script lang="ts">
	import {
		type SheetContext,
		type BottomSheetSettings,
		type SheetIdentificationContext
	} from '$lib/types.js';
	import { onMount, setContext, type Snippet } from 'svelte';

	let {
		isSheetOpen = $bindable(false),
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		onsnap,
		settings = { maxHeight: '70%', snapPoints: [100] },
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

	const defaultSettings: Required<BottomSheetSettings> = {
		closeThreshold: 10,
		autoCloseThreshold: 0,
		maxHeight: '70%',
		snapPoints: [100],
		startingSnapPoint: 100
	};

	settings = { ...defaultSettings, ...settings };
	if (!settings.snapPoints?.includes(100)) {
		settings.snapPoints?.push(100);
	}

	$effect(() => {
		if (isSheetOpen) {
			onopen?.();
		} else {
			onclose?.();
			setSnapPoint(settings?.startingSnapPoint ?? 100, false);
		}
	});

	onMount(() => {
		maxHeightPx = window.innerHeight * (parseInt(settings.maxHeight ?? '70%') / 100);
		setSnapPoint(settings?.startingSnapPoint ?? 100, false);
	});

	// States & Vars needed for sheet-positon calculation.
	let sheetHeight = $state(0);
	let isDraggingFromHandle = $state(false);
	let sheetContent: HTMLDivElement | null = $state(null);
	let isDragging = $state(false);
	let isMovingSheet = $state(false);
	let startY: number;
	let startHeight: number;
	let noScrolledTop: number = 0;
	let maxHeightPx: number = 0;

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
		if (settings.snapPoints?.includes(point)) {
			sheetHeight = snappointToPxValue(point);
			if (throwEvent) {
				onsnap?.(point);
			}
			return true;
		}
		return false;
	};

	// Converts % points into the px value in relation to the maxHeight of the sheet.
	const snappointToPxValue = (percentage: number): number =>
		maxHeightPx - (percentage / 100) * maxHeightPx;

	const tryAutoClose = () => {
		if (
			settings.autoCloseThreshold &&
			sheetHeight > snappointToPxValue(100 - settings.autoCloseThreshold)
		) {
			sheetContext.closeSheet();
			console.log('hi');
			sheetHeight = 0;
			resetStatesAfterMove();
			return;
		}
	};

	const touchStartEvent = (event: TouchEvent) => {
		initializeMove(event.touches[0].clientY);
	};

	const mouseDownEvent = (event: MouseEvent) => {
		initializeMove(event.clientY);
	};

	const initializeMove = (clientStartY: number) => {
		startY = clientStartY;
		startHeight = sheetHeight;
		isDragging = true;
		noScrolledTop = sheetContent?.scrollTop ?? 0;
		onsheetdragstart?.();
	};

	const mouseMoveEvent = (event: MouseEvent) => {
		if (!isDragging) return;
		let offset: number;

		if (isDraggingFromHandle) {
			offset = Math.max(0, event.clientY - startY + startHeight);
		} else {
			offset = Math.max(0, event.clientY - startY - noScrolledTop + startHeight);
		}

		sheetHeight = offset;
		onsheetdrag?.();
		tryAutoClose();
	};

	const touchMoveEvent = (event: TouchEvent) => {
		if (!isDragging) return;

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

		if (sheetHeight != 0) {
			isMovingSheet = true;
		}

		sheetHeight = offset;
		onsheetdrag?.();
		tryAutoClose();
	};

	const moveEnd = () => {
		onsheetdragend?.();

		// If there is only 1 snappoint (must be 100), there will be a bigger buffer to close the sheet (default behaviour)
		if (settings.snapPoints?.length === 1) {
			if (sheetHeight > snappointToPxValue(100 - (settings.closeThreshold ?? 10))) {
				sheetContext.closeSheet();
				sheetHeight = 0;
			} else {
				sheetHeight = 0;
			}
			resetStatesAfterMove();
			return;
		}
		//Check if the current height is above the lowest snap point, else close it
		if (settings.snapPoints) {
			const lowestSnapPointPx = snappointToPxValue(Math.min(...settings.snapPoints));
			if (sheetHeight > lowestSnapPointPx) {
				sheetHeight = 0;
				sheetContext.closeSheet();
				resetStatesAfterMove();
				return;
			}
		}

		// Determine movement direction (snapping up or down)
		const isMovingUp = sheetHeight < startHeight;
		const buffer = snappointToPxValue(95);

		// Buffer logic: Prevent accidental snapping if the movement is small
		if (
			(isMovingUp && sheetHeight > startHeight - buffer) ||
			(!isMovingUp && sheetHeight < startHeight + buffer)
		) {
			sheetHeight = startHeight;
			resetStatesAfterMove();
			return;
		}

		// Find valid snap points based on the direction of movement
		//@ts-ignore
		const validPoints = settings.snapPoints
			.map((point) => ({ original: point, converted: snappointToPxValue(point) }))
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
		settings: settings,
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
