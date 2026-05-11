<script lang="ts">
	import { localTimeZone, tzAbbr } from '$lib/format';

	let { connected = true }: { connected?: boolean } = $props();

	// SSR renders "UTC" to match server output; client swaps to the
	// browser's actual zone on mount so hydration stays clean.
	let tz = $state('UTC');
	let abbr = $state('UTC');
	$effect(() => {
		tz = localTimeZone();
		abbr = tzAbbr(new Date(), tz) || tz;
	});
</script>

<header
	class="sticky top-0 z-10 hairline backdrop-blur-md"
	style="background-color: rgba(4, 7, 15, 0.7);"
>
	<div class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-3">
		<p class="text-xs text-muted">
			Hotwire Communications · FisionTV+ certifier admin
		</p>
		<div class="flex items-center gap-4 text-xs text-muted">
			<span title="Backend stores all timestamps in UTC; the dashboard renders in your browser's timezone.">
				Timezone <span class="text-foreground">{tz}</span>
				<span class="ml-1 text-muted">({abbr})</span>
			</span>
			<span class="flex items-center gap-2">
				<span
					class="size-1.5 rounded-full"
					style="background: {connected
						? '#34d399'
						: '#f43f5e'}; box-shadow: 0 0 6px rgba(52,211,153,0.6);"
				></span>
				<span>{connected ? 'Backend connected' : 'Backend offline'}</span>
			</span>
		</div>
	</div>
</header>
