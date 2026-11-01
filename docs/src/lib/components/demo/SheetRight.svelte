<script lang="ts">
	import * as BottomSheet from 'svelte-bottom-sheet';
</script>

<BottomSheet.Root position="right" maxHeight={0.5}>
	<BottomSheet.Trigger class="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white">
		Discover right sheet
	</BottomSheet.Trigger>

	<BottomSheet.Sheet class="h-full rounded-l-2xl bg-white shadow-sheet-top">
		<BottomSheet.Handle class="flex items-center px-3">
			<span class="h-12 w-1 rounded-full bg-gray-200"></span>
		</BottomSheet.Handle>
		<BottomSheet.Content class="flex justify-center py-6 pb-6">
			<div class="prose prose-sm max-w-125">
				<h2>Life is weird. Butterflies are weirder.</h2>
				<p>
					Somewhere out there, a butterfly is having the best day of its life. It has no meetings,
					no unread emails and absolutely no idea what a JavaScript framework is. Honestly? It's
					winning.
				</p>

				<h3>Important facts nobody asked for</h3>
				<ul>
					<li>
						<strong>Butterflies taste with their feet.</strong> Imagine stepping on a cookie and immediately
						knowing it's delicious.
					</li>
					<li>
						<strong>You are made of star stuff.</strong> The atoms in your body were forged through cosmic
						processes. You are literally the universe doing a little side quest.
					</li>
					<li>
						<strong>Somewhere, flowers are blooming.</strong> Completely unbothered by deadlines, software
						updates, or the fact that you opened this panel.
					</li>
					<li>
						<strong>Butterflies start as caterpillars.</strong> They dissolve and reorganize much of their
						bodies during metamorphosis. Nature really said: "What if we rebuilt everything?"
					</li>
				</ul>

				<h3>So, what's the point?</h3>
				<p>
					Maybe life doesn't need a grand purpose every single Tuesday. Maybe sometimes the point is
					to drink some water, laugh at a terrible joke, and watch a tiny winged creature make
					questionable navigation decisions.
				</p>

				<h3>A message from the butterfly council</h3>
				<blockquote>
					"Please stop chasing us. We are doing our best. Also, your garden could use more flowers."
				</blockquote>

				<p>
					<strong>Remember:</strong> You survived every awkward moment of your life so far. You're basically
					a caterpillar with Wi-Fi. Go be magnificent.
				</p>
			</div>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet.Root>
