<script lang="ts">
	import { withRef } from '#lib/utils/ref-attachment.js';
	import { getSheetContext } from '../context.js';
	import { mergeProps } from '#lib/utils/merge-props.js';
	import type { ContentPropsWithChild } from '../types.js';

	let { children, child, ref, ...rest }: ContentPropsWithChild = $props();

	const sheetContext = getSheetContext();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-bottomsheet-content': '',
				'data-position': sheetContext.position,
				'data-state': sheetContext.isSheetOpenInternal ? 'open' : 'closed',
				style: {
					flex: '1 1 0%',
					'min-height': '0',
					'min-width': '0',
					overflow: 'auto',
					'overscroll-behavior': 'contain',
					'-webkit-overflow-scrolling': 'touch'
				}
			},
			rest,
			withRef((el) => {
				ref = el as HTMLDivElement;
				sheetContext.setContentElement(el as HTMLDivElement);
			})
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps} data-bottomsheet-content>
		{@render children?.()}
	</div>
{/if}
