<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSheetContext } from '../context.js';

	let {
		ref = $bindable(),
		children,
		child,
		...rest
	}: {
		ref?: HTMLDivElement;
		children?: Snippet<[]>;
		child?: Snippet<[{ props: Record<string, any> }]>;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getSheetContext();

	let mergedProps = $derived(
		mergeProps(
			{
				'data-bottomsheet-content': '',
				'data-state': sheetContext.isSheetOpen ? 'open' : 'closed',
				style: {
					'overflow-y': 'auto',
					'max-height': '100%',
					height: '100%',
					padding: '1.25rem',
					'overscroll-behavior-y': 'contain',
					'-webkit-overflow-scrolling': 'touch',
					// FIX: Disable native touch manipulation while dragging,
					// so our JS injection can safely mutate scrollTop!
					'touch-action': sheetContext.isDragging ? 'none' : 'pan-y',
					'background-color': 'white'
				}
			},
			rest,
			withRef((el) => {
				ref = el as HTMLDivElement;
				sheetContext.contentElement = el as HTMLDivElement;
			})
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
