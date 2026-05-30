import Root from './BottomSheetV3/BottomSheet.svelte';
import Sheet from './BottomSheetV3/Sheet/Sheet.svelte';
import Trigger from './BottomSheetV3/Trigger/Trigger.svelte';
import Content from './BottomSheetV3/Content/Content.svelte';
import Handle from './BottomSheetV3/Handle/Handle.svelte';
import Overlay from './BottomSheetV3/Overlay/Overlay.svelte';

export type SheetPositions = 'bottom' | 'top' | 'left' | 'right';

export { Root, Sheet, Trigger, Content, Handle, Overlay };

export const BottomSheet = Root as typeof Root & {
	Sheet: typeof Sheet;
	Trigger: typeof Trigger;
	Content: typeof Content;
	Handle: typeof Handle;
	Overlay: typeof Overlay;
};

export type { SheetContext } from './BottomSheetV3/context.js';

BottomSheet.Sheet = Sheet;
BottomSheet.Trigger = Trigger;
BottomSheet.Content = Content;
BottomSheet.Handle = Handle;
BottomSheet.Overlay = Overlay;

export type TypeOfBottomSheet = typeof import('./BottomSheetV3/BottomSheet.svelte').default;
export type TypeOfSheet = typeof import('./BottomSheetV3/Sheet/Sheet.svelte').default;
export type TypeOfContent = typeof import('./BottomSheetV3/Content/Content.svelte').default;
export type TypeOfHandle = typeof import('./BottomSheetV3/Handle/Handle.svelte').default;
export type TypeOfOverlay = typeof import('./BottomSheetV3/Overlay/Overlay.svelte').default;
export type TypeOfTrigger = typeof import('./BottomSheetV3/Trigger/Trigger.svelte').default;
export type TypeOfGrip = typeof import('./BottomSheetV3/Grip/Grip.svelte').default;
