<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<header>
	<div>
		<h1>Watchlist</h1>
		<p class="subtitle">Movies you want to see</p>
	</div>
	<form method="post" action="?/signOut" use:enhance>
		<button type="submit" class="secondary">Sign out</button>
	</form>
</header>

<section>
	<h2>Add a movie</h2>
	<form method="post" action="?/addMovie" use:enhance class="inline">
		<label>
			Title
			<input type="text" name="title" placeholder="e.g. The Godfather" required />
		</label>
		<button type="submit">Add</button>
	</form>
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Your list</h2>
	{#if data.movies.length === 0}
		<p class="empty">No movies yet. Add one above.</p>
	{:else}
		<ul>
			{#each data.movies as movie (movie.id)}
				<li>{movie.title}</li>
			{/each}
		</ul>
	{/if}
</section>
