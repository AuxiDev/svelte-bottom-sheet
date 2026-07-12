<script lang="ts">
	import BottomSheet from './index.js';
	import type { BottomSheetSettings } from '../types.js';

	let {
		onopen,
		onclose,
		settings
	}: {
		onopen?: () => void;
		onclose?: () => void;
		settings?: BottomSheetSettings;
	} = $props();
</script>

<BottomSheet {onopen} {onclose} {settings}>
	<BottomSheet.Trigger>Toggle</BottomSheet.Trigger>
	<BottomSheet.Sheet>Content</BottomSheet.Sheet>
</BottomSheet>
