<script lang="ts">
	import BookmarkIllustration from '$lib/components/empty-states/BookmarkIllustration.svelte';
	import FillingPopcornTubIllustration from '$lib/components/empty-states/FillingPopcornTubIllustration.svelte';
	import FullPopcornTubIllustration from '$lib/components/empty-states/FullPopcornTubIllustration.svelte';
	import SpilledPopcornTubIllustration from '$lib/components/empty-states/SpilledPopcornTubIllustration.svelte';
	import type { MovieListEmptyIcon } from '$lib/movie-empty-state';

	let { variant }: { variant: MovieListEmptyIcon } = $props();

	const images: Partial<Record<MovieListEmptyIcon, string>> = {
		film: '/illustrations/empty-states/empty-reel.png'
	};

	const imageSrc = $derived(images[variant]);
</script>

{#if variant === 'filling-popcorn-tub'}
	<FillingPopcornTubIllustration />
{:else if variant === 'popcorn-tub'}
	<FullPopcornTubIllustration />
{:else if variant === 'spilled-popcorn-tub'}
	<SpilledPopcornTubIllustration />
{:else if variant === 'bookmark'}
	<BookmarkIllustration />
{:else if imageSrc}
	<img
		class="empty-illustration-image empty-illustration-image--{variant}"
		src={imageSrc}
		alt=""
	/>
{/if}
