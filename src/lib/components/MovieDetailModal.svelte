<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Play from '@lucide/svelte/icons/play';
	import Star from '@lucide/svelte/icons/star';
	import X from '@lucide/svelte/icons/x';
	import {
		fetchMovieDetails,
		getCachedMovieDetails,
		type MovieDetails
	} from '$lib/movie-details';
	import { parseGenres, type ListMovie } from '$lib/movie';

	let {
		movie,
		onclose
	}: {
		movie: ListMovie | null;
		onclose: () => void;
	} = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let details = $state<MovieDetails | null>(null);
	let loadError = $state<string | null>(null);
	let playingTrailer = $state(false);
	let userRating = $state<number | null>(null);
	let ratingError = $state<string | null>(null);
	let savingRating = $state(false);
	let returnFocusEl = $state<HTMLElement | null>(null);
	let loadedMovieId = $state<number | null>(null);

	const heroImage = $derived(
		details?.backdropUrl ??
			details?.posterUrl ??
			movie?.posterUrl ??
			null
	);

	const displayTitle = $derived(details?.title ?? movie?.title ?? '');
	const hasTrailer = $derived(details?.trailer != null);
	const displayYear = $derived(details?.releaseYear ?? (movie?.releaseYear != null ? String(movie.releaseYear) : null));
	const displayGenres = $derived(
		details?.genres?.length ? details.genres : parseGenres(movie?.genres ?? null)
	);

	function formatTmdbScore(score: number): string {
		return `${score}/10`;
	}

	async function loadMovie(currentMovie: ListMovie) {
		loadError = null;

		try {
			if (!currentMovie.tmdbId) {
				loadError = 'Details unavailable for this movie.';
				details = null;
				return;
			}

			const data = await fetchMovieDetails(currentMovie.tmdbId);
			if (loadedMovieId !== currentMovie.id) return;
			details = data;
		} catch {
			if (loadedMovieId === currentMovie.id) {
				loadError = 'Could not load movie details. Try again.';
				details = null;
			}
		}
	}

	function close() {
		playingTrailer = false;
		if (dialogEl?.open) {
			dialogEl.close();
		} else {
			onclose();
		}
	}

	function handleDialogClick(event: MouseEvent) {
		if (event.target === dialogEl) {
			close();
		}
	}

	function handleDialogClose() {
		playingTrailer = false;
		onclose();
		returnFocusEl?.focus();
	}

	async function setRating(star: number) {
		if (!movie || savingRating) return;

		const nextRating = userRating === star ? null : star;
		const previousRating = userRating;
		userRating = nextRating;
		ratingError = null;
		savingRating = true;

		const formData = new FormData();
		formData.set('id', String(movie.id));
		if (nextRating != null) {
			formData.set('rating', String(nextRating));
		}

		try {
			const response = await fetch('?/updateRating', { method: 'POST', body: formData });
			const actionResult = deserialize(await response.text());
			await applyAction(actionResult);

			if (actionResult.type === 'failure') {
				userRating = previousRating;
				const message = actionResult.data?.message;
				ratingError = typeof message === 'string' ? message : 'Could not save rating.';
				return;
			}

			await invalidateAll();
		} catch {
			userRating = previousRating;
			ratingError = 'Could not save rating. Try again.';
		} finally {
			savingRating = false;
		}
	}

	$effect(() => {
		if (movie) {
			userRating = movie.userRating;
		}
	});

	$effect(() => {
		if (!browser) return;

		if (!movie) return;

		const scrollY = window.scrollY;
		const { documentElement: html, body } = document;

		html.classList.add('scroll-locked');
		body.style.position = 'fixed';
		body.style.top = `-${scrollY}px`;
		body.style.width = '100%';

		return () => {
			html.classList.remove('scroll-locked');
			body.style.position = '';
			body.style.top = '';
			body.style.width = '';
			window.scrollTo(0, scrollY);
		};
	});

	$effect(() => {
		if (!browser || !dialogEl) return;

		if (!movie) {
			loadedMovieId = null;
			if (dialogEl.open) {
				dialogEl.close();
			}
			return;
		}

		if (loadedMovieId === movie.id) {
			return;
		}

		const currentMovie = movie;

		loadedMovieId = currentMovie.id;
		returnFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		playingTrailer = false;
		ratingError = null;
		loadError = null;
		details = currentMovie.tmdbId ? (getCachedMovieDetails(currentMovie.tmdbId) ?? null) : null;

		if (!dialogEl.open) {
			dialogEl.showModal();
		}

		if (!details) {
			void loadMovie(currentMovie);
		} else if (!currentMovie.tmdbId) {
			loadError = 'Details unavailable for this movie.';
		}
	});
