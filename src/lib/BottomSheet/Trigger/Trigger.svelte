<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, ...rest }: { children?: any } & HTMLAttributes<HTMLDivElement> = $props();

	const { toggleSheet } = getContext<SheetContext>('sheetStateContext');
	const click = () => {
		toggleSheet();
	};
</script>

<div {...rest} role="button" tabindex="0" onclick={click}>
	{@render children?.()}
</div>
