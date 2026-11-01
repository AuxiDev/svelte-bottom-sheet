<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';

	let isSecondSheetOpen = $state(false);
</script>

<BottomSheet.Root>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open
	</BottomSheet.Trigger>

	<BottomSheet.Overlay class="bg-black/50" />
	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
		<BottomSheet.Content class="flex justify-center px-6 pb-6">
			<div class="prose prose-sm w-full max-w-lg">
				<h2>You can drag almost every part of this sheet!</h2>

				<div
					class="flex h-50 w-full items-center justify-center rounded-lg border-2 border-dotted border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-900"
					data-sheet-nodrag
				>
					I am a non-draggable area!
				</div>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
