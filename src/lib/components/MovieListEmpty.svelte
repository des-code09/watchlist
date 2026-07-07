<script lang="ts">
	import EmptyStateIllustration from '$lib/components/empty-states/EmptyStateIllustration.svelte';
	import type { MovieListEmptyState } from '$lib/movie-empty-state';

	let {
		state,
		variant = 'default',
		onClearFilters
	}: {
		state: MovieListEmptyState;
		variant?: 'default' | 'inline';
		onClearFilters?: () => void;
	} = $props();
</script>

<div class="empty" class:movie-list-empty={variant === 'inline'}>
	<div class="empty-illustration">
		<EmptyStateIllustration variant={state.icon} />
	</div>
	<div class="empty-copy">
		<p class="empty-headline">{state.headline}</p>
		<p class="empty-hint">{state.hint ?? ''}</p>
		<div class="empty-action-slot">
			{#if state.showClearFilters && onClearFilters}
				<button type="button" class="empty-action" onclick={onClearFilters}>Clear filters</button>
			{/if}
		</div>
	</div>
</div>
