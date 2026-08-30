import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminCatalogApi, adminMessagesApi } from '../../lib/api.js'

export default function DashboardHome() {
  const [stats, setStats] = useState({ products: 0, portfolio: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminCatalogApi.products.list(),
      adminCatalogApi.portfolio.list(),
      adminMessagesApi.list(),
    ])
      .then(([products, portfolio, messages]) => {
        setStats({ products: products.length, portfolio: portfolio.length, messages: messages.length })
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Produk', value: stats.products, to: '/admin/produk' },
    { label: 'Proyek Portofolio', value: stats.portfolio, to: '/admin/portofolio' },
    { label: 'Pesan Masuk', value: stats.messages, to: '/admin/pesan' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Ringkasan</h1>
      <p className="text-metal-500 mb-8">Selamat datang kembali. Berikut ringkasan data website Anda.</p>

      <div className="grid sm:grid-cols-3 gap-6">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="bg-white rounded-2xl border border-metal-100 p-6 hover:shadow-lg transition-shadow">
            <p className="text-sm text-metal-500 mb-2">{c.label}</p>
            <p className="text-3xl font-extrabold text-primary-600">{loading ? '...' : c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
