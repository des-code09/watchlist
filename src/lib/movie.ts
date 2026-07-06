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
