<script lang="ts">
	import { mergeProps } from '#lib/utils/merge-props.js';
	import { getSheetContext } from '../context.js';
	import { withRef } from '#lib/utils/ref-attachment.js';
	import type { HandlePropsWithChild } from '../types.js';

	let { ref, child, children, ...rest }: HandlePropsWithChild = $props();

	const sheetContext = getSheetContext();

	const handleKeyDown = (event: KeyboardEvent) => {
		if (sheetContext.isDraggingDisabled) return;

		const snapPoints = [...sheetContext.snapPoints].sort((a, b) => a - b);
		const currentHeight = sheetContext.maxHeightInPx - sheetContext.sheetOffsetInPx;

		const currentIndex = snapPoints.findIndex((point) => Math.abs(point - currentHeight) < 1);

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (currentIndex < snapPoints.length - 1) {
					sheetContext.setSheetOffset(sheetContext.maxHeightInPx - snapPoints[currentIndex + 1]);
				}
				break;

			case 'ArrowDown':
				event.preventDefault();

				if (currentIndex > 0) {
					sheetContext.setSheetOffset(sheetContext.maxHeightInPx - snapPoints[currentIndex - 1]);
				} else if (!sheetContext.isClosingDisabled) {
					sheetContext.closeSheet();
				}
				break;

			case 'Home':
				event.preventDefault();
				sheetContext.setSheetOffset(sheetContext.maxHeightInPx - snapPoints[snapPoints.length - 1]);
				break;

			case 'End':
				event.preventDefault();
				sheetContext.setSheetOffset(sheetContext.maxHeightInPx - snapPoints[0]);
				break;
		}
	};

	let mergedProps = $derived(
		mergeProps(
			{
				role: 'button',
				tabindex: sheetContext.isDraggingDisabled ? undefined : 0,
				'aria-label': 'Resize sheet',
				'aria-keyshortcuts': 'ArrowUp ArrowDown Home End',
				'data-bottomsheet-handle': '',
				'data-position': sheetContext.position,
				'data-state': sheetContext.isSheetOpenInternal ? 'open' : 'closed',
				'data-disabled': String(sheetContext.isDraggingDisabled),
				style: {
					'overscroll-behavior': 'contain',
					'-webkit-overflow-scrolling': 'touch'
				},
				onkeydown: (e: KeyboardEvent) => handleKeyDown(e)
			},
			rest,
			withRef((el) => (ref = el as HTMLDivElement | null))
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
