<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="bottomSheetContent {rest.class}" {...rest}>
	{@render children?.()}
</div>

<style>
	.bottomSheetContent {
		padding: 20px;
	}
</style>
