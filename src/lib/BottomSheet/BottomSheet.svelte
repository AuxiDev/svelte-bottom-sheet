<script lang="ts">
	import type { BottomSheetSettings, SheetContext } from '$lib/types.js';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let {
		isOpen = $bindable(false),
		onopen,
		onclose,
		onsheetdrag,
		onsheetdragstart,
		onsheetdragend,
		settings = { maxHeight: '70%', snapPoints: [] },
		children
	}: {
		isOpen?: boolean;
		settings?: BottomSheetSettings;
		children: any;
		onopen?: () => void;
		onclose?: () => void;
		onsheetdrag?: () => void;
		onsheetdragstart?: () => void;
		onsheetdragend?: () => void;
	} = $props();

	let isSheetVisible = writable(false);
	isSheetVisible.subscribe((state) => {
		isOpen = state;
		if (state) {
			onopen?.();
		} else {
			onclose?.();
		}
	});
	const contextValue: SheetContext = {
		openSheet: () => {
			isSheetVisible.update(() => true);
		},
		closeSheet: () => {
			isSheetVisible.update(() => false);
		},
		toggleSheet: () => {
			isSheetVisible.update((state: boolean) => !state);
		},
		onSheetDrag: () => {
			onsheetdrag?.();
		},
		onSheetDragStart: () => {
			onsheetdragstart?.();
		},
		onSheetDragEnd: () => {
			onsheetdragend?.();
		},
		getSettings: () => {
			return settings;
		},
		isSheetVisible: isSheetVisible
	};

	$effect(() => {
		isSheetVisible.update(() => isOpen);
	});

	setContext<SheetContext>('sheetStateContext', contextValue);
</script>

<div>
	{@render children?.()}
</div>
