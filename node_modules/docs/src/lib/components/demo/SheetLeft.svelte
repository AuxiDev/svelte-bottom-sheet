<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root position="left" maxHeight={0.5}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Open left sheet
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="flex-row! rounded-r-2xl bg-white shadow-sheet-top">
		<BottomSheet.Content class="flex justify-center py-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>Make room for more</h2>
				<p>
					Left sheets slide in from the side, giving you space to present supplementary content
					without navigating away from the current page. They are especially useful for interfaces
					where users need to explore, adjust or reference information while keeping the main
					content in view.
				</p>

				<h3>When to use a left sheet</h3>
				<ul>
					<li>
						<strong>Navigation menus</strong> - provide quick access to pages and sections without leaving
						the current view.
					</li>
					<li>
						<strong>Filters and controls</strong> - let users refine search results, configure options
						or adjust settings in context.
					</li>
				</ul>
				<p>
					Use left sheets when secondary content benefits from a persistent side-by-side
					relationship with the main view. For short, mobile-first actions, a bottom sheet may be a
					better fit.
				</p>
			</div>
		</BottomSheet.Content>

		<BottomSheet.Handle class="flex items-center px-3">
			<span class="h-12 w-1 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
	</BottomSheet.Sheet>
</BottomSheet.Root>
