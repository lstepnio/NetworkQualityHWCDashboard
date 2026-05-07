<script lang="ts">
	let { connected = true }: { connected?: boolean } = $props();
</script>

<header
	class="sticky top-0 z-10 hairline backdrop-blur-md"
	style="background-color: rgba(4, 7, 15, 0.7);"
>
	<div class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-3">
		<p class="text-xs text-muted">
			Hotwire Communications · FisionTV+ certifier admin
		</p>
		<div class="flex items-center gap-2 text-xs text-muted">
			<span
				class="size-1.5 rounded-full"
				style="background: {connected
					? '#34d399'
					: '#f43f5e'}; box-shadow: 0 0 6px rgba(52,211,153,0.6);"
			></span>
			<span>{connected ? 'Backend connected' : 'Backend offline'}</span>
		</div>
	</div>
</header>
