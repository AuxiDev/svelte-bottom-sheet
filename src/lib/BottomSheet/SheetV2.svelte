<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let {
		isOpen = $bindable(false),
		onopen,
		onclose,
		children
	} = $props<{
		isOpen?: boolean;
		children: any;
		onopen?: () => void;
		onclose?: () => void;
	}>();

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
