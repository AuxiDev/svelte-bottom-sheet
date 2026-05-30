import { createAttachmentKey, type Attachment } from 'svelte/attachments';

export const PORTAL_KEY = createAttachmentKey();

/**
 * Returns a props object containing the attachment to portal the element to the body.
 */
export const withPortal = () => {
	return {
		[PORTAL_KEY]: ((node: HTMLElement) => {
			let host = document.getElementById('svelte-portal-host');

			if (!host) {
				host = document.createElement('div');
				host.id = 'svelte-portal-host';
				document.body.appendChild(host);
			}

			host.appendChild(node);

			return () => {
				if (node.parentNode === host) {
					host.removeChild(node);
				}

				if (host && host.childNodes.length === 0) {
					host.remove();
				}
			};
		}) as Attachment
	};
};
