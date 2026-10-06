<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { ContentPropsWithChild } from '../index.js';
	import { getSheetContext } from '../context.js';

	let { ref = $bindable(), children, child, ...rest }: ContentPropsWithChild = $props();

	const sheetContext = getSheetContext();

	let mergedProps = $derived(
		mergeProps(
			{
				'data-bottomsheet-content': '',
				'data-state': sheetContext.isPresent ? 'open' : 'closed',
				style: {
					'overflow-y': 'auto',
					padding: '1.25rem',
					'overscroll-behavior-y': 'contain',
					'background-color': 'white',
					'box-sizing': 'border-box',
					flex: '1',
					'min-height': '0',
					height: '100%',
					// Scale down so you can still scroll to bottom
					// Use animation to not cut off - should be the same as transform at Sheet.svelte
					// -> unified setting
					transition: sheetContext.isDragging
						? 'none'
						: `max-height ${sheetContext.sheetAnimation?.duration}ms ${sheetContext.sheetAnimation?.easing}`
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
