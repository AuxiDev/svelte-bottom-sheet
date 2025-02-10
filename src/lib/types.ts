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

export interface ContextMenuContext {
	closeMenu: () => void;
}

export type BottomSheetType = typeof BottomSheet & {
	Content: typeof BottomSheetContent;
	Sheet: typeof Sheet;
	Trigger: typeof SheetTrigger;
	Overlay: typeof Overlay;
	Handle: typeof Handle;
};

export type SheetContext = {
	openSheet: () => void;
	closeSheet: () => void;
	toggleSheet: () => void;
	getSettings: () => BottomSheetSettings;
	isSheetVisible: Writable<boolean>;
};
