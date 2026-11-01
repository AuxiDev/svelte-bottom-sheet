<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';

	let events = $state<
		{
			id: number;
			time: string;
			message: string;
		}[]
	>([]);
	let id = 1;

	const logEvent = (message: string) => {
		events = [
			{
				id: id++,
				time: new Date().toLocaleTimeString(),
				message
			},
			...events
		];
	};
</script>

<BottomSheet.Root
	onopen={() => logEvent('Sheet opened')}
	onclose={() => logEvent('Sheet closed')}
	onsheetdragstart={() => logEvent('Sheet drag started')}
	onsheetdragend={() => logEvent('Sheet drag ended')}
>
	<BottomSheet.Trigger class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
		Open event demo
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="rounded-t-2xl bg-white shadow-xl">
		<BottomSheet.Handle class="flex justify-center py-3">
			<span class="h-1 w-12 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>

		<BottomSheet.Content class="px-5 pb-6">
			<div class="mb-5 flex items-center justify-between">
				<div>
					<h2 class="text-lg font-semibold text-gray-900">Sheet Event Log</h2>
					<p class="mt-1 text-sm text-gray-500">Events triggered by interacting with this sheet.</p>
				</div>

				<button
					onclick={() => (events = [])}
					class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
				>
					Clear
				</button>
			</div>

			{#if events.length === 0}
				<div class="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
					<p class="text-sm font-medium text-gray-700">No events yet</p>
					<p class="mt-1 text-sm text-gray-500">Close or reopen the sheet to see events here.</p>
				</div>
			{:else}
				<ul class="space-y-2">
					{#each events as event (event.id)}
						<li class="flex-1 rounded-lg border border-gray-200 p-3">
							<p class="text-sm font-medium text-gray-900">{event.message}</p>
							<p class="mt-1 font-mono text-xs text-gray-500">{event.time}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
