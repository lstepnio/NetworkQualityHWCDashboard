<script lang="ts">
	let { rating }: { rating: string | null | undefined } = $props();

	const STYLES: Record<string, string> = {
		STRONG: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
		GOOD: 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30',
		MARGINAL: 'bg-amber-400/15 text-amber-200 border border-amber-400/30',
		WEAK: 'bg-red-500/15 text-red-200 border border-red-500/30'
	};
	const FALLBACK = 'bg-white/10 text-white/60 border border-white/15';
	const label = $derived(rating ?? '—');
	const style = $derived(rating ? (STYLES[rating] ?? FALLBACK) : FALLBACK);
</script>

<span
	class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide uppercase {style}"
>
	{label}
</span>
