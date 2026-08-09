import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type SheetPositions = 'bottom' | 'top' | 'left' | 'right';
export type AnimationProps = {
	duration?: number;
	easing?: string;
};

type WithChild<T extends object> = T & {
	child?: Snippet<[{ props: Record<string, any> }]>;
};

export type BottomSheetProps = {
	onopen?: () => void;
	onclose?: () => void;
	onsheetdrag?: () => void;
	onsheetdragstart?: () => void;
	onsheetdragend?: () => void;
	onsnap?: (point: number) => void;
	isSheetOpen?: boolean;
	closeThreshold?: number;
	disableBackgroundInteraction?: boolean;
	autoCloseThreshold?: number;
	maxHeight?: number;
	snapPoints?: number[];
	startingSnapPoint?: number;
	disableDragging?: boolean;
	onlyTopSheetInteractive?: boolean;
	position?: SheetPositions;
	disableClosing?: boolean;
	maxDragPoint?: number;
	enableScrollDragTakeover?: boolean;
	disableClickOutside?: boolean;
	disableFocusTrap?: boolean;
	disableEscape?: boolean;
	children?: Snippet<[]>;
	sheetAnimation?: AnimationProps;
	overlayAnimation?: AnimationProps;
};

export type BottomSheetPropsWithChild = WithChild<BottomSheetProps>;

export type SheetProps = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet<[]>;
	ref?: HTMLDivElement | null;
};

export type SheetPropsWithChild = WithChild<SheetProps>;

export type TriggerProps = HTMLButtonAttributes & {
	children?: Snippet<[]>;
	ref?: HTMLButtonElement | null;
};

export type TriggerPropsWithChild = WithChild<TriggerProps>;

export type ContentProps = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet<[]>;
	ref?: HTMLDivElement | null;
};

export type ContentPropsWithChild = WithChild<ContentProps>;

export type HandleProps = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet<[]>;
	ref?: HTMLDivElement | null;
};

export type HandlePropsWithChild = WithChild<HandleProps>;

export type OverlayProps = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet<[]>;
};

export type OverlayPropsWithChild = WithChild<OverlayProps>;

export type GripProps = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet<[]>;
	ref?: HTMLDivElement | null;
};

export type GripPropsWithChild = WithChild<GripProps>;
