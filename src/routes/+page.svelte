<script lang="ts">
	import { enhance } from '$app/forms';
	import Film from '@lucide/svelte/icons/film';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { fade } from 'svelte/transition';
	import MovieDetailModal from '$lib/components/MovieDetailModal.svelte';
	import MovieListEmpty from '$lib/components/MovieListEmpty.svelte';
	import MovieListHeader from '$lib/components/MovieListHeader.svelte';
	import MovieSearch from '$lib/components/MovieSearch.svelte';
	import MovieStatusPill from '$lib/components/MovieStatusPill.svelte';
	import {
		collectGenres,
		DEFAULT_MOVIE_LIST_SORT,
		displayGenre,
		filterMoviesByGenres,
		filterMoviesByStatus,
		formatTmdbRating,
		sortMovies,
		type ListMovie,
		type MovieListSort,
		type MovieStatusFilter
	} from '$lib/movie';
	import { getMovieListEmptyState } from '$lib/movie-empty-state';
	import { prefetchMovieDetails } from '$lib/movie-details';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedMovie = $state<ListMovie | null>(null);
	let statusFilter = $state<MovieStatusFilter>('all');
	let genreFilter = $state<string[]>([]);
	let sort = $state<MovieListSort>(DEFAULT_MOVIE_LIST_SORT);

	const existingTmdbIds = $derived(
		data.movies.flatMap((movie) => (movie.tmdbId != null ? [movie.tmdbId] : []))
	);

	const availableGenres = $derived(collectGenres(data.movies));

	const visibleMovies = $derived(
		sortMovies(
			filterMoviesByGenres(filterMoviesByStatus(data.movies, statusFilter), genreFilter),
			sort
		)
	);

	const emptyState = $derived(
		getMovieListEmptyState({
			totalMovies: data.movies.length,
			statusFilter,
			genreFilter
		})
	);

	function openDetail(movie: ListMovie) {
		selectedMovie = movie;
	}

	function closeDetail() {
		selectedMovie = null;
	}

	function clearFilters() {
		statusFilter = 'all';
		genreFilter = [];
	}
</script>

<section>
	<h2>Add a movie</h2>
	<MovieSearch {existingTmdbIds} />
</section>

<section>
	<h2>Your list</h2>
	{#if data.movies.length === 0}
		<MovieListEmpty state={emptyState} />
	{:else}
		<div class="movie-list">
			<div class="movie-list-table">
				<MovieListHeader bind:sort bind:statusFilter bind:genreFilter {availableGenres} />

				{#if visibleMovies.length === 0}
					<MovieListEmpty state={emptyState} variant="inline" onClearFilters={clearFilters} />
				{:else}
					<ul>
						{#each visibleMovies as movie (movie.id)}
							{@const genreLabel = displayGenre(movie.genres)}
							<li class="movie-list-row" out:fade={{ duration: 200 }}>
							<div class="movie-list-cell">
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
										<span class="movie-row-title">{movie.title}</span>
									</div>
								</button>
							</div>

							<div class="movie-list-cell movie-list-cell-muted movie-list-cell-genre">
								{genreLabel ?? '—'}
							</div>

							<div class="movie-list-cell movie-list-cell-muted">
								{movie.tmdbRating != null ? formatTmdbRating(movie.tmdbRating) : '—'}
							</div>

							<div class="movie-list-cell movie-list-cell-status">
								<MovieStatusPill movieId={movie.id} status={movie.status} />
							</div>

							<div class="movie-list-cell movie-list-cell-actions">
								<form method="post" action="?/removeMovie" use:enhance>
									<input type="hidden" name="id" value={movie.id} />
									<button type="submit" class="btn-icon-only" aria-label="Remove movie">
										<Trash2 size={16} />
									</button>
								</form>
							</div>
						</li>
					{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</section>

<MovieDetailModal movie={selectedMovie} onclose={closeDetail} />
