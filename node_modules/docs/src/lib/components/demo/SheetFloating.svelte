<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root sheetSideOffset={16}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open floating sheet
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="right-4! left-4!  rounded-2xl shadow-2xl">
		<BottomSheet.Handle class="flex justify-center rounded-t-2xl bg-white py-3">
			<span class="h-1 w-12 rounded-full bg-gray-300"></span>
		</BottomSheet.Handle>

		<BottomSheet.Content class="flex justify-center rounded-b-2xl bg-white px-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<p class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Design details</p>

				<h2>A little space makes a difference</h2>

				<p>
					A floating sheet sits slightly away from the edge of the screen, creating a sense of depth
					and separation from the underlying page.
				</p>

				<h3>What makes it float?</h3>

				<ul>
					<li>
						<strong>16px side offset:</strong> creates space between the sheet and the screen edges.
					</li>
					<li>
						<strong>Rounded corners:</strong> reinforce the detached, card-like appearance.
					</li>
					<li>
						<strong>Subtle shadow:</strong> adds depth and helps distinguish the sheet from the page.
					</li>
				</ul>

				<h3>Handle and content backgrounds</h3>

				<p>
					Notice that the white background is applied to <code>BottomSheet.Handle</code> and
					<code>BottomSheet.Content</code>, rather than directly to <code>BottomSheet.Sheet</code>.
					This keeps the overscroll area visually separate when you drag the sheet beyond its normal
					position.
				</p>

				<p>
					<strong>Try it:</strong> Drag the sheet down or up and observe how it moves while remaining
					visually detached from the edges.
				</p>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
