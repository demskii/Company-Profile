import { useEffect, useState } from 'react'
import { adminMessagesApi } from '../../lib/api.js'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminMessagesApi.list()
      .then(setMessages)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Pesan Masuk</h1>
      <p className="text-metal-500 mb-8">Pesan yang dikirim pengunjung lewat form Kontak.</p>

      {loading && <p className="text-metal-500">Memuat...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-metal-100 overflow-hidden">
          {messages.length === 0 ? (
            <p className="p-8 text-metal-500 text-center">Belum ada pesan masuk.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-metal-50 text-left text-metal-500">
                <tr>
                  <th className="p-4 font-semibold">Nama</th>
                  <th className="p-4 font-semibold">Kontak</th>
                  <th className="p-4 font-semibold">Pesan</th>
                  <th className="p-4 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id} className="border-t border-metal-100 align-top">
                    <td className="p-4 font-medium">{m.name}</td>
                    <td className="p-4 text-metal-600">
                      <div>{m.email}</div>
                      {m.phone && <div className="text-metal-400">{m.phone}</div>}
                    </td>
                    <td className="p-4 text-metal-600 max-w-md">{m.message}</td>
                    <td className="p-4 text-metal-400 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
