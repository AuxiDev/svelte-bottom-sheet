<script lang="ts">
	import { getSheetContext } from '../context.js';
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withPortal } from '$lib/utils/portal.svelte.js';
	import type { OverlayPropsWithChild } from '../index.js';

	let { children, child, ...rest }: OverlayPropsWithChild = $props();

	const sheetContext = getSheetContext();

	let opacity = $state(0);

	let isClosing = $derived(sheetContext.translateY === sheetContext.maxHeight);

	$effect(() => {
		if (sheetContext.isSheetOpen && !isClosing) {
			// Trigger transition
			requestAnimationFrame(() => {
				opacity = 1;
			});
		}

		if (isClosing) {
			opacity = 0;
		}
	});

	const portal = withPortal();

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
					overflow: 'hidden',
					opacity,
					transition: `opacity ${sheetContext.overlayAnimation?.duration}ms ${sheetContext.overlayAnimation?.easing}`
				}
			},
			portal
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
