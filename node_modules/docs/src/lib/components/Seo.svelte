<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME, SITE_URL } from '#lib/config.ts';
	import { getPageSeo } from '#lib/seo.ts';

	const organizationUrl = 'https://github.com/AuxiDev';

	let pathname = $derived(page.url.pathname);
	let seo = $derived(getPageSeo(pathname));

	let canonicalUrl = $derived(
		`${SITE_URL.replace(/\/+$/, '')}${pathname === '/' ? '/' : pathname}`
	);

	let imageUrl = $derived(`${SITE_URL.replace(/\/+$/, '')}/og-image.png'`);

	let isHome = $derived(pathname === '/');

	let breadcrumbs = $derived(
		pathname.startsWith('/docs/')
			? [
					{ name: 'Home', url: `${SITE_URL}/` },
					{ name: 'Documentation', url: `${SITE_URL}/docs/getting-started` },
					{ name: seo.title.replace(/ - svelte-bottom-sheet$/, ''), url: canonicalUrl }
				]
			: []
	);

	let structuredData = $derived(
		isHome
			? [
					{
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: SITE_NAME,
						url: `${SITE_URL}/`,
						description: seo.description
					},
					{
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: SITE_NAME,
						applicationCategory: 'DeveloperApplication',
						operatingSystem: 'Any',
						description: seo.description,
						url: `${SITE_URL}/`,
						codeRepository: 'https://github.com/AuxiDev/svelte-bottom-sheet',
						downloadUrl: 'https://www.npmjs.com/package/svelte-bottom-sheet',
						author: {
							'@type': 'Organization',
							name: 'AuxiDev',
							url: organizationUrl
						},
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'USD'
						}
					}
				]
			: [
					{
						'@context': 'https://schema.org',
						'@type': 'TechArticle',
						headline: seo.title,
						description: seo.description,
						url: canonicalUrl,
						mainEntityOfPage: canonicalUrl,
						author: {
							'@type': 'Organization',
							name: 'AuxiDev',
							url: organizationUrl
						},
						publisher: {
							'@type': 'Organization',
							name: 'AuxiDev',
							url: organizationUrl
						},
						isPartOf: {
							'@type': 'WebSite',
							name: SITE_NAME,
							url: `${SITE_URL}/`
						}
					},
					{
						'@context': 'https://schema.org',
						'@type': 'BreadcrumbList',
						itemListElement: breadcrumbs.map((item, index) => ({
							'@type': 'ListItem',
							position: index + 1,
							name: item.name,
							item: item.url
						}))
					}
				]
	);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content="index, follow, max-image-preview:large" />

	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={seo.title} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={imageUrl} />

	{#each structuredData as schema, index (index)}
		<script type="application/ld+json">
{JSON.stringify(schema)}
		</script>
	{/each}
</svelte:head>
