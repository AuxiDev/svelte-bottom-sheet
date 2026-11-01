<script lang="ts">
	import { getSheetContext } from '../context.js';
	import { mergeProps } from '#lib/utils/merge-props.js';
	import { withPortal } from '#lib/utils/portal.svelte.js';
	import type { OverlayPropsWithChild } from '../types.js';
	import { withRef } from '#lib/utils/ref-attachment.js';

	let { children, ref, child, ...rest }: OverlayPropsWithChild = $props();

	const sheetContext = getSheetContext();

	let opacity = $state(0);

	let isClosing = $derived(sheetContext.sheetOffsetInPx >= sheetContext.maxHeightInPx);

	$effect(() => {
		if (sheetContext.isSheetOpenInternal && !isClosing) {
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
				'data-bottomsheet-overlay': '',
				style: {
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflow: 'hidden',
					opacity,
					transition: `opacity ${sheetContext.overlayAnimation?.durationInMs}ms ${sheetContext.overlayAnimation?.easing}`
				}
			},
			portal,
			withRef((el) => (ref = el as HTMLDivElement))
		)
	);
</script>

{#if sheetContext.isSheetOpenInternal}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}></div>
	{/if}
{/if}
{@render children?.()}
