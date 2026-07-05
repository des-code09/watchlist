<script lang="ts">
	import Clapperboard from '@lucide/svelte/icons/clapperboard';
	import type { User } from 'better-auth';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';

	let { user }: { user: User | null } = $props();
</script>

<header class="top-nav">
	<div class="top-nav-inner">
		<div class="brand">
			<div class="brand-mark">
				<Clapperboard size={24} strokeWidth={1.75} />
			</div>
			<div class="brand-copy">
				<h1>Watchlist</h1>
				<p class="subtitle">Movies you want to see</p>
			</div>
		</div>
		<div class="top-nav-actions">
			<ThemeToggle />
			{#if user}
				<UserMenu {user} />
			{/if}
		</div>
	</div>
</header>
