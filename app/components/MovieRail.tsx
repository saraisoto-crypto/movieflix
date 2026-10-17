'use client'

import { useRef, useState } from 'react'
import { MovieDetail, hasPoster, genresOf } from '../lib/omdb'
import { useFavorites } from './FavoritesContext'
import MovieModal from './MovieModal'

interface Props {
  id?: string
  title: string
  subtitle?: string
  movies: MovieDetail[]
  showGenres?: boolean
}

export default function MovieRail({ id, title, subtitle, movies, showGenres }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [genre, setGenre] = useState('Todo')
  const [selected, setSelected] = useState<MovieDetail | null>(null)
  const { isFav, toggle } = useFavorites()

  const genres = ['Todo', ...Array.from(new Set(movies.flatMap(genresOf)))]
  const visible = genre === 'Todo' ? movies : movies.filter((m) => genresOf(m).includes(genre))

  const scroll = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * 640, behavior: 'smooth' })
  }

  return (
    <section id={id} className="scroll-mt-24 fade-up">
      {/* Encabezado */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-1.5 h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-sky-400 to-fuchsia-500" />
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">{title}</h2>
            {subtitle && <p className="text-slate-400 mt-1 text-sm md:text-base">{subtitle}</p>}
          </div>
        </div>

        <div className="hidden md:flex gap-2 shrink-0">
          <button
            onClick={() => scroll(-1)}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-2xl text-white hover:bg-sky-500 hover:border-sky-400 transition"
            aria-label="Deslizar a la izquierda"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-2xl text-white hover:bg-sky-500 hover:border-sky-400 transition"
            aria-label="Deslizar a la derecha"
          >
            ›
          </button>
        </div>
      </div>

      {showGenres && (
        <div className="flex flex-wrap gap-2 mt-5">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                genre === g
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <div ref={railRef} className="rail flex gap-5 overflow-x-auto pb-6 pt-2 px-1 snap-x">
          {visible.map((movie) => (
            <article
              key={movie.imdbID}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(movie)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelected(movie)
              }}
              className="group snap-start shrink-0 w-40 sm:w-48 md:w-56 cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg shadow-black/50 transition duration-300 group-hover:-translate-y-2 group-hover:ring-2 group-hover:ring-sky-400/80 group-hover:shadow-[0_25px_55px_rgba(14,165,233,0.35)]">
                {hasPoster(movie.Poster) ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition duration-700"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-[#1a2a48] flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                    <span className="text-3xl">🎬</span>
                    Sin póster
                  </div>
                )}

                {/* Sombra inferior permanente */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Info al pasar el mouse */}
                <div className="absolute inset-0 flex flex-col justify-end p-3.5 bg-gradient-to-t from-black via-black/85 to-black/20 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {genresOf(movie)
                      .slice(0, 2)
                      .map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/30 text-sky-200 text-[10px] font-semibold"
                        >
                          {g}
                        </span>
                      ))}
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-4 leading-relaxed">{movie.Plot}</p>
                  <span className="mt-3 inline-flex self-start items-center gap-1 px-3 py-1.5 rounded-full bg-white text-black text-xs font-extrabold">
                    ▶ Ver detalles
                  </span>
                </div>

                {/* Corazón */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(movie)
                  }}
                  className={`absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center text-lg backdrop-blur-md border transition hover:scale-110 ${
                    isFav(movie.imdbID)
                      ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-black/40 border-white/20 text-white hover:bg-rose-500 hover:border-rose-400'
                  }`}
                  aria-label="Agregar a mi lista"
                >
                  {isFav(movie.imdbID) ? '♥' : '♡'}
                </button>

                {/* Rating */}
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <span className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-extrabold">
                    ★ {movie.imdbRating}
                  </span>
                )}
              </div>

              <div className="px-1 pt-3">
                <h3 className="text-sm md:text-base font-bold leading-tight line-clamp-1 text-white group-hover:text-sky-300 transition">
                  {movie.Title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {movie.Year}
                  {movie.Runtime && movie.Runtime !== 'N/A' ? ` · ${movie.Runtime}` : ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}