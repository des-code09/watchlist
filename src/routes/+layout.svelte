<script lang="ts">
	import '../app.css';
	import PopcornBurst from '$lib/components/PopcornBurst.svelte';
	import TopNav from '$lib/components/TopNav.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<TopNav user={data.user} />
<PopcornBurst />

<main>
	{@render children()}
</main>
