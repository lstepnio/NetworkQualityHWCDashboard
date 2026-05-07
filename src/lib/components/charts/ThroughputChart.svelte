<script lang="ts">
	import Section from '$lib/components/Section.svelte';

	type Point = { receivedAt: string; download?: number; upload?: number };
	let { data }: { data: Point[] } = $props();

	const W = 600;
	const H = 220;
	const PAD = { top: 12, right: 12, bottom: 24, left: 36 };

	let xs = $derived(data.map((_, i) => i));
	let allValues = $derived(
		data.flatMap((d) => [d.download, d.upload]).filter((v): v is number => v != null)
	);
	let yMax = $derived(allValues.length === 0 ? 100 : Math.max(...allValues) * 1.1);
	let yMin = 0;

	function x(i: number): number {
		if (xs.length <= 1) return PAD.left + (W - PAD.left - PAD.right) / 2;
		return PAD.left + (i / (xs.length - 1)) * (W - PAD.left - PAD.right);
	}
	function y(v: number): number {
		return H - PAD.bottom - ((v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom);
	}

	let downloadPath = $derived(buildPath(data.map((d) => d.download)));
	let uploadPath = $derived(buildPath(data.map((d) => d.upload)));

	function buildPath(values: (number | undefined)[]): string {
		const parts: string[] = [];
		let started = false;
		values.forEach((v, i) => {
			if (v == null) {
				started = false;
				return;
			}
			parts.push(`${started ? 'L' : 'M'}${x(i)},${y(v)}`);
			started = true;
		});
		return parts.join(' ');
	}

	function tickValues(steps = 4): number[] {
		const out: number[] = [];
		for (let i = 0; i <= steps; i++) {
			out.push((i / steps) * yMax);
		}
		return out;
	}
</script>

<Section title="Throughput over time" description="Download (pink) vs upload (cyan), Mbps">
	{#if data.length === 0}
		<p class="py-12 text-center text-sm text-muted">No certifications yet.</p>
	{:else}
		<svg viewBox="0 0 {W} {H}" class="h-64 w-full" preserveAspectRatio="none">
			<!-- Y-axis ticks + grid -->
			{#each tickValues() as t (t)}
				<line
					x1={PAD.left}
					y1={y(t)}
					x2={W - PAD.right}
					y2={y(t)}
					stroke="rgba(255,255,255,0.06)"
					stroke-dasharray="3 3"
				/>
				<text
					x={PAD.left - 6}
					y={y(t) + 3}
					font-size="9"
					fill="#8A96AD"
					text-anchor="end"
				>
					{Math.round(t)}
				</text>
			{/each}

			<!-- Upload line -->
			<path d={uploadPath} fill="none" stroke="#67E8F9" stroke-width="1.75" stroke-opacity="0.85" />

			<!-- Download line -->
			<path d={downloadPath} fill="none" stroke="#EE3D5B" stroke-width="2.25" />

			<!-- X-axis labels (first + last) -->
			{#if data.length > 0}
				<text
					x={PAD.left}
					y={H - PAD.bottom + 14}
					font-size="9"
					fill="#8A96AD"
					text-anchor="start"
				>
					{new Date(data[0].receivedAt).toLocaleTimeString(undefined, {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</text>
				<text
					x={W - PAD.right}
					y={H - PAD.bottom + 14}
					font-size="9"
					fill="#8A96AD"
					text-anchor="end"
				>
					{new Date(data[data.length - 1].receivedAt).toLocaleTimeString(undefined, {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</text>
			{/if}
		</svg>
		<div class="mt-3 flex items-center gap-4 text-xs">
			<span class="flex items-center gap-1.5 text-muted">
				<span class="size-2 rounded-full" style="background: #EE3D5B;"></span> Download
			</span>
			<span class="flex items-center gap-1.5 text-muted">
				<span class="size-2 rounded-full" style="background: #67E8F9;"></span> Upload
			</span>
		</div>
	{/if}
</Section>
