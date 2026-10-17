import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { FavoritesProvider } from './components/FavoritesContext'
import NavBar from './components/NavBar'
import HeroBanner from './components/HeroBanner'
import MyList from './components/MyList'
import MovieRail from './components/MovieRail'
import MovieSearch from './components/MovieSearch'
import { OMDB_URL, API_KEY, MovieDetail, Slide } from './lib/omdb'

// Fuerza que la página se genere en el servidor en cada visita
export const dynamic = 'force-dynamic'

// Cada carrusel de la página: título, subtítulo y los IDs de IMDb que muestra
const RAILS = [
  {
    id: 'cartelera',
    title: 'En cartelera',
    subtitle: 'Lo más popular del momento. Desliza para ver más y haz clic para ver los detalles.',
    genres: true,
    ids: [
      'tt0111161', 'tt0068646', 'tt0468569', 'tt1375666', 'tt0133093', 'tt0816692',
      'tt0903747', 'tt0944947', 'tt1160419', 'tt15398776', 'tt7286456', 'tt6751668',
    ],
  },
  {
    id: 'mejor-valoradas',
    title: '🏆 Mejor valoradas',
    subtitle: 'Las películas que todo cinéfilo tiene que ver al menos una vez.',
    genres: false,
    ids: [
      'tt0071562', 'tt0110912', 'tt0108052', 'tt0050083', 'tt0167260', 'tt0137523',
      'tt0109830', 'tt0099685', 'tt0114369', 'tt0245429', 'tt0172495', 'tt0482571',
    ],
  },
  {
    id: 'accion',
    title: '💥 Acción y aventura',
    subtitle: 'Explosiones, superhéroes y adrenalina sin parar.',
    genres: false,
    ids: [
      'tt0848228', 'tt4154796', 'tt4154756', 'tt1345836', 'tt1392190', 'tt2911666',
      'tt1745960', 'tt1877830', 'tt1825683', 'tt3315342', 'tt0095016', 'tt1074638',
    ],
  },
  {
    id: 'ciencia-ficcion',
    title: '🚀 Ciencia ficción',
    subtitle: 'Viajes en el tiempo, espacio, robots y futuros imposibles.',
    genres: false,
    ids: [
      'tt1856101', 'tt0078748', 'tt0088763', 'tt2543164', 'tt3659388', 'tt1454468',
      'tt0470752', 'tt1631867', 'tt0076759', 'tt0499549', 'tt0103064', 'tt0107290',
    ],
  },
  {
    id: 'animacion',
    title: '🎨 Animación',
    subtitle: 'Para toda la familia, y también para los que nunca crecimos.',
    genres: false,
    ids: [
      'tt0114709', 'tt2380307', 'tt2096673', 'tt0910970', 'tt0382932', 'tt1049413',
      'tt0110357', 'tt0266543', 'tt0317705', 'tt4633694', 'tt0126029', 'tt0441773',
    ],
  },
  {
    id: 'terror',
    title: '🔪 Terror y suspenso',
    subtitle: 'Apaga las luces y sube el volumen.',
    genres: false,
    ids: [
      'tt0070047', 'tt0081505', 'tt5052448', 'tt7784604', 'tt1457767', 'tt0102926',
      'tt1130884', 'tt2267998', 'tt0114814', 'tt0054215', 'tt0073195', 'tt6644200',
    ],
  },
  {
    id: 'series',
    title: '📺 Series para maratonear',
    subtitle: 'Prepara las palomitas: una más y ya me duermo.',
    genres: false,
    ids: [
      'tt4574334', 'tt3032476', 'tt2442560', 'tt6468322', 'tt10919420', 'tt5753856',
      'tt2085059', 'tt1190634', 'tt7366338', 'tt1475582', 'tt0386676', 'tt11198330',
    ],
  },
]

// Caché en memoria para no gastar el límite diario de la API de OMDb
const CACHE_MS = 6 * 60 * 60 * 1000
const cache = new Map<string, { time: number; data: MovieDetail }>()

async function getMovies(ids: string[]): Promise<MovieDetail[]> {
  const responses = await Promise.allSettled(
    ids.map(async (id) => {
      const hit = cache.get(id)
      if (hit && Date.now() - hit.time < CACHE_MS) return hit.data

      const res = await axios.get(OMDB_URL, { params: { apikey: API_KEY, i: id, plot: 'short' } })
      if (res.data.Response !== 'True') throw new Error('not found')
      cache.set(id, { time: Date.now(), data: res.data })
      return res.data as MovieDetail
    })
  )

  const movies: MovieDetail[] = []
  for (const r of responses) {
    if (r.status === 'fulfilled') movies.push(r.value)
  }
  return movies
}

// Lee las imágenes de public/banners y busca la información de cada película
// usando el nombre del archivo (ej: Interstellar.jpg -> "Interstellar")
async function getBanners(): Promise<Slide[]> {
  const dir = path.join(process.cwd(), 'public', 'banners')

  let files: string[] = []
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort()
  } catch {
    return []
  }

  return Promise.all(
    files.map(async (file) => {
      const name = file
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim()

      let detail: MovieDetail | null = null
      try {
        const response = await axios.get(OMDB_URL, {
          params: { apikey: API_KEY, t: name, plot: 'short' }
        })
        if (response.data.Response === 'True') detail = response.data
      } catch {}

      return {
        src: `/banners/${encodeURIComponent(file)}`,
        title: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        detail,
      }
    })
  )
}

export default async function Home() {
  const [railMovies, slides] = await Promise.all([
    Promise.all(RAILS.map((r) => getMovies(r.ids))),
    getBanners(),
  ])

  // Pósters para el buscador (mosaico de fondo + sugeridas)
  const featured: MovieDetail[] = []
  const seen = new Set<string>()
  for (const list of railMovies) {
    for (const m of list.slice(0, 3)) {
      if (!seen.has(m.imdbID)) {
        seen.add(m.imdbID)
        featured.push(m)
      }
    }
  }

  return (
    <FavoritesProvider>
      <main className="relative min-h-screen text-white overflow-x-hidden">
        {/* Luces de fondo decorativas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[600px] h-[900px] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.12),transparent_60%)]"
        />

        <NavBar />
        <HeroBanner slides={slides} />

        <div className="relative max-w-6xl mx-auto px-4 pb-20">
          {/* 1) BUSCAR: arriba, montado sobre el banner */}
          <div className="-mt-8 relative z-10">
            <MovieSearch featured={featured} />
          </div>

          {/* 2) Mi lista */}
          <div className="pt-14">
            <MyList />
          </div>

          {/* 3) Carruseles */}
          {railMovies[0].length === 0 ? (
            <p className="mt-14 text-white bg-red-500/20 border border-red-400/50 rounded-xl p-4">
              No se pudieron cargar las películas. Revisa que tu apikey esté en .env.local y activada.
            </p>
          ) : (
            RAILS.map((rail, i) =>
              railMovies[i].length === 0 ? null : (
                <div key={rail.id} className="pt-14">
                  <MovieRail
                    id={rail.id}
                    title={rail.title}
                    subtitle={rail.subtitle}
                    movies={railMovies[i]}
                    showGenres={rail.genres}
                  />
                </div>
              )
            )
          )}
        </div>

        <footer className="border-t border-white/10 bg-black/30 py-10 text-center">
          <p className="text-lg font-black tracking-[0.25em] text-white">
            MOVIE<span className="text-red-500">FLIX</span>
          </p>
          <p className="mt-2 text-slate-500 text-sm">Datos proporcionados por OMDb</p>
        </footer>
      </main>
    </FavoritesProvider>
  )
}