import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type SheetPosition = 'bottom' | 'top' | 'left' | 'right';
export type AnimationProps = {
	durationInMs?: number;
	easing?: string;
};

type WithChild<T extends object> = T & {
	child?: Snippet<[{ props: Record<string, any> }]>;
};

export type BottomSheetProps = {
	children: Snippet<[]>;
	isSheetOpen?: boolean;
	maxHeight?: number;
	position?: SheetPosition;
	disableClosing?: boolean;
	closeThreshold?: number;
	autoCloseThreshold?: number;
	snapPoints?: number[];
	maxDragPoint?: number;
	fitContent?: boolean;
	startingSnapPoint?: number;
	sheetSideOffset?: number;
	disableBackgroundInteraction?: boolean;
	disableClickOutside?: boolean;
	disableFocusTrap?: boolean;
	disableEscape?: boolean;
	disableRubberband?: boolean;
	disableDragging?: boolean;
	onlyTopSheetInteractive?: boolean;
	sheetAnimation?: AnimationProps;
	overlayAnimation?: AnimationProps;
	onopen?: () => void;
	onclose?: () => void;
	onsheetdrag?: () => void;
	onsheetdragstart?: () => void;
	onsheetdragend?: () => void;
	onsnap?: (point: number) => void;
};

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
	ref?: HTMLDivElement | null;
};

export type OverlayPropsWithChild = WithChild<OverlayProps>;
