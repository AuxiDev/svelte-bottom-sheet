import type { BottomSheetType } from '$lib/types.js';
import BottomSheetContent from './Content/Content.svelte';
import Sheet from './Sheet/Sheet.svelte';
import BottomSheet from './BottomSheet.svelte';
import Trigger from './Trigger/Trigger.svelte';
import Overlay from './Overlay/Overlay.svelte';
import Handle from './Handle/Handle.svelte';
import Grip from './Grip/Grip.svelte';

const TypedBottomSheet = BottomSheet as BottomSheetType;
TypedBottomSheet.Content = BottomSheetContent;
TypedBottomSheet.Sheet = Sheet;
TypedBottomSheet.Trigger = Trigger;
TypedBottomSheet.Overlay = Overlay;
TypedBottomSheet.Handle = Handle;
TypedBottomSheet.Grip = Grip;

export default TypedBottomSheet;
