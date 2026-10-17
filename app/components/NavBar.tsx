'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#buscar', label: 'Buscar' },
  { href: '#cartelera', label: 'Cartelera' },
  { href: '#mi-lista', label: 'Mi lista' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nb ${scrolled ? 'nb--solid' : ''}`}>
        <a href="#" className="nb__logo">
          MOVIE<span>FLIX</span>
        </a>

        <div className="nb__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nb__link">
              {l.label}
            </a>
          ))}
        </div>

        <a href="#buscar" className="nb__search" aria-label="Buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span>Buscar películas</span>
        </a>
      </nav>

      <style jsx>{`
        .nb {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 16px 40px;
          background: linear-gradient(to bottom, rgba(5, 8, 20, 0.85), transparent);
          transition: background 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        }
        .nb--solid {
          background: rgba(8, 12, 28, 0.92);
          backdrop-filter: blur(12px);
          padding: 10px 40px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
        }
        .nb__logo {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #fff;
          text-decoration: none;
        }
        .nb__logo span {
          color: #e50914;
        }
        .nb__links {
          display: flex;
          gap: 6px;
          flex: 1;
        }
        .nb__link {
          color: #c7cde0;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 999px;
          transition: all 0.2s ease;
        }
        .nb__link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .nb__search {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #c7cde0;
          text-decoration: none;
          font-size: 13px;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: all 0.2s ease;
        }
        .nb__search:hover {
          color: #fff;
          background: rgba(33, 150, 243, 0.25);
          border-color: #2196f3;
        }
        @media (max-width: 700px) {
          .nb {
            padding: 12px 16px;
            gap: 12px;
          }
          .nb__links {
            display: none;
          }
          .nb__search {
            margin-left: auto;
          }
          .nb__search span {
            display: none;
          }
        }
      `}</style>
    </>
  )
}