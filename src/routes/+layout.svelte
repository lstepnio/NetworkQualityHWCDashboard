<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>FisionTV+ Certifier · Admin</title>
	<meta
		name="description"
		content="Certification reporting and config management for the HWC fleet."
	/>
</svelte:head>

<div class="flex min-h-screen">
	<Sidebar />
	<div class="flex min-w-0 flex-1 flex-col">
		<Topbar />
		<main class="mx-auto w-full max-w-[1400px] flex-1 px-8 py-8">
			{@render children()}
		</main>
	</div>
</div>
