<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="handle-container">
	<div {...rest} class="bottom-sheet-handle {rest.class}"></div>
</div>

<style>
	.bottom-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
	}
	.handle-container {
		height: 40px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
