export const MOVIE_STATUSES = ['to_watch', 'watching', 'watched'] as const;
export type MovieStatus = (typeof MOVIE_STATUSES)[number];

export type ListMovie = {
	id: number;
	title: string;
	tmdbId: number | null;
	posterUrl: string | null;
	userRating: number | null;
	tmdbRating: number | null;
	releaseYear: number | null;
	genres: string | null;
	status: MovieStatus;
	createdAt: Date;
};

const STATUS_LABELS: Record<MovieStatus, string> = {
	to_watch: 'To Watch',
	watching: 'Watching',
	watched: 'Watched'
};

export function getStatusLabel(status: MovieStatus): string {
	return STATUS_LABELS[status];
}

export function isMovieStatus(value: string): value is MovieStatus {
	return (MOVIE_STATUSES as readonly string[]).includes(value);
}

export function parseGenres(genres: string | null): string[] {
	if (!genres) return [];
	return genres
		.split(',')
		.map((genre) => genre.trim())
		.filter(Boolean);
}

export function formatGenres(genres: string[]): string {
	return genres.join(', ');
}

export function displayGenre(genres: string | null): string | null {
	const list = parseGenres(genres);
	if (list.length === 0) return null;
	return list.join(', ');
}

export function formatTmdbRating(rating: number): string {
	return `${rating}/10`;
}

export type MovieSortColumn = 'recent' | 'title' | 'year' | 'rating';
export type MovieSortDirection = 'asc' | 'desc';
export type MovieStatusFilter = 'all' | MovieStatus;

export type MovieListSort = {
	column: MovieSortColumn;
	direction: MovieSortDirection;
};

export const DEFAULT_MOVIE_LIST_SORT: MovieListSort = {
	column: 'recent',
	direction: 'desc'
};

export function filterMoviesByStatus(
	movies: ListMovie[],
	filter: MovieStatusFilter
): ListMovie[] {
	if (filter === 'all') return movies;
	return movies.filter((movie) => movie.status === filter);
}

export function collectGenres(movies: ListMovie[]): string[] {
	const genres = new Set<string>();
	for (const movie of movies) {
		for (const genre of parseGenres(movie.genres)) {
			genres.add(genre);
		}
	}
	return [...genres].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export function filterMoviesByGenres(movies: ListMovie[], selectedGenres: string[]): ListMovie[] {
	if (selectedGenres.length === 0) return movies;

	const selected = new Set(selectedGenres);
	return movies.filter((movie) => parseGenres(movie.genres).some((genre) => selected.has(genre)));
}

function compareNullableNumber(
	a: number | null,
	b: number | null,
	direction: MovieSortDirection
): number {
	if (a == null && b == null) return 0;
	if (a == null) return 1;
	if (b == null) return -1;
	return direction === 'asc' ? a - b : b - a;
}

export function cycleSortColumn(
	current: MovieListSort,
	clicked: Exclude<MovieSortColumn, 'recent'>
): MovieListSort {
	if (current.column !== clicked) {
		return { column: clicked, direction: 'asc' };
	}

	if (current.direction === 'asc') {
		return { column: clicked, direction: 'desc' };
	}

	return DEFAULT_MOVIE_LIST_SORT;
}

export function sortMovies(movies: ListMovie[], sort: MovieListSort): ListMovie[] {
	if (sort.column === 'recent') return movies;

	const sorted = [...movies];

	if (sort.column === 'title') {
		const compare = (a: ListMovie, b: ListMovie) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
		sorted.sort(sort.direction === 'asc' ? compare : (a, b) => compare(b, a));
		return sorted;
	}

	if (sort.column === 'year') {
		sorted.sort((a, b) => compareNullableNumber(a.releaseYear, b.releaseYear, sort.direction));
		return sorted;
	}

	sorted.sort((a, b) => compareNullableNumber(a.tmdbRating, b.tmdbRating, sort.direction));
	return sorted;
}

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
