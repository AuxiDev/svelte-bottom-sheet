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
					padding: '1.25rem',
					'overscroll-behavior-y': 'contain',
					'touch-action': sheetContext.isDragging ? 'none' : 'pan-y',
					'background-color': 'white',
					'box-sizing': 'border-box',
					flex: '1',
					'min-height': '0',
					height: '100%',
					// Scale down so you can still scroll to bottom
					// Use animation to not cut off - should be the same as translate
					// -> unified setting
					'max-height': `calc(${sheetContext.maxHeight}px - ${sheetContext.translateY}px - 36px)`,
					transition: sheetContext.isDragging
						? 'none'
						: 'max-height 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)'
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
