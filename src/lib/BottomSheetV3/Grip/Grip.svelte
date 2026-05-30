<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(),
		child,
		children,
		...rest
	}: {
		ref?: HTMLDivElement | null;
		child?: Snippet<[{ props: Record<string, any> }]>;
		children?: Snippet<[]>;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-bottomsheet-grip': '',
				style: {
					width: '40px',
					height: '4px',
					'background-color': '#e0e0e0',
					'border-radius': '2px',
					margin: '1rem auto',
					'pointer-events': 'none'
				}
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
