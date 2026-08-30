import { useRef, useState } from 'react'
import { uploadApi, resolveImageUrl } from '../../lib/api.js'

/**
 * Widget upload gambar untuk form admin.
 * `value` = image_url yang tersimpan (relatif atau absolut).
 * `onChange(newImageUrl)` dipanggil setelah upload sukses.
 */
export default function ImageUploader({ value, onChange, label = 'Gambar' }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const result = await uploadApi.upload(file)
      onChange(result.url)
    } catch (err) {
      setError(err.message || 'Gagal mengunggah gambar.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-xl overflow-hidden bg-metal-100 flex items-center justify-center shrink-0 border border-metal-200">
          {value ? (
            <img src={resolveImageUrl(value)} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-metal-400 text-center px-2">Belum ada gambar</span>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-metal-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-500/10 file:text-primary-600 file:font-semibold hover:file:bg-primary-500/20"
          />
          <p className="text-xs text-metal-400 mt-1">JPG, PNG, WEBP, atau GIF. Maksimal 5MB.</p>
          {uploading && <p className="text-xs text-primary-600 mt-1">Mengunggah...</p>}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-red-600 hover:underline mt-1"
            >
              Hapus gambar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
