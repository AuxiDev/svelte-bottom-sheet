import { createContext } from 'svelte';
import type { SheetPositions } from './index.js';

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
}

export const [getSheetContext, setSheetContext] = createContext<SheetContext>();
