<script lang="ts">
	let { value }: { value: unknown } = $props();
	let json = $derived(JSON.stringify(value, null, 2));
</script>

<pre
	class="max-h-[70vh] overflow-auto rounded-lg border border-border bg-surface-2/60 p-4 font-mono text-xs leading-relaxed text-foreground/90">
{json}
</pre>
