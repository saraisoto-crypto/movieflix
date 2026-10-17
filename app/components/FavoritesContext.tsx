'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { MovieDetail } from '../lib/omdb'

interface FavoritesValue {
  favorites: MovieDetail[]
  isFav: (id: string) => boolean
  toggle: (movie: MovieDetail) => void
}

const FavoritesContext = createContext<FavoritesValue>({
  favorites: [],
  isFav: () => false,
  toggle: () => {},
})

const KEY = 'cinemanext-favoritos'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MovieDetail[]>([])
  const [loaded, setLoaded] = useState(false)

  // Cargar favoritos guardados en el navegador
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  // Guardar cada vez que cambian
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites, loaded])

  const isFav = (id: string) => favorites.some((m) => m.imdbID === id)

  const toggle = (movie: MovieDetail) => {
    setFavorites((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID)
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFav, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}