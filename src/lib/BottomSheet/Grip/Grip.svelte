<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class="bottom-sheet-grip {rest.class}" aria-hidden="true"></div>

<style>
	.bottom-sheet-grip {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 8px;
	}
</style>
