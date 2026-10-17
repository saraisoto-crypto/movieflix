'use client'

import { useEffect } from 'react'
import { MovieDetail, hasPoster, genresOf } from '../lib/omdb'
import { useFavorites } from './FavoritesContext'

export default function MovieModal({ movie, onClose }: { movie: MovieDetail; onClose: () => void }) {
  const { isFav, toggle } = useFavorites()
  const fav = isFav(movie.imdbID)

  // Cerrar con Escape y bloquear el scroll de la página de fondo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const info: [string, string | undefined][] = [
    ['Director', movie.Director],
    ['Guion', movie.Writer],
    ['Actores', movie.Actors],
    ['Estreno', movie.Released],
    ['Idioma', movie.Language],
    ['País', movie.Country],
    ['Premios', movie.Awards],
  ]

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fade-up relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#0f1b2d] ring-1 ring-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo borroso con el póster */}
        {hasPoster(movie.Poster) && (
          <div
            className="absolute inset-0 opacity-25 blur-3xl scale-125"
            style={{
              backgroundImage: `url(${movie.Poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-sky-500 transition font-bold"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="md:flex gap-6 p-6">
            {hasPoster(movie.Poster) ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full md:w-64 rounded-xl shadow-2xl object-cover self-start"
              />
            ) : (
              <div className="w-full md:w-64 h-80 rounded-xl bg-[#1d2f49] flex items-center justify-center text-slate-500">
                Sin póster
              </div>
            )}

            <div className="mt-5 md:mt-0 flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white pr-10">{movie.Title}</h2>

              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
                <span className="px-2.5 py-1 rounded bg-white/10 text-slate-200">{movie.Year}</span>
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="px-2.5 py-1 rounded border border-white/30 text-slate-200">{movie.Rated}</span>
                )}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="px-2.5 py-1 rounded bg-white/10 text-slate-200">{movie.Runtime}</span>
                )}
                {movie.totalSeasons && (
                  <span className="px-2.5 py-1 rounded bg-white/10 text-slate-200">
                    {movie.totalSeasons} temporadas
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {genresOf(movie).map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-semibold">
                    {g}
                  </span>
                ))}
              </div>

              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <p className="mt-4 text-lg">
                  ⭐ <strong className="text-yellow-300">{movie.imdbRating}</strong>
                  <span className="text-slate-400">/10 </span>
                  <span className="text-slate-500 text-sm">({movie.imdbVotes} votos)</span>
                </p>
              )}

              <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-200">{movie.Plot}</p>

              <dl className="mt-5 text-sm space-y-1.5">
                {info.map(([label, value]) =>
                  value && value !== 'N/A' ? (
                    <div key={label}>
                      <dt className="inline font-bold text-sky-300">{label}: </dt>
                      <dd className="inline text-slate-300">{value}</dd>
                    </div>
                  ) : null
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => toggle(movie)}
                  className={`px-5 py-2.5 rounded-lg font-bold transition ${
                    fav ? 'bg-rose-500 text-white hover:bg-rose-400' : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {fav ? '♥ En mi lista' : '＋ Agregar a mi lista'}
                </button>
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 font-semibold transition"
                >
                  Ver en IMDb ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}