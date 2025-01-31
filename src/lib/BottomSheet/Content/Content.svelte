<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, ...rest } = $props<{ children?: any } & HTMLAttributes<HTMLDivElement>>();
</script>

<div class="bottomSheetContent" {...rest}>
	{@render children?.()}
</div>

<style>
	.bottomSheetContent {
		padding: 20px;
		background-color: white;
	}
</style>
