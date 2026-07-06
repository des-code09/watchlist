<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import MovieGenreFilterMenu from '$lib/components/MovieGenreFilterMenu.svelte';
	import MovieStatusFilterMenu from '$lib/components/MovieStatusFilterMenu.svelte';
	import {
		cycleSortColumn,
		type MovieListSort,
		type MovieSortColumn,
		type MovieStatusFilter
	} from '$lib/movie';

	let {
		sort = $bindable({ column: 'recent', direction: 'desc' } as MovieListSort),
		statusFilter = $bindable('all' as MovieStatusFilter),
		genreFilter = $bindable([] as string[]),
		availableGenres = []
	}: {
		sort?: MovieListSort;
		statusFilter?: MovieStatusFilter;
		genreFilter?: string[];
		availableGenres?: string[];
	} = $props();

	function handleSortClick(column: Exclude<MovieSortColumn, 'recent'>) {
		sort = cycleSortColumn(sort, column);
	}

	function isSortActive(column: Exclude<MovieSortColumn, 'recent'>): boolean {
		return sort.column === column;
	}

	function isSortAsc(column: Exclude<MovieSortColumn, 'recent'>): boolean {
		return sort.column === column && sort.direction === 'asc';
	}

	function isSortDesc(column: Exclude<MovieSortColumn, 'recent'>): boolean {
		return sort.column === column && sort.direction === 'desc';
	}
</script>

<div class="movie-list-header" role="row">
	<div class="movie-list-header-cell" role="columnheader">
		<button
			type="button"
			class="movie-list-header-button"
			class:movie-list-header-button-active={isSortActive('title')}
			aria-label="Sort by title"
			onclick={() => handleSortClick('title')}
		>
			Movie
			{#if isSortAsc('title')}
				<ArrowUp size={14} aria-hidden="true" />
			{:else if isSortDesc('title')}
				<ArrowDown size={14} aria-hidden="true" />
			{:else}
				<ArrowUpDown size={14} aria-hidden="true" />
			{/if}
		</button>
	</div>

	<div class="movie-list-header-cell" role="columnheader">
		<MovieGenreFilterMenu genres={availableGenres} bind:genreFilter />
	</div>

	<div class="movie-list-header-cell" role="columnheader">
		<button
			type="button"
			class="movie-list-header-button"
			class:movie-list-header-button-active={isSortActive('rating')}
			aria-label="Sort by rating"
			onclick={() => handleSortClick('rating')}
		>
			Rating
			{#if isSortAsc('rating')}
				<ArrowUp size={14} aria-hidden="true" />
			{:else if isSortDesc('rating')}
				<ArrowDown size={14} aria-hidden="true" />
			{:else}
				<ArrowUpDown size={14} aria-hidden="true" />
			{/if}
		</button>
	</div>

	<div class="movie-list-header-cell" role="columnheader">
		<MovieStatusFilterMenu bind:statusFilter />
	</div>

	<div class="movie-list-header-cell movie-list-header-actions" role="columnheader">
		<span class="sr-only">Actions</span>
	</div>
</div>
