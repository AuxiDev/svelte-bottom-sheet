import type { BottomSheetType } from '$lib/types.js';
import BottomSheetContent from './Content/Content.svelte';
import Sheet from './Sheet/Sheet.svelte';
import SheetV2 from './BottomSheet.svelte';
import Trigger from './Trigger/Trigger.svelte';
import Overlay from './Overlay/Overlay.svelte';

const TypedBottomSheet = SheetV2 as BottomSheetType;
TypedBottomSheet.Content = BottomSheetContent;
TypedBottomSheet.Sheet = Sheet;
TypedBottomSheet.Trigger = Trigger;
TypedBottomSheet.Overlay = Overlay;

export default TypedBottomSheet;
