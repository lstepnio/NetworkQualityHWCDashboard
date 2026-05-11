<script lang="ts">
	import { formatAbsolute, localTimeZone } from '$lib/format';

	let {
		iso,
		fallback = '—',
		class: klass = ''
	}: { iso: string | null | undefined; fallback?: string; class?: string } = $props();

	// SSR (and pre-hydration) render in UTC so server/client output matches
	// and hydration doesn't warn. After mount we swap to the browser's TZ.
	let tz = $state('UTC');
	$effect(() => {
		tz = localTimeZone();
	});

	let text = $derived(iso ? formatAbsolute(iso, tz) : fallback);
	let titleAttr = $derived(iso ? `UTC: ${formatAbsolute(iso, 'UTC')}` : '');
</script>

<time datetime={iso ?? ''} title={titleAttr} class={klass}>{text}</time>
