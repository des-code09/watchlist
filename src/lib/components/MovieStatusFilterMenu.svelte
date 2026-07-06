<script lang="ts">
	import { browser } from '$app/environment';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import {
		MOVIE_STATUSES,
		getStatusLabel,
		type MovieStatus,
		type MovieStatusFilter
	} from '$lib/movie';

	let {
		statusFilter = $bindable('all' as MovieStatusFilter)
	}: {
		statusFilter?: MovieStatusFilter;
	} = $props();

	let open = $state(false);
	let menuEl = $state<HTMLDivElement | null>(null);

	const isFiltered = $derived(statusFilter !== 'all');

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function closeMenu() {
		open = false;
	}

	function selectFilter(nextFilter: MovieStatusFilter, event: MouseEvent) {
		event.stopPropagation();
		statusFilter = nextFilter;
		closeMenu();
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

<div class="movie-status-filter-menu" bind:this={menuEl}>
	<button
		type="button"
		class="movie-list-header-button"
		class:movie-list-header-button-active={isFiltered}
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggleMenu}
	>
		Status
		<ChevronDown size={14} aria-hidden="true" />
	</button>

	{#if open}
		<ul class="movie-status-menu-panel" role="listbox" aria-label="Filter by status">
			<li role="presentation">
				<button
					type="button"
					class="movie-status-menu-item"
					class:movie-status-menu-item-active={statusFilter === 'all'}
					role="option"
					aria-selected={statusFilter === 'all'}
					onclick={(event) => selectFilter('all', event)}
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
						onclick={(event) => selectFilter(option, event)}
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
	{/if}
</div>
