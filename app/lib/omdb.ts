export const OMDB_URL = 'https://www.omdbapi.com/'
export const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY

export interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export interface MovieDetail extends MovieSummary {
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  imdbRating?: string
  imdbVotes?: string
  totalSeasons?: string
  Response: string
  Error?: string
}

// Imagen del banner con la información de la película (si se encontró)
export interface Slide {
  src: string
  title: string
  detail: MovieDetail | null
}

export function hasPoster(poster?: string): boolean {
  return !!poster && poster !== 'N/A'
}

export function genresOf(movie: MovieDetail): string[] {
  return movie.Genre ? movie.Genre.split(', ') : []
}