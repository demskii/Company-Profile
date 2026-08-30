import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-metal-100">
      <nav className="container-page flex items-center justify-between h-16" aria-label="Navigasi utama">
        <a href="/" className="font-extrabold text-xl text-primary-600 tracking-tight">
          Alumindo<span className="text-accent-500">Jaya</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-metal-600 hover:text-primary-500'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <a href="/kontak" className="hidden md:inline-flex btn-primary !py-2 !px-4 text-sm">Minta Penawaran</a>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-metal-100"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Buka menu navigasi"
        >
          <span className="block w-6 h-0.5 bg-metal-800 mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-metal-800 mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-metal-800"></span>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-metal-100 bg-white">
          <ul className="container-page py-4 flex flex-col gap-3">
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} onClick={() => setOpen(false)} className="block py-2 text-metal-700 font-medium">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
