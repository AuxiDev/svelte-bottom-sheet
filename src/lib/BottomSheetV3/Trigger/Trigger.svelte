<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getSheetContext } from '../context.js';

	let {
		ref = $bindable(),
		disabled,
		child,
		children,
		...rest
	}: {
		disabled?: boolean;
		ref?: HTMLButtonElement;
		child?: Snippet<[{ props: Record<string, any> }]>;
		children?: Snippet<[]>;
	} & HTMLButtonAttributes = $props();

	const sheetContext = getSheetContext();

	const mergedProps = $derived(
		mergeProps(
			rest,
			{
				disabled,
				onclick: () => {
					if (disabled) return;
					sheetContext.toggleSheet();
				},
				type: 'button'
			},
			withRef((el) => (ref = el as HTMLButtonElement))
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else if children}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
