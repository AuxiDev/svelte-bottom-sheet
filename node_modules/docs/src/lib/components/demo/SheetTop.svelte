<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root position="top" maxHeight={0.5}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Look up (top sheet)
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="rounded-b-2xl bg-white shadow-sheet-top">
		<BottomSheet.Content class="px-6 py-8">
			<div class="mx-auto prose prose-sm max-w-125 text-center">
				<h2>Well, hello up there.</h2>
				<p>
					Top sheets slide down from above, making them perfect for announcements, quick actions,
					and little surprises. Think of them as your interface giving you a friendly tap on the
					shoulder - without interrupting your entire day.
				</p>
				<p>
					<strong>Breaking news:</strong> You're doing great. Carry on.
				</p>
			</div>
		</BottomSheet.Content>
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
	</BottomSheet.Sheet>
</BottomSheet.Root>
