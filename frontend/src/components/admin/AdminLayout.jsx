import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/admin', label: 'Ringkasan', end: true },
  { to: '/admin/pesan', label: 'Pesan Masuk' },
  { to: '/admin/produk', label: 'Produk' },
  { to: '/admin/portofolio', label: 'Portofolio' },
  { to: '/admin/media', label: 'Media Statis' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-metal-50 flex">
      <aside className="w-64 bg-metal-800 text-metal-100 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 font-extrabold text-lg text-white border-b border-metal-600">
          Alumindo<span className="text-accent-500">Admin</span>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-metal-300 hover:bg-metal-600/50 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-metal-600">
          <button
            onClick={handleLogout}
            className="w-full text-sm font-semibold text-metal-200 hover:text-white border border-metal-600 hover:border-metal-400 rounded-lg py-2 transition-colors"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-metal-100 flex items-center justify-between px-6">
          <p className="text-sm text-metal-500">Dashboard Admin</p>
          <a href="/" className="text-sm font-medium text-primary-600 hover:underline">Lihat Website →</a>
        </header>
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
