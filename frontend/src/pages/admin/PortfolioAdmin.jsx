import { useEffect, useMemo, useState } from 'react'
import { adminCatalogApi, resolveImageUrl } from '../../lib/api.js'
import ImageUploader from '../../components/admin/ImageUploader.jsx'

const CATEGORY_OPTIONS = ['Konstruksi', 'Otomotif', 'Industri']
const emptyForm = { id: null, category: 'Konstruksi', title: '', description: '', image_url: '' }

export default function PortfolioAdmin() {
  const [items, setItems] = useState([])
  const [filterCategory, setFilterCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const loadItems = () => {
    setLoading(true)
    setError('')
    adminCatalogApi.portfolio.list().then(setItems).catch(err => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(loadItems, [])

  const visibleItems = useMemo(() => filterCategory === 'Semua' ? items : items.filter(item => item.category === filterCategory), [items, filterCategory])

  const resetForm = () => {
    setForm({ ...emptyForm, category: filterCategory === 'Semua' ? 'Konstruksi' : filterCategory })
    setFormError('')
  }

  const handleEdit = (item) => {
    setForm({ id: item.id, category: item.category || 'Konstruksi', title: item.title, description: item.description || '', image_url: item.image_url || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus proyek ini?')) return
    try { await adminCatalogApi.portfolio.remove(id); loadItems() } catch (err) { alert(err.message) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { category: form.category, title: form.title, description: form.description, image_url: form.image_url || undefined }
      if (form.id) await adminCatalogApi.portfolio.update(form.id, payload)
      else await adminCatalogApi.portfolio.create(payload)
      setFilterCategory(form.category)
      setForm({ ...emptyForm, category: form.category })
      loadItems()
    } catch (err) {
      setFormError(err.details?.map(d => d.msg).join(', ') || err.message)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Portofolio</h1>
          <p className="text-metal-500 max-w-3xl">Tambah dan kelola proyek. Pilih kategori untuk langsung menyaring proyek yang ingin dikelola.</p>
        </div>
        <div className="bg-white border border-metal-100 rounded-xl px-4 py-3 text-sm text-metal-600"><span className="font-bold text-metal-800">{visibleItems.length}</span> proyek ditampilkan</div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-metal-100 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div><h2 className="font-bold text-lg">{form.id ? 'Edit Proyek' : 'Tambah Proyek'}</h2><p className="text-xs text-metal-400 mt-1">Form horizontal untuk input proyek yang lebih cepat.</p></div>
          {form.id && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700">Mode Edit</span>}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 items-start">
          <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-metal-200 px-4 py-2.5">{CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Judul Proyek</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required minLength={2} maxLength={150} className="w-full rounded-xl border border-metal-200 px-4 py-2.5" placeholder="Nama proyek" /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi / Hasil Proyek</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              maxLength={5000}
              rows={2}
              className="w-full min-h-14 max-h-56 resize-y rounded-xl border border-metal-200 px-4 py-2.5 leading-6 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Ringkasan hasil proyek. Tinggi kotak dapat diubah dengan menarik sudut kanan bawah."
            />
          </div>
        </div>
        <div className="mt-4 max-w-md"><ImageUploader value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} label="Gambar proyek" /></div>

        {formError && <p className="text-sm text-red-600 mt-4">{formError}</p>}
        <div className="flex flex-wrap justify-end gap-3 mt-5 pt-5 border-t border-metal-100">{form.id && <button type="button" onClick={resetForm} className="btn-outline !py-2.5">Batal</button>}<button type="submit" disabled={saving} className="btn-primary !py-2.5 min-w-36 justify-center">{saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Tambah Proyek'}</button></div>
      </form>

      <div className="bg-white rounded-2xl border border-metal-100 p-4 mb-5">
        <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-metal-700 mr-2">Filter kategori:</span>{['Semua', ...CATEGORY_OPTIONS].map(category => <button key={category} type="button" onClick={() => { setFilterCategory(category); if (!form.id && category !== 'Semua') setForm(v => ({ ...v, category })) }} className={`px-3.5 py-2 rounded-full text-sm font-semibold border ${filterCategory === category ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-metal-600 border-metal-200 hover:border-primary-300'}`}>{category}</button>)}</div>
      </div>

      {loading && <p className="text-metal-500">Memuat...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-metal-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-sm"><thead className="bg-metal-50 border-b border-metal-100"><tr><th className="text-left px-5 py-3 font-semibold">Proyek</th><th className="text-left px-5 py-3 font-semibold">Kategori</th><th className="text-left px-5 py-3 font-semibold w-[42%]">Deskripsi</th><th className="text-right px-5 py-3 font-semibold">Aksi</th></tr></thead><tbody className="divide-y divide-metal-100">
          {visibleItems.length === 0 && <tr><td colSpan="4" className="px-5 py-10 text-center text-metal-500">Belum ada proyek pada kategori ini.</td></tr>}
          {visibleItems.map(p => <tr key={p.id} className="hover:bg-metal-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-14 h-12 rounded-lg overflow-hidden bg-metal-100 shrink-0">{p.image_url && <img src={resolveImageUrl(p.image_url)} alt={p.title} className="w-full h-full object-cover" />}</div><span className="font-semibold">{p.title}</span></div></td><td className="px-5 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">{p.category}</span></td><td className="px-5 py-4 text-metal-500 w-[42%]"><div className="line-clamp-2 break-words">{p.description || '—'}</div></td><td className="px-5 py-4"><div className="flex justify-end gap-3"><button onClick={() => handleEdit(p)} className="text-sm font-semibold text-primary-600 hover:underline">Edit</button><button onClick={() => handleDelete(p.id)} className="text-sm font-semibold text-red-600 hover:underline">Hapus</button></div></td></tr>)}
        </tbody></table></div></div>
      )}
    </div>
  )
}
