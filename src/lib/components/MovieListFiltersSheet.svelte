<script lang="ts">
	import { browser } from '$app/environment';
	import Check from '@lucide/svelte/icons/check';
	import {
		DEFAULT_MOVIE_LIST_SORT,
		MOVIE_STATUSES,
		getStatusLabel,
		type MovieListSort,
		type MovieStatusFilter
	} from '$lib/movie';

	const SORT_OPTIONS: { label: string; value: MovieListSort }[] = [
		{ label: 'Recently added', value: { column: 'recent', direction: 'desc' } },
		{ label: 'Title A–Z', value: { column: 'title', direction: 'asc' } },
		{ label: 'Title Z–A', value: { column: 'title', direction: 'desc' } },
		{ label: 'Rating high–low', value: { column: 'rating', direction: 'desc' } },
		{ label: 'Rating low–high', value: { column: 'rating', direction: 'asc' } }
	];

	let {
		open = false,
		onclose,
		sort = $bindable({ ...DEFAULT_MOVIE_LIST_SORT }),
		statusFilter = $bindable('all' as MovieStatusFilter),
		genreFilter = $bindable([] as string[]),
		availableGenres = []
	}: {
		open?: boolean;
		onclose: () => void;
		sort?: MovieListSort;
		statusFilter?: MovieStatusFilter;
		genreFilter?: string[];
		availableGenres?: string[];
	} = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let returnFocusEl = $state<HTMLElement | null>(null);

	const hasActiveFilters = $derived(
		statusFilter !== 'all' ||
			genreFilter.length > 0 ||
			sort.column !== DEFAULT_MOVIE_LIST_SORT.column ||
			sort.direction !== DEFAULT_MOVIE_LIST_SORT.direction
	);

	function isSortSelected(option: MovieListSort): boolean {
		return sort.column === option.column && sort.direction === option.direction;
	}

	function selectSort(option: MovieListSort) {
		sort = option;
	}

	function selectStatus(nextFilter: MovieStatusFilter) {
		statusFilter = nextFilter;
	}

	function isGenreSelected(genre: string): boolean {
		return genreFilter.includes(genre);
	}

	function toggleGenre(genre: string) {
		genreFilter = isGenreSelected(genre)
			? genreFilter.filter((value) => value !== genre)
			: [...genreFilter, genre];
	}

	function clearAll() {
		sort = { ...DEFAULT_MOVIE_LIST_SORT };
		statusFilter = 'all';
		genreFilter = [];
	}

	function close() {
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
		onclose();
		returnFocusEl?.focus();
	}

	$effect(() => {
		if (!browser || !open) return;

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

		if (open) {
			returnFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			if (!dialogEl.open) {
				dialogEl.showModal();
			}
			return;
		}

		if (dialogEl.open) {
			dialogEl.close();
		}
	});
</script>

<dialog
	class="movie-filters-dialog"
	bind:this={dialogEl}
	onclick={handleDialogClick}
	onclose={handleDialogClose}
	aria-labelledby="movie-filters-title"
>
	<div class="movie-filters-sheet">
		<header class="movie-filters-sheet-header">
			<h2 id="movie-filters-title" class="movie-filters-sheet-title">Sort & filter</h2>
		</header>

		<div class="movie-filters-sheet-body">
			<section class="movie-filters-section" aria-labelledby="movie-filters-sort-heading">
				<h3 id="movie-filters-sort-heading" class="movie-filters-section-heading">Sort</h3>
				<ul class="movie-filters-sheet-list" role="listbox" aria-label="Sort movies">
					{#each SORT_OPTIONS as option (option.label)}
						<li role="presentation">
							<button
								type="button"
								class="movie-status-menu-item"
								class:movie-status-menu-item-active={isSortSelected(option.value)}
								role="option"
								aria-selected={isSortSelected(option.value)}
								onclick={() => selectSort(option.value)}
							>
								<span class="movie-status-menu-check" aria-hidden="true">
									{#if isSortSelected(option.value)}
										<Check size={14} />
									{/if}
								</span>
								{option.label}
							</button>
						</li>
					{/each}
				</ul>
			</section>

			<section class="movie-filters-section" aria-labelledby="movie-filters-status-heading">
				<h3 id="movie-filters-status-heading" class="movie-filters-section-heading">Status</h3>
				<ul class="movie-filters-sheet-list" role="listbox" aria-label="Filter by status">
					<li role="presentation">
						<button
							type="button"
							class="movie-status-menu-item"
							class:movie-status-menu-item-active={statusFilter === 'all'}
							role="option"
							aria-selected={statusFilter === 'all'}
							onclick={() => selectStatus('all')}
						>
							<span class="movie-status-menu-check" aria-hidden="true">
								{#if statusFilter === 'all'}
									<Check size={14} />
								{/if}
							</span>
							All
						</button>
					</li>
					{#each MOVIE_STATUSES as option (option)}
						<li role="presentation">
							<button
								type="button"
								class="movie-status-menu-item"
								class:movie-status-menu-item-active={statusFilter === option}
								role="option"
								aria-selected={statusFilter === option}
								onclick={() => selectStatus(option)}
							>
								<span class="movie-status-menu-check" aria-hidden="true">
									{#if statusFilter === option}
										<Check size={14} />
									{/if}
								</span>
								{getStatusLabel(option)}
							</button>
						</li>
					{/each}
				</ul>
			</section>

			<section class="movie-filters-section" aria-labelledby="movie-filters-genre-heading">
				<h3 id="movie-filters-genre-heading" class="movie-filters-section-heading">Genre</h3>
				<ul
					class="movie-filters-sheet-list movie-filters-genre-list"
					role="listbox"
					aria-label="Filter by genre"
					aria-multiselectable="true"
				>
					{#if availableGenres.length === 0}
						<li role="presentation">
							<p class="movie-genre-filter-empty">No genres yet.</p>
						</li>
					{:else}
						{#each availableGenres as genre (genre)}
							<li role="presentation">
								<button
									type="button"
									class="movie-status-menu-item"
									class:movie-status-menu-item-active={isGenreSelected(genre)}
									role="option"
									aria-selected={isGenreSelected(genre)}
									onclick={() => toggleGenre(genre)}
								>
									<span class="movie-status-menu-check" aria-hidden="true">
										{#if isGenreSelected(genre)}
											<Check size={14} />
										{/if}
									</span>
									{genre}
								</button>
							</li>
						{/each}
					{/if}
				</ul>
			</section>
		</div>

		<footer class="movie-filters-sheet-footer">
			{#if hasActiveFilters}
				<button type="button" class="secondary movie-filters-clear" onclick={clearAll}>Clear filters</button>
			{/if}
			<button type="button" class="movie-filters-done" onclick={close}>Done</button>
		</footer>
	</div>
</dialog>
