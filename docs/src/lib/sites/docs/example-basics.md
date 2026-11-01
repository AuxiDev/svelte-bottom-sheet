<script>
  import PreviewCodeTabs from '#lib/components/PreviewCodeTabs.svelte';
  import SheetBasic from '#lib/components/demo/SheetBasic.svelte';
  import sheetCode from '#lib/components/demo/SheetBasic.svelte?raw';
  import SheetLeft from '#lib/components/demo/SheetLeft.svelte';
  import sheetLeftCode from '#lib/components/demo/SheetLeft.svelte?raw';
  import SheetRight from '#lib/components/demo/SheetRight.svelte';
  import sheetRightCode from '#lib/components/demo/SheetRight.svelte?raw';
  import SheetTop from '#lib/components/demo/SheetTop.svelte';
  import sheetTopCode from '#lib/components/demo/SheetTop.svelte?raw';
  import SheetSnappoint from '#lib/components/demo/SheetSnappoint.svelte';
  import sheetSnappointCode from '#lib/components/demo/SheetSnappoint.svelte?raw';
  import SheetScrollable from '#lib/components/demo/SheetScrollable.svelte';
  import sheetScrollableCode from '#lib/components/demo/SheetScrollable.svelte?raw';
  import SheetEvent from '#lib/components/demo/SheetEvent.svelte';
  import sheetEventCode from '#lib/components/demo/SheetEvent.svelte?raw';
</script>

# Basic Examples

Here are some basic examples to show what you can do with the sheet. Each example has a preview you can try out and the source code you can use in your own project.

## Basic Sheet

This is the most basic sheet. You've probably seen this kind of sheet in a mobile app or on a mobile website. It slides up from the bottom of the screen and can be used to show extra content without leaving the current page.

You can put pretty much anything inside it, like buttons, forms, text or other components.

You can also a a `BottomSheet.Overlay` component to provide a backdrop. (Don't forget to style the `background-color`!)

<PreviewCodeTabs language="svelte" source={sheetCode}>
  {#snippet preview()}
    <SheetBasic />
  {/snippet}
</PreviewCodeTabs>

## Sheet with different positions

A sheet doesn't have to come from the bottom. You can make it slide in from any of the four sides of the screen: `bottom`, `top`, `left`, or `right`. [API-Reference](/docs/api#state-and-layout)

This can be useful for things like sidebars, menus or panels with extra information.

### Left-positioned sheet

The sheet slides in from the left. This works well for navigation menus or side panels.

<PreviewCodeTabs language="svelte" source={sheetLeftCode}>
  {#snippet preview()}
    <SheetLeft />
  {/snippet}
</PreviewCodeTabs>

### Right-positioned sheet

The sheet slides in from the right. You could use it for settings, filters or showing details about something on the page.

<PreviewCodeTabs language="svelte" source={sheetRightCode}>
  {#snippet preview()}
    <SheetRight />
  {/snippet}
</PreviewCodeTabs>

### Top-positioned sheet

The sheet slides down from the top. This can be useful for notifications, search panels, or other small pieces of content.
Probably the least used variant.

<PreviewCodeTabs language="svelte" source={sheetTopCode}>
  {#snippet preview()}
    <SheetTop />
  {/snippet}
</PreviewCodeTabs>

## Sheet with snappoints

Snap points let you define different heights at which the sheet can stop when you drag it. This way, the user can move between different sizes instead of only opening or closing the sheet.

In this example, the sheet has three snap points: 25%, 50% and 100% of its maximum height. It starts at 50%.

When you release the sheet, it snaps to a suitable point based on the drag direction and current position. This is useful when you want to show some content first and let the user expand the sheet to see more.

<PreviewCodeTabs language="svelte" source={sheetSnappointCode}>
  {#snippet preview()}
    <SheetSnappoint />
  {/snippet}
</PreviewCodeTabs>

The example sheet will snap to 25%, 50% and 100% of the sheets height. It will start at 50%.

## Scrollable Sheet

If the sheet contains more content than fits on the screen, you can scroll through it.

The sheet also supports dragging while handling scrollable content. When you scroll inside the content, the sheet tries to let the content scroll first. Dragging the sheet takes over when appropriate, for example when you reach the top or bottom of the scrollable area.

You can also combine scrolling with snap points, so users can change the sheet's height and scroll through its content.

<PreviewCodeTabs language="svelte" source={sheetScrollableCode}>
  {#snippet preview()}
    <SheetScrollable />
  {/snippet}
</PreviewCodeTabs>

## Event Sheet

The sheet provides callbacks for different events. You can use them to react when the sheet opens or closes, or when the user starts and stops dragging it.

This example logs the events as they happen, so you can try them out and see when each callback is called.
All Events: [API-Reference](/docs/api#events)

<PreviewCodeTabs language="svelte" source={sheetEventCode}>
  {#snippet preview()}
    <SheetEvent />
  {/snippet}
</PreviewCodeTabs>
