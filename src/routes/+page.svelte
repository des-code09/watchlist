<script lang="ts">
	import { enhance } from '$app/forms';
	import Film from '@lucide/svelte/icons/film';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

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
