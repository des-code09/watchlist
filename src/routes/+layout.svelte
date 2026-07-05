<script lang="ts">
	import '../app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<TopNav user={data.user} />

<main>
	{@render children()}
</main>
