<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open sheet
	</BottomSheet.Trigger>

	<BottomSheet.Overlay class="bg-black/50" />
	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
		<BottomSheet.Content class="flex justify-center px-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>Meet the Sheet</h2>
				<p>
					Sheets reveal useful content without taking users away from the page. They provide extra
					space for what matters right now.
				</p>

				<h3>What are they good for?</h3>
				<ul>
					<li><strong>Quick actions</strong> - menus, filters and settings.</li>
					<li><strong>Extra context</strong> - details that don't need a whole page.</li>
					<li><strong>Focused flows</strong> - lightweight forms and confirmations.</li>
				</ul>

				<p>
					Drag the handle or body to interact with the sheet. Keep content short, focused and easy
					to scan.
				</p>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
