<script lang="ts">
	import { enhance } from '$app/forms';
	import Clapperboard from '@lucide/svelte/icons/clapperboard';
	import Film from '@lucide/svelte/icons/film';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function getInitials(user: PageData['user']) {
		const source = user.name?.trim() || user.email;
		const parts = source.split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return source.slice(0, 2).toUpperCase();
	}
</script>

<header>
	<div class="brand">
		<div class="brand-mark">
			<Clapperboard size={24} strokeWidth={1.75} />
		</div>
		<div class="brand-copy">
			<h1>Watchlist</h1>
			<p class="subtitle">Movies you want to see</p>
		</div>
	</div>
	<div class="user-bar">
		<span class="user-avatar" title={data.user.name || data.user.email}>
			{#if data.user.image}
				<img src={data.user.image} alt="" />
			{:else}
				{getInitials(data.user)}
			{/if}
		</span>
		<span class="user-bar-divider" aria-hidden="true"></span>
		<form method="post" action="?/signOut" use:enhance>
			<button type="submit" class="btn-icon-only" aria-label="Sign out">
				<LogOut size={16} />
			</button>
		</form>
	</div>
</header>

<section>
	<h2>Add a movie</h2>
	<form method="post" action="?/addMovie" use:enhance class="inline">
		<label>
			Title
			<input type="text" name="title" placeholder="e.g. The Godfather" required />
		</label>
		<button type="submit" class="btn-with-icon">
			<Plus size={16} />
			Add
		</button>
	</form>
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Your list</h2>
	{#if data.movies.length === 0}
		<p class="empty">
			<Film size={32} />
			No movies yet. Add one above.
		</p>
	{:else}
		<ul>
			{#each data.movies as movie (movie.id)}
				<li>
					<div class="movie-title">
						<Film size={18} />
						<span>{movie.title}</span>
					</div>
					<form method="post" action="?/removeMovie" use:enhance>
						<input type="hidden" name="id" value={movie.id} />
						<button
							type="submit"
							class="secondary btn-icon-only"
							aria-label="Remove movie"
						>
							<Trash2 size={16} />
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>
