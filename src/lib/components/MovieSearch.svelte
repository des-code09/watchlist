<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Check from '@lucide/svelte/icons/check';
	import Film from '@lucide/svelte/icons/film';
	import Plus from '@lucide/svelte/icons/plus';
	import { fly } from 'svelte/transition';

	type SearchResult = {
		tmdbId: number;
		title: string;
		posterUrl: string | null;
		year: string | null;
		thumbnailUrl: string | null;
	};

	let { existingTmdbIds = [] }: { existingTmdbIds?: number[] } = $props();

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let searching = $state(false);
	let searchError = $state<string | null>(null);
	let showResults = $state(false);
	let searchEl = $state<HTMLDivElement | null>(null);
	let addingId = $state<number | null>(null);
	let addedIds = $state<number[]>([]);
	let rowError = $state<string | null>(null);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	export function reset() {
		query = '';
		results = [];
		searching = false;
		searchError = null;
		showResults = false;
		addingId = null;
		addedIds = [];
		rowError = null;
	}

	function isInList(tmdbId: number): boolean {
		return existingTmdbIds.includes(tmdbId) || addedIds.includes(tmdbId);
	}

	async function fetchResults(searchQuery: string) {
		searching = true;
		searchError = null;

		try {
			const response = await fetch(`/api/tmdb/search?q=${encodeURIComponent(searchQuery)}`);
			if (!response.ok) {
				throw new Error('Search failed');
			}

			const data = (await response.json()) as { results: SearchResult[] };
			results = data.results;
			showResults = true;
		} catch {
			searchError = 'Could not search movies. Try again.';
			results = [];
		} finally {
			searching = false;
		}
	}

	function handleInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		query = value;
		rowError = null;

		clearTimeout(debounceTimer);

		if (value.trim().length < 2) {
			results = [];
			showResults = false;
			searchError = null;
			searching = false;
			return;
		}

		debounceTimer = setTimeout(() => {
			void fetchResults(value.trim());
		}, 300);
	}

	async function addMovie(result: SearchResult) {
		if (isInList(result.tmdbId) || addingId === result.tmdbId) return;

		addingId = result.tmdbId;
		rowError = null;

		const formData = new FormData();
		formData.set('title', result.title);
		formData.set('tmdbId', String(result.tmdbId));
		formData.set('posterUrl', result.posterUrl ?? '');

		try {
			const response = await fetch('?/addMovie', { method: 'POST', body: formData });
			const actionResult = deserialize(await response.text());
			await applyAction(actionResult);

			if (actionResult.type === 'failure') {
				const message = actionResult.data?.message;
				rowError = typeof message === 'string' ? message : 'Could not add movie.';
				return;
			}

			if (actionResult.type === 'success') {
				addedIds = [...addedIds, result.tmdbId];
				showResults = false;
				query = '';
				results = [];
				await invalidateAll();
			}
		} catch {
			rowError = 'Could not add movie. Try again.';
		} finally {
			addingId = null;
		}
	}

	function handleWindowClick(event: MouseEvent) {
		if (searchEl && !searchEl.contains(event.target as Node)) {
			showResults = false;
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showResults = false;
		}
	}

	$effect(() => {
		if (!browser) return;

		document.addEventListener('click', handleWindowClick);
		document.addEventListener('keydown', handleWindowKeydown);

		return () => {
			document.removeEventListener('click', handleWindowClick);
			document.removeEventListener('keydown', handleWindowKeydown);
			clearTimeout(debounceTimer);
		};
	});
</script>

<div class="movie-search" bind:this={searchEl}>
	<label>
		Search movies
		<input
			type="search"
			value={query}
			oninput={handleInput}
			placeholder="e.g. The Godfather"
			autocomplete="off"
			aria-controls="movie-search-results"
		/>
	</label>

	{#if searching}
		<p class="movie-search-status">Searching...</p>
	{:else if searchError}
		<p class="error movie-search-status">{searchError}</p>
	{:else if rowError}
		<p class="error movie-search-status">{rowError}</p>
	{/if}

	{#if showResults && results.length > 0}
		<ul
			id="movie-search-results"
			class="movie-search-results"
			role="listbox"
			in:fly={{ y: -6, duration: 150 }}
			out:fly={{ y: -6, duration: 200 }}
		>
			{#each results as result (result.tmdbId)}
				{@const inList = isInList(result.tmdbId)}
				{@const isAdding = addingId === result.tmdbId}
				<li class="movie-search-result-row" role="presentation">
					{#if result.thumbnailUrl}
						<img src={result.thumbnailUrl} alt="" class="movie-search-thumb" />
					{:else}
						<span class="movie-search-thumb movie-search-thumb-empty">
							<Film size={16} />
						</span>
					{/if}
					<span class="movie-search-copy">
						<span class="movie-search-title">{result.title}</span>
						{#if result.year}
							<span class="movie-search-year">{result.year}</span>
						{/if}
					</span>
					{#if inList}
						<span class="movie-search-added" aria-label="Already on your list">
							<Check size={16} />
							<span>In list</span>
						</span>
					{:else}
						<button
							type="button"
							class="movie-search-add btn-icon-only"
							aria-label="Add {result.title}"
							disabled={isAdding}
							onclick={() => addMovie(result)}
						>
							<Plus size={16} />
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if showResults && query.trim().length >= 2 && !searching}
		<p class="movie-search-status">No movies found.</p>
	{/if}
</div>
