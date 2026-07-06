<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Play from '@lucide/svelte/icons/play';
	import Star from '@lucide/svelte/icons/star';
	import X from '@lucide/svelte/icons/x';

	type MovieDetails = {
		title: string;
		overview: string | null;
		releaseYear: string | null;
		genres: string[];
		voteAverage: number | null;
		backdropUrl: string | null;
		posterUrl: string | null;
		trailer: { youtubeKey: string } | null;
	};

	export type ListMovie = {
		id: number;
		title: string;
		tmdbId: number | null;
		posterUrl: string | null;
		userRating: number | null;
		createdAt: Date;
	};

	let {
		movie,
		onclose
	}: {
		movie: ListMovie | null;
		onclose: () => void;
	} = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let details = $state<MovieDetails | null>(null);
	let loading = $state(false);
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

	function formatTmdbScore(score: number): string {
		return `${score}/10`;
	}

	async function fetchDetails(tmdbId: number) {
		loading = true;
		loadError = null;
		details = null;

		try {
			const response = await fetch(`/api/tmdb/movie/${tmdbId}`);
			if (!response.ok) {
				throw new Error('Failed to load details');
			}
			details = (await response.json()) as MovieDetails;
		} catch {
			loadError = 'Could not load movie details. Try again.';
		} finally {
			loading = false;
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

		loadedMovieId = movie.id;
		returnFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		playingTrailer = false;
		ratingError = null;
		loadError = null;
		details = null;

		if (!dialogEl.open) {
			dialogEl.showModal();
		}

		if (movie.tmdbId) {
			void fetchDetails(movie.tmdbId);
		} else {
			loading = false;
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
				{#if loading}
					<div class="movie-detail-hero-skeleton" aria-hidden="true"></div>
				{:else if playingTrailer && details?.trailer}
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

				{#if loadError}
					<p class="error movie-detail-status">{loadError}</p>
				{:else if !loading}
					{#if details?.releaseYear || details?.voteAverage != null}
						<p class="movie-detail-meta">
							{#if details?.releaseYear}
								<span>{details.releaseYear}</span>
							{/if}
							{#if details?.releaseYear && details?.voteAverage != null}
								<span class="movie-detail-meta-sep" aria-hidden="true">·</span>
							{/if}
							{#if details?.voteAverage != null}
								<span>TMDB {formatTmdbScore(details.voteAverage)}</span>
							{/if}
						</p>
					{/if}

					{#if (details?.genres ?? []).length > 0}
						<div class="movie-detail-pills">
							{#each details?.genres ?? [] as genre (genre)}
								<span class="movie-detail-pill">{genre}</span>
							{/each}
						</div>
					{/if}

					{#if details?.overview}
						<p class="movie-detail-overview">{details.overview}</p>
					{:else if !loadError}
						<p class="movie-detail-overview movie-detail-overview-empty">No description available.</p>
					{/if}

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
				{/if}
			</div>
		</div>
	{/if}
</dialog>
