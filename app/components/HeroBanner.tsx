'use client'

import { useState, useEffect } from 'react'
import { Slide, MovieDetail, genresOf } from '../lib/omdb'
import { useFavorites } from './FavoritesContext'
import MovieModal from './MovieModal'

export default function HeroBanner({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<MovieDetail | null>(null)
  const { isFav, toggle } = useFavorites()

  // Cambia de banner automáticamente cada 6 segundos
  useEffect(() => {
    if (paused || slides.length < 2 || selected) return
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 6000)
    return () => clearTimeout(timer)
  }, [current, paused, slides.length, selected])

  // Si no hay imágenes en public/banners
  if (slides.length === 0) {
    return (
      <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-sky-900 via-indigo-900 to-[#0b1220] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            MOVIE<span className="text-red-500">FLIX</span>
          </h1>
          <p className="mt-3 text-slate-300">
            Guarda imágenes en la carpeta public/banners y aparecerán aquí.
          </p>
        </div>
      </div>
    )
  }

  const slide = slides[current]
  const detail = slide.detail
  const pad = (n: number) => String(n).padStart(2, '0')

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  return (
    <div
      className="relative w-full h-[82vh] min-h-[560px] max-h-[860px] overflow-hidden bg-[#0b1220]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imágenes con zoom lento (efecto cine) */}
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[8000ms] ease-out ${
            i === current ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}
        />
      ))}

      {/* Degradados */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />

      {/* Información */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-14 pb-20 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div key={current} className="fade-up max-w-2xl">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/40 bg-sky-400/10 backdrop-blur text-sky-300 text-[11px] font-bold tracking-[0.25em]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              DESTACADA
            </p>

            <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.7)]">
              {detail?.Title ?? slide.title}
            </h1>

            {detail && (
              <>
                <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
                  {detail.imdbRating && detail.imdbRating !== 'N/A' && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400 text-black font-extrabold">
                      ★ {detail.imdbRating}
                    </span>
                  )}
                  {detail.Rated && detail.Rated !== 'N/A' && (
                    <span className="px-2 py-0.5 rounded border border-white/40 text-white/90 text-xs font-bold">
                      {detail.Rated}
                    </span>
                  )}
                  <span className="text-slate-200 font-medium">{detail.Year}</span>
                  {detail.Runtime && detail.Runtime !== 'N/A' && (
                    <span className="text-slate-300">· {detail.Runtime}</span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {genresOf(detail).map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold text-slate-100"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="hidden md:block mt-4 text-lg text-slate-200/90 leading-relaxed line-clamp-3 max-w-xl">
                  {detail.Plot}
                </p>
              </>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {detail ? (
                <>
                  <button
                    onClick={() => setSelected(detail)}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black font-extrabold shadow-xl shadow-black/40 hover:bg-sky-100 hover:scale-105 transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Más información
                  </button>
                  <button
                    onClick={() => toggle(detail)}
                    className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold backdrop-blur-md border transition hover:scale-105 ${
                      isFav(detail.imdbID)
                        ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-lg leading-none">{isFav(detail.imdbID) ? '♥' : '＋'}</span>
                    {isFav(detail.imdbID) ? 'En mi lista' : 'Mi lista'}
                  </button>
                </>
              ) : (
                <a
                  href="#cartelera"
                  className="px-7 py-3.5 rounded-xl bg-white text-black font-extrabold hover:bg-sky-100 transition"
                >
                  ▶ Ver cartelera
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          {/* Flechas */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur border border-white/15 hover:bg-sky-500 hover:border-sky-400 text-2xl transition"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur border border-white/15 hover:bg-sky-500 hover:border-sky-400 text-2xl transition"
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* Contador + miniaturas (pantallas grandes) */}
          <div className="hidden md:flex flex-col items-end gap-3 absolute bottom-16 right-14">
            <p className="text-sm font-bold tracking-widest text-white/80">
              <span className="text-2xl text-white">{pad(current + 1)}</span> / {pad(slides.length)}
            </p>
            <div className="flex gap-3 p-2 rounded-2xl bg-black/30 backdrop-blur border border-white/10">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => setCurrent(i)}
                  className={`relative w-28 h-16 rounded-xl overflow-hidden transition ${
                    i === current ? 'ring-2 ring-sky-400 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Ir a ${s.title}`}
                >
                  <img src={s.src} alt={s.title} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 px-1.5 pb-0.5 pt-3 bg-gradient-to-t from-black/90 to-transparent text-[10px] font-bold text-white truncate text-left">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Puntos (celular) */}
          <div className="md:hidden absolute bottom-12 right-6 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-8 bg-sky-400' : 'w-4 bg-white/40'
                }`}
                aria-label={`Ir a ${s.title}`}
              />
            ))}
          </div>

          {/* Barra de progreso */}
          {!paused && !selected && <div key={current} className="hero-progress absolute bottom-0 left-0" />}
        </>
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}