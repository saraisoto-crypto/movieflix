'use client'

import { useFavorites } from './FavoritesContext'
import MovieRail from './MovieRail'

export default function MyList() {
  const { favorites } = useFavorites()

  // Estado vacío: invita a guardar películas
  if (favorites.length === 0) {
    return (
      <section id="mi-lista" className="scroll-mt-24 fade-up">
        <div className="flex items-start gap-3">
          <span className="mt-1.5 h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-rose-400 to-fuchsia-500" />
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">Mi lista</h2>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              Tus favoritas, guardadas en este navegador.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03] px-6 py-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-2xl text-rose-400">
            ♡
          </div>
          <div className="text-center sm:text-left">
            <p className="font-bold text-white">Aún no tienes favoritas</p>
            <p className="text-sm text-slate-400 mt-1">
              Toca el corazón ♡ de cualquier película y aparecerá aquí para verla cuando quieras.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <MovieRail
      id="mi-lista"
      title="❤️ Mi lista"
      subtitle="Tus favoritas, guardadas en este navegador."
      movies={favorites}
    />
  )
}