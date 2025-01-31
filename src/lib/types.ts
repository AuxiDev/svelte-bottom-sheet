import BottomSheet from './BottomSheet/BottomSheet.svelte';
import BottomSheetContent from './BottomSheet/Content/Content.svelte';
import type Sheet from './BottomSheet/Sheet/Sheet.svelte';
import type SheetV2 from './BottomSheet/SheetV2.svelte';
import type SheetTrigger from './BottomSheet/Trigger/Trigger.svelte';
import { writable, type Writable } from 'svelte/store';

export type BottomSheetSettings = {
	disableScrollingOutside?: boolean;
};

export interface ContextMenuContext {
	closeMenu: () => void;
}

export type BottomSheetType = typeof SheetV2 & {
	Content: typeof BottomSheetContent;
	Sheet: typeof Sheet;
	Trigger: typeof SheetTrigger;
};

export type SheetContext = {
	openSheet: () => void;
	closeSheet: () => void;
	toggleSheet: () => void;
	isSheetVisible: Writable<boolean>;
};
