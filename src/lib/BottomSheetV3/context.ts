import { createContext } from 'svelte';
import { writable } from 'svelte/store';
import type { AnimationProps, SheetPositions } from './index.js';

export interface SheetContext {
	maxHeight: number;
	startHeight: number;
	isSheetOpen: boolean;
	toggleSheet: () => void;
	contentElement: HTMLDivElement | null;
	translateY: number;
	isDragging: boolean;
	enableScrollDragTakeover: boolean;
	disableBackgroundInteraction: boolean;
	snapPoints: number[];
	closeTreshold: number;
	autoCloseTreshold: number;
	disableDragging: boolean;
	onlyTopSheetInteractive: boolean;
	disableClosing: boolean;
	maxDragPoint: number;
	position: SheetPositions;
	disableClickOutside: boolean;
	onSheetDrag: () => void;
	onSheetDragStart: () => void;
	onSheetDragEnd: () => void;
	onSnap: (point: number) => void;
	contentId: string;
	triggerId: string;
	disableFocusTrap: boolean;
  disableEscape: boolean;
	sheetAnimation?: AnimationProps;
	overlayAnimation?: AnimationProps;
}

export const [getSheetContext, setSheetContext] = createContext<SheetContext>();

export const topSheetId = writable<string | null>(null);
const openSheetStack: string[] = [];

const updateTopSheet = () => {
	topSheetId.set(openSheetStack[openSheetStack.length - 1] ?? null);
};

export const registerOpenSheet = (id: string) => {
	const existingIndex = openSheetStack.indexOf(id);
	if (existingIndex !== -1) {
		openSheetStack.splice(existingIndex, 1);
	}
	openSheetStack.push(id);
	updateTopSheet();
};

export const unregisterOpenSheet = (id: string) => {
	const existingIndex = openSheetStack.indexOf(id);
	if (existingIndex !== -1) {
		openSheetStack.splice(existingIndex, 1);
	}
	updateTopSheet();
};

export const isTopSheet = (id: string) => {
	return openSheetStack[openSheetStack.length - 1] === id;
};
