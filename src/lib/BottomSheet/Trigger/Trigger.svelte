<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';

	let { children } = $props<{ children?: any }>();

	const { toggleSheet } = getContext<SheetContext>('sheetStateContext');
	const click = () => {
		toggleSheet();
	};
</script>

<div role="button" tabindex="0" onkeypress={() => {}} onclick={click}>
	{@render children?.()}
</div>
