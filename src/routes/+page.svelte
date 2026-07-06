<script lang="ts">
	import { enhance } from '$app/forms';
	import Film from '@lucide/svelte/icons/film';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { fade } from 'svelte/transition';
	import MovieDetailModal from '$lib/components/MovieDetailModal.svelte';
	import MovieSearch from '$lib/components/MovieSearch.svelte';
	import MovieStatusPill from '$lib/components/MovieStatusPill.svelte';
	import { displayGenre, formatTmdbRating, type ListMovie } from '$lib/movie';
	import { prefetchMovieDetails } from '$lib/movie-details';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedMovie = $state<ListMovie | null>(null);

	const existingTmdbIds = $derived(
		data.movies.flatMap((movie) => (movie.tmdbId != null ? [movie.tmdbId] : []))
	);

	function openDetail(movie: (typeof data.movies)[number]) {
		selectedMovie = movie;
	}

	function closeDetail() {
		selectedMovie = null;
	}
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
				{@const genreLabel = displayGenre(movie.genres)}
				<li out:fade={{ duration: 200 }}>
					<button
						type="button"
						class="movie-row-button"
						onmouseenter={() => movie.tmdbId != null && prefetchMovieDetails(movie.tmdbId)}
						onfocus={() => movie.tmdbId != null && prefetchMovieDetails(movie.tmdbId)}
						onclick={() => openDetail(movie)}
					>
						<div class="movie-title">
							{#if movie.posterUrl}
								<img src={movie.posterUrl} alt="" class="movie-poster" loading="lazy" />
							{:else}
								<Film size={18} />
							{/if}
							<div class="movie-row-content">
								<span class="movie-row-title">{movie.title}</span>
								{#if movie.releaseYear || genreLabel || movie.tmdbRating != null}
									<div class="movie-row-meta">
										{#if movie.releaseYear}
											<span>{movie.releaseYear}</span>
										{/if}
										{#if movie.releaseYear && genreLabel}
											<span class="movie-row-meta-sep" aria-hidden="true">·</span>
										{/if}
										{#if genreLabel}
											<span>{genreLabel}</span>
										{/if}
										{#if (movie.releaseYear || genreLabel) && movie.tmdbRating != null}
											<span class="movie-row-meta-sep" aria-hidden="true">·</span>
										{/if}
										{#if movie.tmdbRating != null}
											<span>TMDB {formatTmdbRating(movie.tmdbRating)}</span>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</button>
					<MovieStatusPill movieId={movie.id} status={movie.status} />
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

<MovieDetailModal movie={selectedMovie} onclose={closeDetail} />
