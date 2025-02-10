<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, ...rest }: { children?: any } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="bottomSheetContent {rest.class}" {...rest}>
	{@render children?.()}
</div>

<style>
	.bottomSheetContent {
		padding: 20px;
	}
</style>
