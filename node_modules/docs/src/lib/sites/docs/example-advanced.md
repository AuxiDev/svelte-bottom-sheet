<script>
  import PreviewCodeTabs from '#lib/components/PreviewCodeTabs.svelte';
  import SheetFloating from '#lib/components/demo/SheetFloating.svelte';
  import sheetFloatingCode from '#lib/components/demo/SheetFloating.svelte?raw';
  import StackedSheet from '#lib/components/demo/StackedSheet.svelte';
  import stackedSheetCode from '#lib/components/demo/StackedSheet.svelte?raw';
  import SheetNoDrag from '#lib/components/demo/SheetNoDrag.svelte';
  import sheetNoDragCode from '#lib/components/demo/SheetNoDrag.svelte?raw';
</script>

# Advanced Examples

## Floating Sheet

You can create floating sheets by offsetting them from the edge of the screen. Set `sheetSideOffset` to a number representing the offset in pixels. For bottom-positioned sheets, you can also use `left` and `right` styles on `BottomSheet.Sheet` to create space along the sides.

### Styling a Floating Sheet

When styling a floating sheet, avoid applying the background color directly to `BottomSheet.Sheet`. During an overscroll drag (when the sheet is dragged beyond its maximum position / rubberband) the sheet's background color is used to fill the additional space. This can make the sheet appear connected to the screen edges rather than floating above them.

Instead, apply the background color separately to `BottomSheet.Handle` and `BottomSheet.Content`. This keeps the overscroll area visually distinct and preserves the floating appearance of the sheet.

<PreviewCodeTabs language="svelte" source={sheetFloatingCode}>
  {#snippet preview()}
    <SheetFloating />
  {/snippet}
</PreviewCodeTabs>

## Stacked Sheet

Stacked sheets means you have 2 or more sheets on top of each other. They can be configured completely different to achieve truely unique layouts.
With the flag `onlyTopSheetInteractive` you dan decide whether only the top sheet is interactive (shortcuts, dragging, etc.) or if you like chaos! Learn on how to use this setting at [API reference](/docs/api#interaction).

<PreviewCodeTabs language="svelte" source={stackedSheetCode}>
  {#snippet preview()}
    <StackedSheet />
  {/snippet}
</PreviewCodeTabs>

## No-drag-area

You might have areas is your sheets' content which shouldn't cause sheet drag-interaction like carousels.
For these areas you might use the flag `data-sheet-nodrag` which you can apply to any html element.

For example: you can apply it to a div element within the sheet to just make that area non-draggable or just put in into the html-tag to disable dragging for all sheets!

Also useful for selectable areas or if you just want the handle to be draggable!

<PreviewCodeTabs language="svelte" source={sheetNoDragCode}>
  {#snippet preview()}
    <SheetNoDrag />
  {/snippet}
</PreviewCodeTabs>
