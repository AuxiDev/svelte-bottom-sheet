<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root snapPoints={[0.25, 0.5, 1]}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open snappy sheet
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>

		<BottomSheet.Content class="flex justify-center px-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>Meet the Sheet</h2>
				<p>HI! I am a sheet with snappoints. I can also be scrollable while being snappable!</p>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
