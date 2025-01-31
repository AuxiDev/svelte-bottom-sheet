import BottomSheet from './BottomSheet/BottomSheet.svelte';
import BottomSheetContent from './BottomSheet/Content/Content.svelte';

export type BottomSheetSettings = {
	disableScrollingOutside?: boolean;
};

export interface ContextMenuContext {
	closeMenu: () => void;
}

export type BottomSheetType = typeof BottomSheet & {
	Content: typeof BottomSheetContent;
};
