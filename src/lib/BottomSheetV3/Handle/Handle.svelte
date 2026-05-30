<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSheetContext } from '../context.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import Grip from '../Grip/Grip.svelte';

	let {
		ref,
		child,
		children,
		...rest
	}: {
		ref?: HTMLDivElement | null;
		child?: Snippet<[{ props: Record<string, any> }]>;
		children?: Snippet<[]>;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getSheetContext();

	const handleKeyDown = (event: KeyboardEvent) => {
		if (sheetContext.disableDragging) return;

		const snapPoints = [...sheetContext.snapPoints].sort((a, b) => a - b);
		const currentHeight = sheetContext.maxHeight - sheetContext.translateY;

		const currentIndex = snapPoints.findIndex((point) => Math.abs(point - currentHeight) < 1);

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (currentIndex < snapPoints.length - 1) {
					sheetContext.translateY = sheetContext.maxHeight - snapPoints[currentIndex + 1];
				}
				break;

			case 'ArrowDown':
				event.preventDefault();

				if (currentIndex > 0) {
					sheetContext.translateY = sheetContext.maxHeight - snapPoints[currentIndex - 1];
				} else if (!sheetContext.disableClosing) {
					// Set to maxHeight, transitionend will do the rest at sheet
					sheetContext.translateY = sheetContext.maxHeight;
				}
				break;

			case 'Home':
				event.preventDefault();
				sheetContext.translateY = sheetContext.maxHeight - snapPoints[snapPoints.length - 1];
				break;

			case 'End':
				event.preventDefault();
				sheetContext.translateY = sheetContext.maxHeight - snapPoints[0];
				break;
		}
	};

	let mergedProps = $derived(
		mergeProps(
			{
				role: 'button',

				'data-bottomsheet-handle': '',
				tabindex: 0,
				'aria-label': 'Drag to resize or close sheet',
				'aria-expanded': sheetContext.isSheetOpen,
				'data-state': sheetContext.isSheetOpen ? 'open' : 'closed',
				'data-dragging': sheetContext.isDragging ? '' : undefined,
				style: {
					'overflow-y': 'auto',
					'overscroll-behavior-y': 'contain',
					'-webkit-overflow-scrolling': 'touch',
					'touch-action': 'pan-y',
					'background-color': 'white',
					'border-radius': '1rem 1rem 0 0'
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
		<!-- Like in previous versions, render default grip -->
		{#if children}
			{@render children?.()}
		{:else}
			<Grip />
		{/if}
	</div>
{/if}
