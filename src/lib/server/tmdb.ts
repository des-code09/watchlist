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

export type TmdbMovieDetails = {
	title: string;
	overview: string | null;
	releaseYear: string | null;
	genres: string[];
	voteAverage: number | null;
	backdropUrl: string | null;
	posterUrl: string | null;
	trailer: { youtubeKey: string } | null;
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

type TmdbGenre = {
	id: number;
	name: string;
};

type TmdbMovieDetailResponse = {
	title: string;
	overview: string;
	vote_average: number;
	release_date?: string;
	backdrop_path: string | null;
	poster_path: string | null;
	genres: TmdbGenre[];
};

type TmdbVideo = {
	key: string;
	site: string;
	type: string;
};

type TmdbVideosResponse = {
	results: TmdbVideo[];
};

export function posterUrl(
	path: string | null,
	size: 'w185' | 'w342' | 'w500' = 'w342'
): string | null {
	if (!path) return null;
	return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(
	path: string | null,
	size: 'w780' | 'w1280' = 'w780'
): string | null {
	if (!path) return null;
	return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

function tmdbHeaders(): HeadersInit {
	return {
		Authorization: `Bearer ${env.TMDB_API_KEY}`
	};
}

function pickTrailer(videos: TmdbVideo[]): { youtubeKey: string } | null {
	const youtube = videos.filter((video) => video.site === 'YouTube');
	const trailer = youtube.find((video) => video.type === 'Trailer');
	const teaser = youtube.find((video) => video.type === 'Teaser');
	const pick = trailer ?? teaser;
	return pick ? { youtubeKey: pick.key } : null;
}

export async function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
	const movieUrl = `${TMDB_BASE_URL}/movie/${tmdbId}`;
	const videosUrl = `${TMDB_BASE_URL}/movie/${tmdbId}/videos`;

	const [movieResponse, videosResponse] = await Promise.all([
		fetch(movieUrl, { headers: tmdbHeaders() }),
		fetch(videosUrl, { headers: tmdbHeaders() })
	]);

	if (!movieResponse.ok) {
		throw new Error(`TMDB movie details failed: ${movieResponse.status}`);
	}

	const movie = (await movieResponse.json()) as TmdbMovieDetailResponse;
	const videos = videosResponse.ok
		? ((await videosResponse.json()) as TmdbVideosResponse).results
		: [];

	return {
		title: movie.title,
		overview: movie.overview || null,
		releaseYear: movie.release_date?.slice(0, 4) ?? null,
		genres: movie.genres.map((genre) => genre.name),
		voteAverage: movie.vote_average > 0 ? Math.round(movie.vote_average * 10) / 10 : null,
		backdropUrl: backdropUrl(movie.backdrop_path, 'w780'),
		posterUrl: posterUrl(movie.poster_path, 'w500'),
		trailer: pickTrailer(videos)
	};
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
	const url = new URL(`${TMDB_BASE_URL}/search/movie`);
	url.searchParams.set('query', query);
	url.searchParams.set('include_adult', 'false');

	const response = await fetch(url, {
		headers: tmdbHeaders()
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
