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
	import { getScrollableElement, measurementToPx } from '$lib/utils.js';
	import { setContext, type Snippet } from 'svelte';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';

	let {
		isSheetOpen = $bindable(false),
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		onsnap,
		settings: propSettings = {
			closeThreshold: 0.9,
			autoCloseThreshold: 0,
			maxHeight: 0.7,
			snapPoints: [1],
			startingSnapPoint: 1,
			disableDragging: false,
			position: 'bottom',
			disableClosing: false,
			contentAlignment: 'flex'
		},
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

	const defaultsettings: Required<BottomSheetSettings> = {
		closeThreshold: 0.9,
		autoCloseThreshold: 0,
		maxHeight: 0.7,
		snapPoints: [1],
		startingSnapPoint: 1,
		disableDragging: false,
		position: 'bottom',
		disableClosing: false,
		contentAlignment: 'flex'
	};

	if (!propSettings.snapPoints?.includes(1)) {
		propSettings.snapPoints?.push(1);
	}

	const settings: Required<BottomSheetSettings> = $derived({ ...defaultsettings, ...propSettings });

	let eventController = new AbortController();

	$effect(() => {
		if (isSheetOpen) {
			onopen?.();
			eventController = new AbortController();
			resizeObserver = new ResizeObserver(() => {
				adjustSnappointAfterResize();
			});

			document.addEventListener(
				'wheel',
				(e) => {
					e.preventDefault();
				},
				{
					passive: false,
					signal: eventController.signal
				}
			);

			document.addEventListener(
				'touchmove',
				(e) => {
					{
						if (e.cancelable) e.preventDefault();
					}
				},
				{
					passive: false,
					signal: eventController.signal
				}
			);

			document.addEventListener('mouseup', resetStatesAfterMove);
			document.addEventListener('mousemove', mouseMoveEvent);
			document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
			document.addEventListener('keydown', handleKeyDown);
			resizeObserver.observe(document.documentElement);
		} else {
			onclose?.();
			setSnapPoint(settings.startingSnapPoint, false);
			document.removeEventListener('mouseup', resetStatesAfterMove);
			document.removeEventListener('touchmove', preventPullToRefresh);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousemove', mouseMoveEvent);
			if (resizeObserver != null) resizeObserver.disconnect();
			eventController.abort();
		}
	});

	// States & Vars needed for sheet-positon calculation.
	let sheetHeight = $state(0);
	let isDraggingFromHandle = $state(false);
	let maxHeightPx = $derived.by(() => {
		const { maxHeight, position } = settings;
		if (maxHeight > 1) {
			return maxHeight;
		}
		const isSidePosition = position === 'left' || position === 'right';
		const dimension = isSidePosition ? (innerWidth.current ?? 0) : (innerHeight.current ?? 0);

		return dimension * maxHeight;
	});
	let sheetContent: HTMLDivElement | null = $state(null);
	let sheetElement: HTMLDivElement | null = $state(null);
	let isDragging = $state(false);
	let isMovingSheet = $state(false);
	let startY: number;
	let startHeight: number;
	let noScrolledTop: number = 0;
	let startX: number = 0;
	// svelte-ignore state_referenced_locally
	let currentSnappoint = settings.startingSnapPoint;
	let resizeObserver: ResizeObserver;

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
		if (settings.snapPoints.includes(point)) {
			sheetHeight = measurementToPx(point, maxHeightPx);
			if (throwEvent) {
				onsnap?.(point);
			}
			currentSnappoint = point;
			return true;
		}
		return false;
	};

	/*
		If a resize happens on a snappoint Bottom Sheet, adjust the point
	*/
	const adjustSnappointAfterResize = () => {
		if (settings.snapPoints.length > 1) {
			setSnapPoint(currentSnappoint, false);
		}
	};

	/*
		Prevents pull to refresh in the middle of the screen. (Except 50px at the top)
	*/
	const preventPullToRefresh = (event: TouchEvent) => {
		if (window.scrollY === 0 && event.touches[0].clientY > 50) {
			event.preventDefault();
		}
	};

	/*
		When Escape is pressed, close the sheet.
	*/
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && !settings.disableClosing) {
			sheetContext.closeSheet();
		}
	};

	/**
	 * Tries to automatically close the bottom sheet if it exceeds the auto-close threshold.
	 */
	const tryAutoClose = () => {
		if (sheetHeight > measurementToPx(settings.autoCloseThreshold, maxHeightPx)) {
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
		startY = clientStartY;
		startX = clientStartX;
		startHeight = sheetHeight;
		isDragging = true;
		noScrolledTop = sheetElement?.scrollTop ?? 0;
		if (!settings.disableDragging) onsheetdragstart?.();
	};

	/**
	 * Calculates the offset based on the current X- and Y-Position and the general sheet position.
	 *
	 * @param {number} clientY - The Y position of the current touch/click.
	 * @param {number} clientX - The X position of the current touch/click.
	 */
	const calculateOffSet = (clientY: number, clientX: number) => {
		// clientY - startY - normal offset
		// noScrolledTop - because we calculate with clientY, when you scroll before through the content and then you close the sheet, the offset would have a jump in it
		// startHeight - offset when we not start at the top with dragging
		let offset: number = 0;
		if (settings.position === 'bottom') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, clientY - startY + startHeight);
			} else {
				offset = Math.max(0, clientY - startY - noScrolledTop + startHeight);
			}
		} else if (settings.position === 'top') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, startY - clientY + startHeight);
			} else {
				offset = Math.max(0, startY - clientY - noScrolledTop + startHeight);
			}
		} else if (settings.position === 'left') {
			if (isDraggingFromHandle) {
				offset = Math.max(0, startX - clientX + startHeight);
			} else {
				offset = Math.max(0, startX - clientX - noScrolledTop + startHeight);
			}
		} else if (settings.position === 'right') {
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
		if (!isDragging || settings.disableDragging) return;
		// Setting isDraggingFromHandle to true, because when dragging with the mouse, you should be able to drag it down no matter if scrolled to the top
		isDraggingFromHandle = true;
		let offset: number = calculateOffSet(event.clientY, event.clientX);

		if (sheetHeight != 0) {
			isMovingSheet = true;
		}
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
		if (!isDragging || !sheetElement) return;
		// If you are at the top of the sheet and try to drag the sheet down, isMovingSheet will be set to true, expecting the sheet to move.
		// But when disableDragging is true, this won't happen, so set it back to false
		// Also set isDraggingFromHandle to false because else it wouldn't let you scroll and it can't reset because there is no drag-end event.
		if (settings.disableDragging) {
			isMovingSheet = false;
			isDraggingFromHandle = false;
		}

		const target = event.target as Element;
		const scrollableElement = getScrollableElement(target) as HTMLElement;

		if (!isDraggingFromHandle && !isMovingSheet && scrollableElement) {
			const { clientY, clientX } = event.touches[0];
			const { scrollTop, scrollLeft, scrollHeight, clientHeight, scrollWidth, clientWidth } =
				scrollableElement;

			const isVertical = settings.position === 'top' || settings.position === 'bottom';
			const move = isVertical ? clientY : clientX;
			const start = isVertical ? startY : startX;
			let scrollingUp = move > start;

			const atBottom = isVertical
				? Math.round(scrollTop) + clientHeight >= scrollHeight
				: Math.round(scrollLeft) + clientWidth >= scrollWidth;

			let atTop;
			switch (settings.position) {
				case 'top':
					atTop = scrollTop >= 0;
					break;
				case 'bottom':
					atTop = scrollTop <= 0;
					scrollingUp = !scrollingUp;
					break;
				case 'left':
					atTop = scrollLeft >= 0;
					break;
				case 'right':
					atTop = scrollLeft <= 0;
					scrollingUp = !scrollingUp;
					break;
			}

			if ((atTop && scrollingUp) || (!scrollingUp && atBottom) || (!atTop && !atBottom)) {
				event.stopPropagation();
				return;
			} else if (atTop && !scrollingUp) {
				isMovingSheet = true;
				return;
			} else if (atBottom && scrollingUp) {
				return;
			}
		}

		if (settings.disableDragging) {
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
		if (settings.disableDragging) return;
		onsheetdragend?.();

		// If there is only one snap point (1), apply a larger buffer for closing behavior
		if (settings.snapPoints.length === 1) {
			if (sheetHeight > measurementToPx(settings.closeThreshold, maxHeightPx)) {
				sheetContext.closeSheet();
				sheetHeight = 0;
			} else {
				sheetHeight = 0;
			}
			resetStatesAfterMove();
			return;
		}

		let snapPointsInPx = settings.snapPoints.map((point) => measurementToPx(point, maxHeightPx));

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
		const validPoints = settings.snapPoints
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
			currentSnappoint = closest.original;
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
		get sheetElement() {
			return sheetElement!;
		},
		set sheetElement(element: HTMLDivElement) {
			sheetElement = element;
		},
		get maxHeightPx() {
			return maxHeightPx;
		},
		get settings() {
			return settings;
		},
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

	// svelte-ignore state_referenced_locally
	setSnapPoint(settings.startingSnapPoint, false);
	setContext<SheetContext>('sheetContext', sheetContext);
	setContext<SheetIdentificationContext>('sheetIdentificationContext', sheetIdentifcationContext);
</script>

<div style="overscroll-behavior: contain; ">
	{@render children?.()}
</div>
