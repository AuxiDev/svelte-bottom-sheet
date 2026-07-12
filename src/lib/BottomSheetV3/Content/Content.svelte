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

	const positionStyles = () => {
		switch (sheetContext.position) {
			case 'left':
			case 'right':
				return '';
			case 'bottom':
				return {
					'max-height': `calc(${sheetContext.maxHeight}px - ${sheetContext.translateY}px - 36px)`
				};
		}
	};

	let mergedProps = $derived(
		mergeProps(
			{
				'data-bottomsheet-content': '',
				'data-state': sheetContext.isSheetOpen ? 'open' : 'closed',
				style: {
					'overflow-y': 'auto',
					padding: '1.25rem',
					'overscroll-behavior-y': 'contain',
					'background-color': 'white',
					'box-sizing': 'border-box',
					flex: '1',
					'min-height': '0',
					height: '100%',
					...positionStyles(),
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
