<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import {
		MOVIE_STATUSES,
		getStatusLabel,
		type MovieStatus
	} from '$lib/movie';
	import { triggerPopcorn } from '$lib/popcorn';

	let {
		movieId,
		status: initialStatus
	}: {
		movieId: number;
		status: MovieStatus;
	} = $props();

	let status = $state<MovieStatus>('to_watch');
	let open = $state(false);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		status = initialStatus;
	});

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function closeMenu() {
		open = false;
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

	async function selectStatus(nextStatus: MovieStatus, event: MouseEvent) {
		event.stopPropagation();
		if (saving || nextStatus === status) {
			closeMenu();
			return;
		}

		const previousStatus = status;
		status = nextStatus;
		error = null;
		saving = true;
		closeMenu();

		if (nextStatus === 'watching' || nextStatus === 'watched') {
			triggerPopcorn(nextStatus);
		}

		const formData = new FormData();
		formData.set('id', String(movieId));
		formData.set('status', nextStatus);

		try {
			const response = await fetch('?/updateStatus', { method: 'POST', body: formData });
			const actionResult = deserialize(await response.text());
			await applyAction(actionResult);

			if (actionResult.type === 'failure') {
				status = previousStatus;
				const message = actionResult.data?.message;
				error = typeof message === 'string' ? message : 'Could not update status.';
				return;
			}

			await invalidateAll();
		} catch {
			status = previousStatus;
			error = 'Could not update status. Try again.';
		} finally {
			saving = false;
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

<div class="movie-status-menu" bind:this={menuEl}>
	<button
		type="button"
		class="movie-status-pill movie-status-pill--{status}"
		class:movie-status-pill-open={open}
		aria-haspopup="listbox"
		aria-expanded={open}
		disabled={saving}
		onclick={toggleMenu}
	>
		{getStatusLabel(status)}
		<ChevronDown size={14} aria-hidden="true" />
	</button>

	{#if open}
		<ul class="movie-status-menu-panel" role="listbox" aria-label="Watch status">
			{#each MOVIE_STATUSES as option (option)}
				<li role="presentation">
					<button
						type="button"
						class="movie-status-menu-item"
						class:movie-status-menu-item-active={option === status}
						role="option"
						aria-selected={option === status}
						onclick={(event) => selectStatus(option, event)}
					>
						<span class="movie-status-menu-check" aria-hidden="true">
							{#if option === status}
								<Check size={14} />
							{/if}
						</span>
						{getStatusLabel(option)}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if error}
		<span class="movie-status-error" role="alert">{error}</span>
	{/if}
</div>
