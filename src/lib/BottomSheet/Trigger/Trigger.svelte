<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, ...rest }: { children?: any } & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getContext<SheetContext>('sheetStateContext');
	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}
	const { toggleSheet } = sheetContext;

	const handleClick = () => {
		toggleSheet();
	};
</script>

<div {...rest} role="button" tabindex="0" onclick={handleClick}>
	{@render children?.()}
</div>
