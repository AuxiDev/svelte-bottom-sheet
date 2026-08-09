<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { GripPropsWithChild } from '../index.js';

	let { ref = $bindable(), child, children, ...rest }: GripPropsWithChild = $props();

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
