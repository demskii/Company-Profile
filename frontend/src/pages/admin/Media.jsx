import { useEffect, useMemo, useState } from 'react'
import { adminContentApi, publicContentApi, resolveImageUrl } from '../../lib/api.js'
import ImageUploader from '../../components/admin/ImageUploader.jsx'
import { STATIC_MEDIA } from '../../lib/staticMedia.js'

export default function Media() {
  const [contents, setContents] = useState([])
  const [activeGroup, setActiveGroup] = useState('Semua')
  const [savingKey, setSavingKey] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const groups = useMemo(() => ['Semua', ...new Set(STATIC_MEDIA.map(item => item.group))], [])
  const visibleMedia = useMemo(
    () => activeGroup === 'Semua' ? STATIC_MEDIA : STATIC_MEDIA.filter(item => item.group === activeGroup),
    [activeGroup]
  )

  const load = () => {
    setError('')
    publicContentApi.list().then(setContents).catch(err => setError(err.message))
  }

  useEffect(load, [])

  const currentValue = (key) => contents.find(item => item.section_key === key)?.image_url || ''

  const save = async (item, image_url) => {
    setSavingKey(item.key)
    setMessage('')
    setError('')
    try {
      await adminContentApi.update({
        section_key: item.key,
        title: item.label,
        body: item.description,
        image_url: image_url || '',
      })
      setMessage(`${item.label} berhasil disimpan.`)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingKey('')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Media Statis</h1>
          <p className="text-metal-500 max-w-3xl">
            Kelola hero, foto tim, thumbnail kategori layanan, dan thumbnail portofolio dari satu tempat.
            Tidak perlu mengganti file atau menyentuh kode website.
          </p>
        </div>
        <div className="text-xs text-metal-500 bg-white border border-metal-100 rounded-xl px-4 py-3">
          {visibleMedia.length} aset ditampilkan
        </div>
      </div>

      {message && <div className="mb-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 px-4 py-3 text-sm">{message}</div>}
      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">{error}</div>}

      <div className="flex flex-wrap gap-2 mb-6">
        {groups.map(group => (
          <button
            type="button"
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeGroup === group
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-metal-600 border-metal-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {visibleMedia.map(item => {
          const stored = currentValue(item.key)
          const preview = stored || item.fallback
          return (
            <div key={item.key} className="bg-white rounded-2xl border border-metal-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent-600">{item.group}</span>
                  <h2 className="font-bold text-lg mt-1">{item.label}</h2>
                  <p className="text-sm text-metal-500 mt-1">{item.description}</p>
                </div>
                {stored && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">Sudah dikustom</span>}
              </div>

              <div className="rounded-2xl overflow-hidden bg-metal-100 mb-4 h-52">
                <img src={resolveImageUrl(preview)} alt={item.label} className="w-full h-full object-cover" />
              </div>

              <ImageUploader
                label="Ganti gambar"
                value={stored}
                onChange={(url) => save(item, url)}
              />

              {savingKey === item.key && <p className="text-xs text-primary-600 mt-2">Menyimpan perubahan...</p>}
              <p className="text-[11px] text-metal-400 mt-3">Fallback file: {item.fallback}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
