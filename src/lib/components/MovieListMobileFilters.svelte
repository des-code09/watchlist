<script lang="ts">
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import MovieListFiltersSheet from '$lib/components/MovieListFiltersSheet.svelte';
	import {
		DEFAULT_MOVIE_LIST_SORT,
		getStatusLabel,
		type MovieListSort,
		type MovieStatusFilter
	} from '$lib/movie';

	let {
		sort = $bindable({ ...DEFAULT_MOVIE_LIST_SORT }),
		statusFilter = $bindable('all' as MovieStatusFilter),
		genreFilter = $bindable([] as string[]),
		availableGenres = [],
		class: className = ''
	}: {
		sort?: MovieListSort;
		statusFilter?: MovieStatusFilter;
		genreFilter?: string[];
		availableGenres?: string[];
		class?: string;
	} = $props();

	let open = $state(false);
	let triggerEl = $state<HTMLButtonElement | null>(null);

	const SORT_LABELS: Record<string, string> = {
		'recent-desc': 'Recently added',
		'title-asc': 'Title A–Z',
		'title-desc': 'Title Z–A',
		'rating-desc': 'Rating high–low',
		'rating-asc': 'Rating low–high'
	};

	const isActive = $derived(
		statusFilter !== 'all' ||
			genreFilter.length > 0 ||
			sort.column !== DEFAULT_MOVIE_LIST_SORT.column ||
			sort.direction !== DEFAULT_MOVIE_LIST_SORT.direction
	);

	const summary = $derived.by(() => {
		const parts: string[] = [];

		if (statusFilter !== 'all') {
			parts.push(getStatusLabel(statusFilter));
		}

		if (genreFilter.length > 0) {
			parts.push(genreFilter.length === 1 ? '1 genre' : `${genreFilter.length} genres`);
		}

		const sortKey = `${sort.column}-${sort.direction}`;
		const isDefaultSort =
			sort.column === DEFAULT_MOVIE_LIST_SORT.column &&
			sort.direction === DEFAULT_MOVIE_LIST_SORT.direction;

		if (!isDefaultSort && SORT_LABELS[sortKey]) {
			parts.push(SORT_LABELS[sortKey]);
		}

		return parts.join(' · ');
	});

	function openSheet() {
		open = true;
	}

	function closeSheet() {
		open = false;
		triggerEl?.focus();
	}
</script>

<div class="movie-list-filters-mobile {className}">
	<button
		type="button"
		class="movie-list-filters-trigger"
		bind:this={triggerEl}
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={openSheet}
	>
		<span class="movie-list-filters-trigger-main">
			<SlidersHorizontal size={18} aria-hidden="true" />
			<span class="movie-list-filters-trigger-label">Sort & filter</span>
			{#if isActive}
				<span class="movie-filters-trigger-badge" aria-hidden="true"></span>
			{/if}
		</span>
		{#if summary}
			<span class="movie-list-filters-trigger-summary">{summary}</span>
		{/if}
	</button>

	<MovieListFiltersSheet
		{open}
		onclose={closeSheet}
		bind:sort
		bind:statusFilter
		bind:genreFilter
		{availableGenres}
	/>
</div>
