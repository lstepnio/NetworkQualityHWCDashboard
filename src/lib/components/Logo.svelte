<script lang="ts">
	let { class: className = 'size-8' }: { class?: string } = $props();
</script>

<svg
	viewBox="0 0 32 32"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
	aria-hidden="true"
>
	<rect width="32" height="32" rx="8" fill="#0E1B2D" />
	<rect y="26" width="32" height="6" rx="0" fill="#EE3D5B" />
	<rect x="14" y="14" width="3" height="10" fill="#EE3D5B" />
	<rect x="19" y="11" width="3" height="13" fill="#EE3D5B" />
	<rect x="24" y="8" width="3" height="16" fill="#EE3D5B" />
	<path d="M8 8c0-2 4-2 4 0v8h-1v-7c0-1.4-2-1.4-2 0v7H8z" fill="#FFFFFF" />
</svg>
