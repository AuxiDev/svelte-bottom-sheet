<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSheetContext } from '../context.js';
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withPortal } from '$lib/utils/portal.js';

	let {
		children,
		child,
		...rest
	}: {
		children?: Snippet<[]>;
		child?: Snippet<[{ props: Record<string, any> }]>;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getSheetContext();

	const mergedProps = $derived(
		mergeProps(
			rest,
			{
				'aria-hidden': true,
				style: {
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					'background-color': 'rgba(0, 0, 0, 0.5)',
					overflow: 'hidden'
				}
			},
			withPortal()
		)
	);
</script>

{#if sheetContext.isSheetOpen}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}></div>
	{/if}
{/if}
{@render children?.()}
