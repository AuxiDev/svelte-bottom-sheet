import { createAttachmentKey, type Attachment } from 'svelte/attachments';

export const INTERNAL_REF_KEY = createAttachmentKey();

/**
 * Returns a props object containing the attachment for a ref.
 */
export const withRef = (setter: (el: HTMLElement | null) => void) => {
	return {
		[INTERNAL_REF_KEY]: ((node: HTMLElement) => {
			setter(node);
			return () => setter(null);
		}) as Attachment
	};
};
