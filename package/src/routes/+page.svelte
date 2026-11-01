<script lang="ts">
	import * as BottomSheet from '#lib';

	let isInnerOpen = $state(false);
</script>

<p>Testing-Lab</p>
<div style="background-color: red; height: 10000px">
	<button onclick={() => (isInnerOpen = !isInnerOpen)}>click</button>
	<BottomSheet.Root
		maxHeight={0.5}
		disableBackgroundInteraction={false}
		snapPoints={[0.5, 1]}
		position="bottom"
		sheetSideOffset={8}
		fitContent
	>
		<BottomSheet.Trigger>OPEN</BottomSheet.Trigger>

		<BottomSheet.Sheet style=" left: 8px; right: 8px;">
			<BottomSheet.Handle style=" height: 30px; width: 100%; background-color: green;"
				>123</BottomSheet.Handle
			>
			<BottomSheet.Content style="background-color: white;  width: 100%;   ">
				<p>hi</p>
				<button onclick={() => (isInnerOpen = !isInnerOpen)}>click</button>
			</BottomSheet.Content>
		</BottomSheet.Sheet>
	</BottomSheet.Root>
	<BottomSheet.Root
		disableBackgroundInteraction={false}
		maxHeight={0.5}
		bind:isSheetOpen={isInnerOpen}
		position="left"
		sheetSideOffset={8}
		fitContent
	>
		<BottomSheet.Sheet style=" top: 8px; bottom: 8px;  ">
			<BottomSheet.Content
				style="background-color:bisque;  height: 100%;  bottom: 8px; display: flex;  flex-direction: column; align-items: center; justify-content: center; "
			>
				<p>inner</p>
			</BottomSheet.Content>
			<BottomSheet.Handle style=" height: 100%; width: 30px; background-color: green;"
				>123</BottomSheet.Handle
			>
		</BottomSheet.Sheet>
	</BottomSheet.Root>
</div>
