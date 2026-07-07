export type PopcornPiece = {
	id: number;
	x: number;
	y: number;
	rotate: number;
	tone: 0 | 1 | 2;
	delay: number;
	scale?: number;
};

export const interiorPopcornPieces: PopcornPiece[] = [
	{ id: 1, x: 27, y: 82, rotate: -12, tone: 0, delay: 0.1 },
	{ id: 2, x: 35, y: 84, rotate: 8, tone: 1, delay: 0.22 },
	{ id: 3, x: 44, y: 83, rotate: -6, tone: 2, delay: 0.34 },
	{ id: 4, x: 53, y: 84, rotate: 14, tone: 0, delay: 0.46 },
	{ id: 5, x: 61, y: 82, rotate: -10, tone: 1, delay: 0.58 },
	{ id: 6, x: 31, y: 74, rotate: 10, tone: 2, delay: 0.72 },
	{ id: 7, x: 40, y: 76, rotate: -8, tone: 0, delay: 0.84 },
	{ id: 8, x: 48, y: 75, rotate: 6, tone: 1, delay: 0.96 },
	{ id: 9, x: 57, y: 76, rotate: -14, tone: 2, delay: 1.08 },
	{ id: 10, x: 34, y: 67, rotate: -5, tone: 0, delay: 1.22 },
	{ id: 11, x: 44, y: 68, rotate: 12, tone: 1, delay: 1.34 },
	{ id: 12, x: 54, y: 67, rotate: -9, tone: 2, delay: 1.46 },
	{ id: 13, x: 38, y: 60, rotate: 7, tone: 0, delay: 1.6 },
	{ id: 14, x: 50, y: 61, rotate: -11, tone: 1, delay: 1.72 },
	{ id: 15, x: 44, y: 53, rotate: 5, tone: 2, delay: 1.86 },
	{ id: 16, x: 36, y: 55, rotate: -7, tone: 0, delay: 1.98 },
	{ id: 17, x: 52, y: 54, rotate: 9, tone: 1, delay: 2.1 },
	{ id: 18, x: 30, y: 48, rotate: -8, tone: 2, delay: 2.24 },
	{ id: 19, x: 42, y: 47, rotate: 11, tone: 0, delay: 2.36 },
	{ id: 20, x: 54, y: 48, rotate: -6, tone: 1, delay: 2.48 },
	{ id: 21, x: 36, y: 44, rotate: 8, tone: 2, delay: 2.62 },
	{ id: 22, x: 44, y: 43, rotate: -10, tone: 0, delay: 2.74 },
	{ id: 23, x: 52, y: 44, rotate: 6, tone: 1, delay: 2.86 },
	{ id: 24, x: 40, y: 40, rotate: -5, tone: 2, delay: 3 },
	{ id: 25, x: 48, y: 39, rotate: 12, tone: 0, delay: 3.12 },
	{ id: 26, x: 44, y: 37, rotate: -7, tone: 1, delay: 3.24 }
];

export const surfacePopcornPieces: PopcornPiece[] = [
	{ id: 101, x: 28, y: 39, rotate: -10, tone: 0, delay: 0 },
	{ id: 102, x: 36, y: 37, rotate: 8, tone: 2, delay: 0 },
	{ id: 103, x: 44, y: 36, rotate: -6, tone: 1, delay: 0 },
	{ id: 104, x: 52, y: 37, rotate: 12, tone: 0, delay: 0 },
	{ id: 105, x: 60, y: 39, rotate: -8, tone: 2, delay: 0 },
	{ id: 106, x: 32, y: 41, rotate: 6, tone: 1, delay: 0 },
	{ id: 107, x: 40, y: 40, rotate: -12, tone: 0, delay: 0 },
	{ id: 108, x: 48, y: 40, rotate: 9, tone: 2, delay: 0 },
	{ id: 109, x: 56, y: 41, rotate: -5, tone: 1, delay: 0 }
];

export const overflowPopcornPieces: PopcornPiece[] = [
	{ id: 27, x: 32, y: 33, rotate: -14, tone: 0, delay: 3.38, scale: 1.12 },
	{ id: 28, x: 44, y: 31, rotate: 8, tone: 2, delay: 3.5, scale: 1.18 },
	{ id: 29, x: 56, y: 33, rotate: -9, tone: 1, delay: 3.62, scale: 1.1 },
	{ id: 30, x: 38, y: 28, rotate: 10, tone: 2, delay: 3.74, scale: 1.15 },
	{ id: 31, x: 50, y: 27, rotate: -6, tone: 0, delay: 3.86, scale: 1.2 },
	{ id: 32, x: 44, y: 24, rotate: 5, tone: 1, delay: 3.98, scale: 1.22 },
	{ id: 33, x: 29, y: 27, rotate: 12, tone: 2, delay: 4.08, scale: 1.08 },
	{ id: 34, x: 59, y: 28, rotate: -11, tone: 0, delay: 4.18, scale: 1.1 }
];

export const spilledPopcornPieces: PopcornPiece[] = [
	{ id: 201, x: 16, y: 86, rotate: -22, tone: 0, delay: 0, scale: 0.95 },
	{ id: 202, x: 24, y: 89, rotate: 16, tone: 1, delay: 0, scale: 1 },
	{ id: 203, x: 32, y: 87, rotate: -10, tone: 2, delay: 0, scale: 0.92 },
	{ id: 204, x: 40, y: 90, rotate: 20, tone: 0, delay: 0, scale: 1.05 },
	{ id: 205, x: 48, y: 88, rotate: -14, tone: 1, delay: 0, scale: 0.98 },
	{ id: 206, x: 56, y: 91, rotate: 8, tone: 2, delay: 0, scale: 1.02 },
	{ id: 207, x: 64, y: 87, rotate: -18, tone: 0, delay: 0, scale: 0.96 },
	{ id: 208, x: 72, y: 89, rotate: 12, tone: 1, delay: 0, scale: 1.04 },
	{ id: 209, x: 78, y: 85, rotate: -8, tone: 2, delay: 0, scale: 0.9 },
	{ id: 210, x: 50, y: 74, rotate: 6, tone: 2, delay: 0, scale: 1.08 },
	{ id: 211, x: 58, y: 77, rotate: -12, tone: 0, delay: 0, scale: 1.1 },
	{ id: 212, x: 66, y: 72, rotate: 15, tone: 1, delay: 0, scale: 1.05 },
	{ id: 213, x: 54, y: 68, rotate: -6, tone: 2, delay: 0, scale: 0.98 },
	{ id: 214, x: 62, y: 64, rotate: 10, tone: 0, delay: 0, scale: 1.12 },
	{ id: 215, x: 70, y: 60, rotate: -16, tone: 1, delay: 0, scale: 1.06 },
	{ id: 216, x: 74, y: 66, rotate: 8, tone: 2, delay: 0, scale: 0.94 },
	{ id: 217, x: 68, y: 54, rotate: -10, tone: 0, delay: 0, scale: 1.02 },
	{ id: 218, x: 76, y: 58, rotate: 14, tone: 1, delay: 0, scale: 0.97 }
];

export const popcornTones = {
	0: { main: '#fde68a', light: '#fef9c3', dark: '#facc15' },
	1: { main: '#fef3c7', light: '#fffbeb', dark: '#fde68a' },
	2: { main: '#facc15', light: '#fde68a', dark: '#eab308' }
} as const;
