import { createContext } from 'svelte';
import type { SheetPosition, AnimationProps } from './types.ts';

export interface SheetContextType {
	position: SheetPosition;
	maxHeightInPx: number;
	isSheetOpenInternal: boolean;
	sheetOffsetInPx: number;

	// Features
	isClosingDisabled: boolean;
	closeThreshold: number;
	autoCloseThreshold: number;
	maxDragPoint: number;
	snapPoints: number[];
	fitContent: boolean;
	isFocusTrappedDisabled: boolean;
	isEscapeClosingDisabled: boolean;
	isClickOutsideClosingDisabled: boolean;
	isBackgroundInteractionDisabled: boolean;
	isRubberbandDisabled: boolean;
	isDraggingDisabled: boolean;
	sheetAnimation: AnimationProps;
	overlayAnimation: AnimationProps;
	sheetId: string;
	shouldOnlyTopSheetInteractive: boolean;
	sheetSideOffsetInPx: number;

	// SheetElements
	contentElement: HTMLDivElement | null;
	sheetElement: HTMLDivElement | null;
	setContentElement: (newElement: HTMLDivElement | null) => void;
	setSheetElement: (newElement: HTMLDivElement | null) => void;

	// Functions
	setSheetOffset: (offsetInPx: number) => void;
	closeSheet: () => void;
	toggleSheet: () => void;
	finalCloseSheet: () => void;
	onSnap: (point: number) => void;
	onSheetDrag: () => void;
	onSheetDragStart: () => void;
	onSheetDragEnd: () => void;
}

export const [getSheetContext, setSheetContext] = createContext<SheetContextType>();

const openSheetStack: string[] = [];
export const registerOpenSheet = (id: string) => {
	const existingIndex = openSheetStack.indexOf(id);
	if (existingIndex !== -1) {
		openSheetStack.splice(existingIndex, 1);
	}
	openSheetStack.push(id);
};

export const unregisterOpenSheet = (id: string) => {
	const existingIndex = openSheetStack.indexOf(id);
	if (existingIndex !== -1) {
		openSheetStack.splice(existingIndex, 1);
	}
};

export const isTopSheet = (id: string) => {
	return openSheetStack[openSheetStack.length - 1] === id;
};
