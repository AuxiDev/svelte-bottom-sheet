<script lang="ts">
	import { mergeProps } from '#lib/utils/merge-props.js';
	import { withRef } from '#lib/utils/ref-attachment.js';
	import { getSheetContext } from '../context.js';
	import type { TriggerPropsWithChild } from '../types.js';

	let { ref = $bindable(), disabled, child, children, ...rest }: TriggerPropsWithChild = $props();

	const sheetContext = getSheetContext();

	const mergedProps = $derived(
		mergeProps(
			rest,
			{
				'data-bottomsheet-trigger': '',
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
