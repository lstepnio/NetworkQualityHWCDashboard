<script lang="ts">
	import { formatAbsolute, localTimeZone } from '$lib/format';
	import { tz } from '$lib/timezone.svelte';

	let {
		iso,
		fallback = '—',
		class: klass = ''
	}: { iso: string | null | undefined; fallback?: string; class?: string } = $props();

	// SSR (and pre-hydration) render in UTC so server/client output matches
	// and hydration doesn't warn. After mount we swap to whichever zone the
	// user has selected via the TzToggle.
	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});

	let activeTz = $derived.by(() => {
		if (!mounted) return 'UTC';
		return tz.useUtc ? 'UTC' : localTimeZone();
	});
	let altTz = $derived(activeTz === 'UTC' ? localTimeZone() : 'UTC');

	let text = $derived(iso ? formatAbsolute(iso, activeTz) : fallback);
	let titleAttr = $derived(iso ? `${altTz}: ${formatAbsolute(iso, altTz)}` : '');
</script>

<time datetime={iso ?? ''} title={titleAttr} class={klass}>{text}</time>
