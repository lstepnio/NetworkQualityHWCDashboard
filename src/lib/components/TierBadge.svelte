<script lang="ts">
	import { tierLabel } from '$lib/format';

	let { tier }: { tier: string } = $props();

	const STYLES: Record<string, string> = {
		uhd_hdr:
			'bg-pink-500 text-white border-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_4px_16px_-6px_rgba(238,61,91,0.6)]',
		uhd: 'bg-pink-700 text-white border-transparent',
		hd: 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30',
		sd: 'bg-white/10 text-white/80 border border-white/15',
		none: 'bg-red-500/15 text-red-200 border border-red-500/30'
	};
	const FALLBACK = 'bg-white/10 text-white/80 border border-white/15';
</script>

<span
	class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide uppercase {STYLES[
		tier
	] ?? FALLBACK}"
>
	{tierLabel(tier)}
</span>
