import Root from './BottomSheet.svelte';
import Sheet from './Sheet/Sheet.svelte';
import Trigger from './Trigger/Trigger.svelte';
import Content from './Content/Content.svelte';
import Handle from './Handle/Handle.svelte';
import Overlay from './Overlay/Overlay.svelte';

export type SheetPositions = 'bottom' | 'top' | 'left' | 'right';
export type AnimationProps = {
  duration?: number;
  easing?: string;
}

export { Root, Sheet, Trigger, Content, Handle, Overlay };

const BottomSheet = Root as typeof Root & {
	Sheet: typeof Sheet;
	Trigger: typeof Trigger;
	Content: typeof Content;
	Handle: typeof Handle;
	Overlay: typeof Overlay;
};

BottomSheet.Sheet = Sheet;
BottomSheet.Trigger = Trigger;
BottomSheet.Content = Content;
BottomSheet.Handle = Handle;
BottomSheet.Overlay = Overlay;

export default BottomSheet;
