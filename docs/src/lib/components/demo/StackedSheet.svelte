<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';

	let isSecondSheetOpen = $state(false);
</script>

<BottomSheet.Root>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open first sheet
	</BottomSheet.Trigger>

	<BottomSheet.Overlay class="bg-black/50" />
	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
		<BottomSheet.Content class="flex justify-center px-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>This is one sheet!</h2>
				<p>But you can actually have multiple sheets open at the same time!</p>

				<button
					class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white"
					onclick={() => (isSecondSheetOpen = !isSecondSheetOpen)}>Open second sheet</button
				>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>

<BottomSheet.Root bind:isSheetOpen={isSecondSheetOpen} maxHeight={0.85}>
	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
		<BottomSheet.Content class="flex justify-center px-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>Wow! I'm sheet nr. 2!</h2>
				<p>I can put even more information on one page now!</p>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
