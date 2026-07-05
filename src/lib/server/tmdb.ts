import { env } from '$env/dynamic/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export type TmdbSearchResult = {
	tmdbId: number;
	title: string;
	year: string | null;
	thumbnailUrl: string | null;
	posterUrl: string | null;
};

type TmdbMovieResult = {
	id: number;
	title: string;
	release_date?: string;
	poster_path: string | null;
};

type TmdbSearchResponse = {
	results: TmdbMovieResult[];
};

export function posterUrl(
	path: string | null,
	size: 'w185' | 'w342' | 'w500' = 'w342'
): string | null {
	if (!path) return null;
	return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
	const url = new URL(`${TMDB_BASE_URL}/search/movie`);
	url.searchParams.set('query', query);
	url.searchParams.set('include_adult', 'false');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	});

	if (!response.ok) {
		throw new Error(`TMDB search failed: ${response.status}`);
	}

	const data = (await response.json()) as TmdbSearchResponse;

	return data.results.map((result) => ({
		tmdbId: result.id,
		title: result.title,
		year: result.release_date?.slice(0, 4) ?? null,
		thumbnailUrl: posterUrl(result.poster_path, 'w185'),
		posterUrl: posterUrl(result.poster_path, 'w342')
	}));
}

export function isValidPosterUrl(url: string | null | undefined): boolean {
	if (!url) return true;
	return url.startsWith('https://image.tmdb.org/');
}
