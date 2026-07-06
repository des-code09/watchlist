<script lang="ts">
	import { browser } from '$app/environment';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let {
		genres,
		genreFilter = $bindable([] as string[])
	}: {
		genres: string[];
		genreFilter?: string[];
	} = $props();

	let open = $state(false);
	let menuEl = $state<HTMLDivElement | null>(null);

	const isFiltered = $derived(genreFilter.length > 0);

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function closeMenu() {
		open = false;
	}

	function isSelected(genre: string): boolean {
		return genreFilter.includes(genre);
	}

	function toggleGenre(genre: string, event: MouseEvent) {
		event.stopPropagation();
		genreFilter = isSelected(genre)
			? genreFilter.filter((value) => value !== genre)
			: [...genreFilter, genre];
	}

	function clearAll(event: MouseEvent) {
		event.stopPropagation();
		genreFilter = [];
	}

	function handleWindowClick(event: MouseEvent) {
		if (menuEl && !menuEl.contains(event.target as Node)) {
			closeMenu();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}

	$effect(() => {
		if (!browser || !open) return;

		document.addEventListener('click', handleWindowClick);
		document.addEventListener('keydown', handleWindowKeydown);

		return () => {
			document.removeEventListener('click', handleWindowClick);
			document.removeEventListener('keydown', handleWindowKeydown);
		};
	});
</script>

<div class="movie-genre-filter-menu" bind:this={menuEl}>
	<button
		type="button"
		class="movie-list-header-button"
		class:movie-list-header-button-active={isFiltered}
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggleMenu}
	>
		Genre
		<ChevronDown size={14} aria-hidden="true" />
	</button>

	{#if open}
		<ul
			class="movie-status-menu-panel movie-genre-filter-panel"
			role="listbox"
			aria-label="Filter by genre"
			aria-multiselectable="true"
		>
			{#if isFiltered}
				<li role="presentation">
					<button
						type="button"
						class="movie-status-menu-item movie-genre-filter-clear"
						onclick={clearAll}
					>
						<span class="movie-status-menu-check" aria-hidden="true"></span>
						Clear all
					</button>
				</li>
			{/if}

			{#if genres.length === 0}
				<li role="presentation">
					<p class="movie-genre-filter-empty">No genres yet.</p>
				</li>
			{:else}
				{#each genres as genre (genre)}
					<li role="presentation">
						<button
							type="button"
							class="movie-status-menu-item"
							class:movie-status-menu-item-active={isSelected(genre)}
							role="option"
							aria-selected={isSelected(genre)}
							onclick={(event) => toggleGenre(genre, event)}
						>
							<span class="movie-status-menu-check" aria-hidden="true">
								{#if isSelected(genre)}
									<Check size={14} />
								{/if}
							</span>
							{genre}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
