import BottomSheetContent from './BottomSheet/Content/Content.svelte';
import type Sheet from './BottomSheet/Sheet/Sheet.svelte';
import type BottomSheet from './BottomSheet/BottomSheet.svelte';
import type SheetTrigger from './BottomSheet/Trigger/Trigger.svelte';
import type Overlay from './BottomSheet/Overlay/Overlay.svelte';
import type Handle from './BottomSheet/Handle/Handle.svelte';
import type Grip from './BottomSheet/Grip/Grip.svelte';

export type sheetPosition = 'bottom' | 'top' | 'left' | 'right';

export type BottomSheetSettings = {
	closeThreshold?: number;
	autoCloseThreshold?: number;
	maxHeight?: number;
	snapPoints?: number[];
	startingSnapPoint?: number;
	disableDragging?: boolean;
	disableClosing?: boolean;
	position?: sheetPosition;
	contentAlignment?: ContentAlignmentType;
};

/**
 * ContentAlignmentType
 *
 * Defines how content is aligned relative to snap points or layout rules.
 *
 * Format: [position]-behavior
 *
 * Positions:
 * - start: Aligned to the starting snap point
 * - dynamic: Automatically adjusts to layout context ALSO WHILE DRAGGING
 * - end: Aligned to the last snap point (NOT WHILE DRAGGING - is allowed to adjust after snapping because there is a new "last")
 *
 * Behaviors:
 * - fit: Sized to fit its content
 * - flex: Flexible and fills available space (default)
 */
export type ContentAlignmentType = 'start-fit' | 'flex';

export type BottomSheetType = typeof BottomSheet & {
	Content: typeof BottomSheetContent;
	Sheet: typeof Sheet;
	Trigger: typeof SheetTrigger;
	Overlay: typeof Overlay;
	Handle: typeof Handle;
	Grip: typeof Grip;
};

export type SheetIdentificationContext = {
	sheetId: string;
	headingId: string;
	descriptionId: string;
};

export type SheetContext = {
	sheetHeight: number;
	isSheetOpen: boolean;
	isDragging: boolean;
	isMovingSheet: boolean;
	isDraggingFromHandle: boolean;
	sheetContent: HTMLDivElement | null;
	sheetElement: HTMLDivElement | null;
	settings: Required<BottomSheetSettings>;
	maxHeightPx: number;
	touchStartEvent: (event: TouchEvent) => void;
	mouseDownEvent: (event: MouseEvent) => void;
	mouseMoveEvent: (event: MouseEvent) => void;
	touchMoveEvent: (event: TouchEvent) => void;
	moveEnd: () => void;
	openSheet: () => void;
	closeSheet: () => void;
	toggleSheet: () => void;
};
