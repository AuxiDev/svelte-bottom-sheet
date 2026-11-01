<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';

	let snappoints = $state([1]);

	const toggleSnappoints = () => {
		if (snappoints.length === 1) snappoints = [0.25, 0.5, 1];
		else snappoints = [1];
	};
</script>

<BottomSheet.Root snapPoints={snappoints}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open scrolling sheet
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>

		<BottomSheet.Content class="px-6 pb-6">
			<p>
				A scrollable sheet can also be scrollable when not at the top-most snappoint! Toggle to try.
				(use a touch device)
			</p>
			<button
				onclick={toggleSnappoints}
				class="mt-4 mb-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
			>
				Toggle Snappoints
			</button>

			<div class="space-y-3">
				{#each Array.from({ length: 12 }, (_, i) => i + 1) as number}
					<div class="rounded-xl border border-gray-200 bg-white p-4">
						<h3 class="text-sm font-semibold text-gray-900">Card {number}</h3>
						<p class="mt-2 text-sm leading-relaxed text-gray-600">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						</p>
					</div>
				{/each}
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
