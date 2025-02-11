import BottomSheetContent from './BottomSheet/Content/Content.svelte';
import type Sheet from './BottomSheet/Sheet/Sheet.svelte';
import type BottomSheet from './BottomSheet/BottomSheet.svelte';
import type SheetTrigger from './BottomSheet/Trigger/Trigger.svelte';
import { writable, type Writable } from 'svelte/store';
import type Overlay from './BottomSheet/Overlay/Overlay.svelte';
import type Handle from './BottomSheet/Handle/Handle.svelte';

export type BottomSheetSettings = {
	closePercentage?: number;
	maxHeight?: string;
	snapPoints?: number[];
};

export type BottomSheetType = typeof BottomSheet & {
	Content: typeof BottomSheetContent;
	Sheet: typeof Sheet;
	Trigger: typeof SheetTrigger;
	Overlay: typeof Overlay;
	Handle: typeof Handle;
};

export type SheetContext = {
	sheetHeight: number;
	isSheetOpen: boolean;
	isDragging: boolean;
	isMovingSheet: boolean;
	isDraggingFromHandle: boolean;
	sheetContent: HTMLDivElement | null;
	settings: BottomSheetSettings;
	touchStartEvent: (event: TouchEvent) => void;
	mouseDownEvent: (event: MouseEvent) => void;
	mouseMoveEvent: (event: MouseEvent) => void;
	touchMoveEvent: (event: TouchEvent) => void;
	moveEnd: () => void;
	openSheet: () => void;
	closeSheet: () => void;
	toggleSheet: () => void;
};
