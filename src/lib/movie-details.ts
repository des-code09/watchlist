export type MovieDetails = {
	title: string;
	overview: string | null;
	releaseYear: string | null;
	genres: string[];
	voteAverage: number | null;
	backdropUrl: string | null;
	posterUrl: string | null;
	trailer: { youtubeKey: string } | null;
};

const cache = new Map<number, MovieDetails>();
const inflight = new Map<number, Promise<MovieDetails>>();

export function getCachedMovieDetails(tmdbId: number): MovieDetails | undefined {
	return cache.get(tmdbId);
}

export async function fetchMovieDetails(tmdbId: number): Promise<MovieDetails> {
	const cached = cache.get(tmdbId);
	if (cached) return cached;

	const pending = inflight.get(tmdbId);
	if (pending) return pending;

	const request = (async () => {
		const response = await fetch(`/api/tmdb/movie/${tmdbId}`);
		if (!response.ok) {
			throw new Error('Failed to load details');
		}

		const data = (await response.json()) as MovieDetails;
		cache.set(tmdbId, data);
		return data;
	})();

	inflight.set(tmdbId, request);

	try {
		return await request;
	} finally {
		inflight.delete(tmdbId);
	}
}

export function prefetchMovieDetails(tmdbId: number): void {
	if (cache.has(tmdbId) || inflight.has(tmdbId)) return;
	void fetchMovieDetails(tmdbId).catch(() => {});
}
