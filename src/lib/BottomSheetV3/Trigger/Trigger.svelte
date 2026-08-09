<script lang="ts">
	import { mergeProps } from '$lib/utils/merge-props.js';
	import { withRef } from '$lib/utils/ref-attachment.js';
	import type { TriggerPropsWithChild } from '../index.js';
	import { getSheetContext } from '../context.js';

	let { ref = $bindable(), disabled, child, children, ...rest }: TriggerPropsWithChild = $props();

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
