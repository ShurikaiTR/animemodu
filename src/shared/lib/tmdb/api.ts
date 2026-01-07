import { TMDBDetailsService } from "./details-service";
import { TMDBDiscoveryService } from "./discovery-service";
import { TMDBReferenceService } from "./reference-service";
import { TMDBSearchService } from "./search-service";

// Export wrapper functions for backward compatibility
export const getAnimeDetails = TMDBDetailsService.getAnimeDetails;
export const getTMDBDetails = TMDBDetailsService.getTMDBDetails;
export const getSeasonDetails = TMDBDetailsService.getSeasonDetails;

export const getTrendingAnime = TMDBDiscoveryService.getTrendingAnime;
export const getPopularAnimeMovies = TMDBDiscoveryService.getPopularAnimeMovies;
export const getWeeklyTrendingAnime = TMDBDiscoveryService.getWeeklyTrendingAnime;

export const searchMulti = TMDBSearchService.searchMulti;

export const getTVGenres = TMDBReferenceService.getTVGenres;
export const getMovieGenres = TMDBReferenceService.getMovieGenres;
