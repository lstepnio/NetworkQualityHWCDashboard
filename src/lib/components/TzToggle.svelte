<script lang="ts">
	import { tz } from '$lib/timezone.svelte';
	import { localTimeZone, tzAbbr } from '$lib/format';

	let { class: klass = '' }: { class?: string } = $props();

	// SSR-safe: abbreviation depends on the browser's tz, so render nothing
	// until after mount. That keeps server/client HTML identical at hydration.
	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});

	let abbr = $derived.by(() => {
		if (!mounted) return '';
		const zone = tz.useUtc ? 'UTC' : localTimeZone();
		return tzAbbr(new Date(), zone) || zone;
	});
</script>

<button
	type="button"
	onclick={() => tz.toggle()}
	title="Click to switch between local time and UTC"
	aria-label="Toggle timezone between local time and UTC"
	class="ml-1.5 inline-flex cursor-pointer items-center rounded px-1 py-0.5 text-[9.5px] font-medium tracking-[0.08em] text-muted/70 uppercase transition-colors hover:bg-pink-500/5 hover:text-pink-500 {klass}"
>
	{#if abbr}
		({abbr})
	{/if}
</button>
