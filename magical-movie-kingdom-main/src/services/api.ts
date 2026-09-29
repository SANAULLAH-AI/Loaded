
// API Constants
export const API_KEY = '0f012c42b77a742b6b060aa933188a9c';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const DISNEY_API_URL = 'https://api.disneyapi.dev';

// Storage Keys
export const STORAGE_KEY = '@disney_movies';
export const USER_KEY = '@disney_user';
export const FAV_KEY = '@disney_favorites';
export const HIST_KEY = '@disney_history';
export const DOWN_KEY = '@disney_downloads';

// Fetch movies from TMDB
export const fetchTrending = async () => {
  const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
  return response.json();
};

export const fetchMovieDetails = async (movieId: string) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
  return response.json();
};

export const fetchTVDetails = async (showId: string) => {
  const response = await fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&append_to_response=videos,credits`);
  return response.json();
};

export const searchContent = async (query: string) => {
  const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  return response.json();
};

// Company IDs for Disney brands
const COMPANY_IDS = {
  disney: 2,
  pixar: 3,
  marvel: 420,
  starWars: 1,
  natGeo: 7521
};

export const fetchByCompany = async (company: keyof typeof COMPANY_IDS) => {
  const companyId = COMPANY_IDS[company];
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=${companyId}&sort_by=popularity.desc`
  );
  return response.json();
};

export const fetchDisneyCharacters = async (page = 1) => {
  const response = await fetch(`${DISNEY_API_URL}/characters?page=${page}`);
  return response.json();
};

// User Related Functions
export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const getFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving from storage:', error);
    return null;
  }
};

export const addToFavorites = (movie: any) => {
  const favorites = getFromStorage(FAV_KEY) || [];
  if (!favorites.some((fav: any) => fav.id === movie.id)) {
    saveToStorage(FAV_KEY, [...favorites, movie]);
    return true;
  }
  return false;
};

export const removeFromFavorites = (movieId: number) => {
  const favorites = getFromStorage(FAV_KEY) || [];
  saveToStorage(FAV_KEY, favorites.filter((movie: any) => movie.id !== movieId));
};

export const addToHistory = (movie: any) => {
  const history = getFromStorage(HIST_KEY) || [];
  // Remove if exists already to avoid duplicates
  const filteredHistory = history.filter((item: any) => item.id !== movie.id);
  // Add to beginning of array (most recent first)
  saveToStorage(HIST_KEY, [movie, ...filteredHistory].slice(0, 20));
};

export const simulateDownload = (movie: any) => {
  const downloads = getFromStorage(DOWN_KEY) || [];
  if (!downloads.some((dl: any) => dl.id === movie.id)) {
    saveToStorage(DOWN_KEY, [...downloads, { ...movie, progress: 100 }]);
    return true;
  }
  return false;
};
