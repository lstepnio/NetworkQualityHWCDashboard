<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="space-y-4">
	<p class="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">Error</p>
	<h1 class="text-[32px] leading-[1.05] font-semibold tracking-[-0.022em]">
		{page.status}
		<span class="text-muted">— {page.error?.message ?? 'Something went wrong'}</span>
	</h1>
	<a href="/" class="inline-block text-sm text-pink-500 hover:underline">← Back to overview</a>
</div>
