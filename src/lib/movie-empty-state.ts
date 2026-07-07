import type { MovieStatusFilter } from '$lib/movie';

export type MovieListEmptyIcon =
	| 'film'
	| 'filling-popcorn-tub'
	| 'popcorn-tub'
	| 'spilled-popcorn-tub'
	| 'bookmark';

export type MovieListEmptyState = {
	headline: string;
	hint?: string;
	icon: MovieListEmptyIcon;
	showClearFilters?: boolean;
};

function formatGenreList(genres: string[]): string {
	if (genres.length === 1) return genres[0];
	if (genres.length === 2) return `${genres[0]} and ${genres[1]}`;
	return `${genres.slice(0, -1).join(', ')}, and ${genres.at(-1)}`;
}

export function getMovieListEmptyState(options: {
	totalMovies: number;
	statusFilter: MovieStatusFilter;
	genreFilter: string[];
}): MovieListEmptyState {
	const { totalMovies, statusFilter, genreFilter } = options;
	const hasGenreFilter = genreFilter.length > 0;
	const genreLabel = formatGenreList(genreFilter);

	if (totalMovies === 0) {
		return {
			headline: 'Add movies would you like to watch',
			hint: 'Search above and add the first movie to your watchlist.',
			icon: 'filling-popcorn-tub'
		};
	}

	if (statusFilter === 'watching') {
		if (hasGenreFilter) {
			return {
				headline: `No ${genreLabel} movies playing right now.`,
				hint: 'Grab some popcorn and start one.',
				icon: 'popcorn-tub',
				showClearFilters: true
			};
		}

		return {
			headline: 'Grab some popcorn and start watching a movie.',
			hint: "Pick one from your list and mark it Watching — the popcorn's waiting.",
			icon: 'popcorn-tub'
		};
	}

	if (statusFilter === 'watched') {
		if (hasGenreFilter) {
			return {
				headline: `No ${genreLabel} movies marked Watched yet.`,
				hint: "Mark one Watched when you're done.",
				icon: 'spilled-popcorn-tub',
				showClearFilters: true
			};
		}

		return {
			headline: 'Your popcorn finished up before the movie.',
			hint: "When you're done watching, mark it Watched",
			icon: 'spilled-popcorn-tub'
		};
	}

	if (statusFilter === 'to_watch') {
		if (hasGenreFilter) {
			return {
				headline: `No ${genreLabel} movies saved for later.`,
				hint: 'Add one or mark an existing title To Watch.',
				icon: 'bookmark',
				showClearFilters: true
			};
		}

		return {
			headline: 'Which movies would you like to watch next',
			hint: 'Add a movie above, or mark one as To Watch to save it for later.',
			icon: 'bookmark'
		};
	}

	if (hasGenreFilter) {
		return {
			headline: `No ${genreLabel} movies on your list.`,
			icon: 'film',
			showClearFilters: true
		};
	}

	return {
		headline: 'Nothing matches these filters.',
		icon: 'film',
		showClearFilters: true
	};
}
