'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { OMDB_URL, API_KEY, MovieSummary, MovieDetail, hasPoster } from '../lib/omdb'
import MovieModal from './MovieModal'

const TYPES = [
  { value: '', label: 'Todo', icon: '✨' },
  { value: 'movie', label: 'Películas', icon: '🎬' },
  { value: 'series', label: 'Series', icon: '📺' },
]

const SUGGESTIONS = ['Batman', 'Avengers', 'Harry Potter', 'Star Wars', 'Breaking Bad', 'Toy Story']

export default function MovieSearch({ featured = [] }: { featured?: MovieDetail[] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [results, setResults] = useState<MovieSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')

  const [selected, setSelected] = useState<MovieDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const mosaic = featured.filter((m) => hasPoster(m.Poster)).slice(0, 18)
  const suggested = mosaic.slice(0, 6)

  // Búsqueda en tiempo real (con una pequeña espera mientras escribes)
  useEffect(() => {
    const text = query.trim()

    if (text.length < 3) {
      setResults([])
      setTotal(0)
      setLoading(false)
      setMessage(text.length === 0 ? '' : 'Escribe al menos 3 letras para buscar.')
      return
    }

    let cancelled = false
    setLoading(true)

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(OMDB_URL, {
          params: { apikey: API_KEY, s: text, type: type || undefined }
        })
        if (cancelled) return

        if (response.data.Response === 'True') {
          setResults(response.data.Search)
          setTotal(parseInt(response.data.totalResults, 10) || 0)
          setPage(1)
          setMessage('')
        } else {
          setResults([])
          setTotal(0)
          setMessage(response.data.Error || 'Sin resultados.')
        }
      } catch {
        if (!cancelled) {
          setResults([])
          setMessage('Ocurrió un error al buscar. Intenta de nuevo.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, type])

  // Cargar la siguiente página de resultados
  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await axios.get(OMDB_URL, {
        params: { apikey: API_KEY, s: query.trim(), type: type || undefined, page: nextPage }
      })
      if (response.data.Response === 'True') {
        setResults((prev) => {
          const known = new Set(prev.map((m) => m.imdbID))
          return [...prev, ...response.data.Search.filter((m: MovieSummary) => !known.has(m.imdbID))]
        })
        setPage(nextPage)
      }
    } finally {
      setLoadingMore(false)
    }
  }

  // Abrir el detalle de una película
  const openDetail = async (id: string) => {
    setLoadingDetail(true)
    try {
      const response = await axios.get(OMDB_URL, {
        params: { apikey: API_KEY, i: id, plot: 'full' }
      })
      if (response.data.Response === 'True') {
        setSelected(response.data)
      }
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <section id="buscar" className="scroll-mt-24 fade-up">
      <div className="relative rounded-[2rem] border border-white/10 bg-[#070d1c] shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Mosaico de pósters de fondo */}
        {mosaic.length > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          >
            <div className="absolute -inset-16 grid grid-cols-6 md:grid-cols-9 gap-3 -rotate-6 scale-110 opacity-[0.17]">
              {mosaic.map((m) => (
                <img
                  key={m.imdbID}
                  src={m.Poster}
                  alt=""
                  className="w-full aspect-[2/3] object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Brillos de color */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
        />

        <div className="relative p-6 md:p-12">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 text-[11px] font-bold tracking-[0.3em] text-sky-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Descubre
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-tight">
              ¿Qué quieres{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
                ver hoy?
              </span>
            </h2>
            <p className="text-slate-300/80 mt-3 max-w-xl mx-auto">
              Más de un millón de títulos. Busca una película o serie y haz clic para ver todos los detalles.
            </p>
          </div>

          {/* Input */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-sky-500 via-fuchsia-500 to-indigo-500 opacity-40 blur group-focus-within:opacity-90 transition" />
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-400"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe el nombre de una película o serie..."
                className="w-full pl-14 pr-14 py-5 text-base md:text-lg rounded-2xl bg-[#0d1730] text-white placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
                  aria-label="Borrar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  type === t.value
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30 scale-105'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Sugerencias de texto */}
          {query.trim().length === 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
              <span className="text-slate-500 text-sm">Prueba con:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-1.5 rounded-full text-sm border border-sky-400/30 text-sky-300 bg-sky-400/5 hover:bg-sky-400/20 hover:border-sky-400 hover:-translate-y-0.5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Sugeridas: llenan el espacio cuando no hay búsqueda */}
          {query.trim().length === 0 && suggested.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-400 to-fuchsia-500" />
                <h3 className="text-lg font-bold">Sugeridas para ti</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {suggested.map((m) => (
                  <button
                    key={m.imdbID}
                    onClick={() => setSelected(m)}
                    className="group relative text-left rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-sky-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(14,165,233,0.35)] transition duration-300"
                  >
                    <img
                      src={m.Poster}
                      alt={m.Title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 pt-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                      <p className="text-[11px] md:text-xs font-bold leading-tight line-clamp-2">{m.Title}</p>
                      {m.imdbRating && m.imdbRating !== 'N/A' && (
                        <p className="text-[11px] text-amber-300 font-semibold mt-0.5">★ {m.imdbRating}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-8">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-[#111d36] ring-1 ring-white/5 animate-pulse">
                <div className="aspect-[2/3] bg-[#1a2a48]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-4/5 rounded bg-[#1a2a48]" />
                  <div className="h-3 w-1/3 rounded bg-[#1a2a48]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && message && (
          <div className="text-center py-10 text-slate-400">
            <div className="text-4xl mb-2">🎞️</div>
            <p>{message}</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <p className="text-slate-400 text-sm mb-4">
            <strong className="text-white">{total}</strong> resultados para{' '}
            <strong className="text-sky-300">“{query.trim()}”</strong>
          </p>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie) => (
              <button
                key={movie.imdbID}
                onClick={() => openDetail(movie.imdbID)}
                className="fade-up group text-left rounded-2xl overflow-hidden bg-[#111d36] ring-1 ring-white/5 hover:ring-2 hover:ring-sky-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(14,165,233,0.25)] transition duration-300"
              >
                <div className="relative overflow-hidden">
                  {hasPoster(movie.Poster) ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#1a2a48] flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                      <span className="text-3xl">🎬</span>
                      Sin póster
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-sky-300 text-[10px] font-bold uppercase tracking-wide">
                    {movie.Type}
                  </span>
                  <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-bold">
                      Ver detalles →
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{movie.Title}</h3>
                  <p className="text-slate-400 text-xs mt-1">{movie.Year}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {results.length > 0 && results.length < total && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-60 font-bold shadow-lg shadow-sky-500/30 transition hover:scale-105"
            >
              {loadingMore ? 'Cargando...' : 'Cargar más'}
            </button>
          </div>
        )}
      </div>

      {loadingDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-sky-400"></div>
        </div>
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}