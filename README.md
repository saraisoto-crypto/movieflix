# 🎬 MovieFlix

Galería de películas y series construida con **Next.js**, que combina renderizado en servidor (SSR) y en cliente (CSR) usando la API de [OMDb](https://www.omdbapi.com).

Laboratorio 09 (GLAB-S09) · Desarrollo de Aplicaciones Web Avanzado · Tecsup

🔗 **Demo en vivo:** https://movieflix-six-puce.vercel.app

---

## ✨ Funcionalidades

- **Banner destacado** con carrusel automático y datos de la película.
- **Buscador en tiempo real** de películas y series, con filtro por tipo y botón "Cargar más".
- **Carruseles por categoría:** cartelera, mejor valoradas, acción, ciencia ficción, animación, terror y series.
- **Modal de detalles** con póster, sinopsis, reparto, director, premios y rating.
- **Mi lista:** favoritas guardadas en el navegador (`localStorage`).
- Diseño oscuro y responsive con Tailwind CSS.

## 🧠 CSR vs SSR: justificación

| Parte de la app | Estrategia | ¿Por qué? |
| --- | --- | --- |
| Películas populares y banners | **SSR** | Los datos se piden en el servidor, la página llega lista y la apikey no se repite en cada visita. |
| Buscador | **CSR** | Necesita responder al instante mientras el usuario escribe, sin recargar la página. |
| Modal, favoritos y carruseles | **CSR** | Dependen de la interacción del usuario (`useState`, `useEffect`). |

## 🛠️ Tecnologías

- Next.js (App Router) + React
- TypeScript
- Tailwind CSS
- Axios
- API de OMDb
- Despliegue en Vercel

## 📁 Estructura

```
app/
├── components/
│   ├── FavoritesContext.tsx   # Favoritos con Context + localStorage
│   ├── HeroBanner.tsx         # Banner destacado
│   ├── MovieModal.tsx         # Ventana de detalles
│   ├── MovieRail.tsx          # Carrusel de películas
│   ├── MovieSearch.tsx        # Buscador (CSR)
│   ├── MyList.tsx             # Sección "Mi lista"
│   └── NavBar.tsx             # Barra de navegación
├── lib/omdb.ts                # Tipos y constantes de la API
├── pokemon-csr/page.tsx       # Ejercicio 1.1: renderizado en cliente
├── pokemon-ssr/page.tsx       # Ejercicio 1.1: renderizado en servidor
├── weather/                   # Ejercicio 2.1: dashboard híbrido
└── page.tsx                   # Página principal (SSR)
public/banners/                # Imágenes del banner
```

## 🚀 Cómo ejecutarlo en local

1. Clona el repositorio:

```bash
   git clone https://github.com/saraisoto-crypto/movieflix.git
   cd movieflix
```

2. Instala las dependencias:

```bash
   npm install
```

3. Consigue una apikey gratuita en https://www.omdbapi.com/apikey.aspx y crea un archivo `.env.local` en la raíz:

```env
   NEXT_PUBLIC_OMDB_API_KEY=tu_apikey
```

4. Inicia el servidor de desarrollo:

```bash
   npm run dev
```

5. Abre http://localhost:3000

## 🌐 Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Galería de películas y series |
| `/pokemon-csr` | Ejemplo de renderizado en cliente |
| `/pokemon-ssr` | Ejemplo de renderizado en servidor |
| `/weather` | Dashboard del clima (SSR + CSR) |

## 👩‍💻 Autora

**saraisoto-crypto** · Tecsup
Docente: Edwin William Arévalo Sermeño

Datos proporcionados por [OMDb API](https://www.omdbapi.com).