</script>

<dialog
	class="movie-detail-dialog"
	bind:this={dialogEl}
	onclick={handleDialogClick}
	onclose={handleDialogClose}
	aria-labelledby="movie-detail-title"
>
	{#if movie}
		<div class="movie-detail-panel">
			<button type="button" class="movie-detail-close btn-icon-only" aria-label="Close" onclick={close}>
				<X size={20} />
			</button>

			<div class="movie-detail-hero">
				{#if playingTrailer && details?.trailer}
					<iframe
						class="movie-detail-trailer"
						src="https://www.youtube-nocookie.com/embed/{details.trailer.youtubeKey}?autoplay=1"
						title="{displayTitle} trailer"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				{:else if heroImage}
					<img src={heroImage} alt="" class="movie-detail-hero-image" />
					{#if hasTrailer}
						<button
							type="button"
							class="movie-detail-play"
							aria-label="Play trailer"
							onclick={() => (playingTrailer = true)}
						>
							<Play size={28} />
						</button>
					{/if}
				{:else}
					<div class="movie-detail-hero-empty" aria-hidden="true"></div>
				{/if}
			</div>

			<div class="movie-detail-body">
				<h2 id="movie-detail-title" class="movie-detail-title">{displayTitle}</h2>

				<div class="movie-detail-details">
					{#if loadError}
						<p class="error movie-detail-status">{loadError}</p>
					{:else}
						{#if displayYear || details?.voteAverage != null}
							<p class="movie-detail-meta">
								{#if displayYear}
									<span>{displayYear}</span>
								{/if}
								{#if displayYear && details?.voteAverage != null}
									<span class="movie-detail-meta-sep" aria-hidden="true">·</span>
								{/if}
								{#if details?.voteAverage != null}
									<span>TMDB {formatTmdbScore(details.voteAverage)}</span>
								{/if}
							</p>
						{/if}

						{#if displayGenres.length > 0}
							<div class="movie-detail-pills">
								{#each displayGenres as genre (genre)}
									<span class="movie-detail-pill">{genre}</span>
								{/each}
							</div>
						{/if}

						{#if details?.overview}
							<p class="movie-detail-overview">{details.overview}</p>
						{:else if details}
							<p class="movie-detail-overview movie-detail-overview-empty">No description available.</p>
						{/if}
					{/if}
				</div>

				<div class="movie-detail-rating">
					<span class="movie-detail-rating-label">Add rating</span>
					<div class="star-rating" role="group" aria-label="Add rating">
						{#each [1, 2, 3, 4, 5] as star (star)}
							<button
								type="button"
								class="star-rating-star"
								class:star-rating-star-filled={userRating != null && star <= userRating}
								aria-label="{star} star{star === 1 ? '' : 's'}"
								aria-pressed={userRating != null && star <= userRating}
								disabled={savingRating}
								onclick={() => setRating(star)}
							>
								<Star size={16} fill={userRating != null && star <= userRating ? 'currentColor' : 'none'} />
							</button>
						{/each}
					</div>
				</div>

				{#if ratingError}
					<p class="error movie-detail-status">{ratingError}</p>
				{/if}
			</div>
		</div>
	{/if}
</dialog>
