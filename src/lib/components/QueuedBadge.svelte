<script lang="ts">
	import { humanizeDelay, QUEUED_BADGE_THRESHOLD_S } from '$lib/format';

	let { delaySeconds }: { delaySeconds: number | null | undefined } = $props();
</script>

{#if delaySeconds != null && delaySeconds > QUEUED_BADGE_THRESHOLD_S}
	<span
		class="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-amber-300 uppercase"
		title="The STB held this row in its local queue before delivering it. The cert ran earlier; the row arrived later."
	>
		<span class="size-1.5 rounded-full bg-amber-400"></span>
		Queued — delivered {humanizeDelay(delaySeconds)} later
	</span>
{/if}
