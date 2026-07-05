<script lang="ts">
	import { enhance } from '$app/forms';
	import Film from '@lucide/svelte/icons/film';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { fade } from 'svelte/transition';
	import MovieSearch from '$lib/components/MovieSearch.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const existingTmdbIds = $derived(
		data.movies.flatMap((movie) => (movie.tmdbId != null ? [movie.tmdbId] : []))
	);
</script>

<section>
	<h2>Add a movie</h2>
	<MovieSearch {existingTmdbIds} />
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
				<li out:fade={{ duration: 200 }}>
					<div class="movie-title">
						{#if movie.posterUrl}
							<img src={movie.posterUrl} alt="" class="movie-poster" loading="lazy" />
						{:else}
							<Film size={18} />
						{/if}
						<span>{movie.title}</span>
					</div>
					<form method="post" action="?/removeMovie" use:enhance>
						<input type="hidden" name="id" value={movie.id} />
						<button type="submit" class="btn-icon-only" aria-label="Remove movie">
							<Trash2 size={16} />
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>
