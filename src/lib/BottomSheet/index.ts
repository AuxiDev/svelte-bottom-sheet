import type { BottomSheetType } from '$lib/types.js';
import BottomSheet from './BottomSheet.svelte';
import BottomSheetContent from './Content/Content.svelte';

const TypedBottomSheet = BottomSheet as BottomSheetType;
TypedBottomSheet.Content = BottomSheetContent;

export default TypedBottomSheet;
