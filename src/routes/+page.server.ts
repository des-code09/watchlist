import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { formatGenres, isMovieStatus, type MovieStatus } from '$lib/movie';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { movie } from '$lib/server/db/schema';
import { getMovieDetails, isValidPosterUrl } from '$lib/server/tmdb';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, '/login');
	}

	const rows = await db
		.select()
		.from(movie)
		.where(eq(movie.userId, user.id))
		.orderBy(desc(movie.createdAt));

	await Promise.all(
		rows
			.filter((row) => row.tmdbId != null && row.tmdbRating == null)
			.map(async (row) => {
				try {
					const details = await getMovieDetails(row.tmdbId!);
					if (details.voteAverage != null) {
						await db
							.update(movie)
							.set({ tmdbRating: details.voteAverage })
							.where(eq(movie.id, row.id));
						row.tmdbRating = details.voteAverage;
					}
				} catch {
					// Skip if TMDB details fail
				}
			})
	);

	return {
		movies: rows.map((row) => ({
			...row,
			status: (isMovieStatus(row.status) ? row.status : 'to_watch') as MovieStatus
		}))
	};
};

export const actions: Actions = {
	addMovie: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString().trim() ?? '';
		const tmdbIdRaw = formData.get('tmdbId')?.toString();
		const posterUrl = formData.get('posterUrl')?.toString().trim() ?? '';
		const releaseYearRaw = formData.get('releaseYear')?.toString().trim() ?? '';
		const tmdbId = tmdbIdRaw ? Number.parseInt(tmdbIdRaw, 10) : NaN;

		if (!title) {
			return fail(400, { message: 'Title is required' });
		}

		if (!tmdbIdRaw || Number.isNaN(tmdbId) || tmdbId <= 0) {
			return fail(400, { message: 'Select a movie from search results' });
		}

		if (!isValidPosterUrl(posterUrl || null)) {
			return fail(400, { message: 'Invalid poster URL' });
		}

		let releaseYear: number | null = null;
		if (releaseYearRaw) {
			const parsedYear = Number.parseInt(releaseYearRaw, 10);
			if (!Number.isNaN(parsedYear) && parsedYear > 0) {
				releaseYear = parsedYear;
			}
		}

		let genres: string | null = null;
		let tmdbRating: number | null = null;
		try {
			const details = await getMovieDetails(tmdbId);
			if (details.genres.length > 0) {
				genres = formatGenres(details.genres);
			}
			if (details.voteAverage != null) {
				tmdbRating = details.voteAverage;
			}
			if (releaseYear == null && details.releaseYear) {
				const parsedYear = Number.parseInt(details.releaseYear, 10);
				if (!Number.isNaN(parsedYear) && parsedYear > 0) {
					releaseYear = parsedYear;
				}
			}
		} catch {
			// Proceed without genres if TMDB details fail
		}

		const [existing] = await db
			.select({ id: movie.id })
			.from(movie)
			.where(and(eq(movie.userId, user.id), eq(movie.tmdbId, tmdbId)))
			.limit(1);

		if (existing) {
			return fail(409, { message: 'Already on your list' });
		}

		await db.insert(movie).values({
			title,
			tmdbId,
			posterUrl: posterUrl || null,
			releaseYear,
			genres,
			tmdbRating,
			status: 'to_watch',
			userId: user.id
		});
	},
	removeMovie: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const idRaw = formData.get('id')?.toString();
		const id = idRaw ? Number.parseInt(idRaw, 10) : NaN;

		if (!idRaw || Number.isNaN(id)) {
			return fail(400, { message: 'Invalid movie' });
		}

		await db.delete(movie).where(and(eq(movie.id, id), eq(movie.userId, user.id)));
	},
	updateRating: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const idRaw = formData.get('id')?.toString();
		const ratingRaw = formData.get('rating')?.toString();
		const id = idRaw ? Number.parseInt(idRaw, 10) : NaN;

		if (!idRaw || Number.isNaN(id)) {
			return fail(400, { message: 'Invalid movie' });
		}

		let userRating: number | null = null;
		if (ratingRaw && ratingRaw.trim() !== '') {
			const rating = Number.parseInt(ratingRaw, 10);
			if (Number.isNaN(rating) || rating < 1 || rating > 5) {
				return fail(400, { message: 'Rating must be between 1 and 5' });
			}
			userRating = rating;
		}

		const result = await db
			.update(movie)
			.set({ userRating })
			.where(and(eq(movie.id, id), eq(movie.userId, user.id)))
			.returning({ id: movie.id });

		if (result.length === 0) {
			return fail(404, { message: 'Movie not found' });
		}
	},
	updateStatus: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const idRaw = formData.get('id')?.toString();
		const statusRaw = formData.get('status')?.toString();
		const id = idRaw ? Number.parseInt(idRaw, 10) : NaN;

		if (!idRaw || Number.isNaN(id)) {
			return fail(400, { message: 'Invalid movie' });
		}

		if (!statusRaw || !isMovieStatus(statusRaw)) {
			return fail(400, { message: 'Invalid status' });
		}

		const result = await db
			.update(movie)
			.set({ status: statusRaw })
			.where(and(eq(movie.id, id), eq(movie.userId, user.id)))
			.returning({ id: movie.id });

		if (result.length === 0) {
			return fail(404, { message: 'Movie not found' });
		}
	},
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
	}
};
