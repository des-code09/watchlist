import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMovieDetails } from '$lib/server/tmdb';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}

	const tmdbId = Number.parseInt(event.params.tmdbId, 10);
	if (Number.isNaN(tmdbId) || tmdbId <= 0) {
		error(400, 'Invalid movie id');
	}

	try {
		const details = await getMovieDetails(tmdbId);
		return json(details);
	} catch {
		error(502, 'Failed to fetch movie details');
	}
};
