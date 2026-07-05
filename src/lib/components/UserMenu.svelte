<script lang="ts">
	import { enhance } from '$app/forms';
	import LogOut from '@lucide/svelte/icons/log-out';
	import type { User } from 'better-auth';
	import { getInitials } from '$lib/user';

	let { user }: { user: User } = $props();

	let open = $state(false);
	let menuEl = $state<HTMLDivElement | null>(null);

	const displayName = $derived(user.name?.trim() || user.email);

	function toggleMenu() {
		open = !open;
	}

	function closeMenu() {
		open = false;
	}

	function handleWindowClick(event: MouseEvent) {
		if (menuEl && !menuEl.contains(event.target as Node)) {
			closeMenu();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}

	$effect(() => {
		if (!open) return;

		document.addEventListener('click', handleWindowClick);
		document.addEventListener('keydown', handleWindowKeydown);

		return () => {
			document.removeEventListener('click', handleWindowClick);
			document.removeEventListener('keydown', handleWindowKeydown);
		};
	});
</script>

<div class="user-menu" bind:this={menuEl}>
	<button
		type="button"
		class="user-avatar user-avatar-button"
		aria-label="Account menu"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={toggleMenu}
	>
		{#if user.image}
			<img src={user.image} alt="" />
		{:else}
			{getInitials(user)}
		{/if}
	</button>

	{#if open}
		<div class="user-menu-panel" role="menu">
			<p class="user-menu-label">{displayName}</p>
			<form method="post" action="/?/signOut" use:enhance role="none">
				<button type="submit" class="user-menu-item" role="menuitem">
					<LogOut size={16} />
					Sign out
				</button>
			</form>
		</div>
	{/if}
</div>
