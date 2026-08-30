import { useState } from 'react'

/**
 * Komponen gambar dengan fallback otomatis.
 * Jika `src` kosong atau gagal dimuat (404, dll), akan menampilkan
 * placeholder gradien alih-alih ikon gambar rusak -- jadi aman dipakai
 * meski gambar belum diunggah/diganti oleh admin.
 *
 * Contoh pemakaian:
 *   <SmartImage src="/images/hero/hero-pabrik.jpg" alt="Pabrik Alumindo Jaya" className="h-96 rounded-2xl" />
 */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = !src || failed

  if (showPlaceholder) {
    return (
      <div
        className={`bg-gradient-to-br from-metal-100 to-metal-300 flex items-center justify-center text-metal-500 text-xs font-medium text-center px-3 ${className}`}
        role="img"
        aria-label={alt || 'Gambar belum tersedia'}
      >
        {alt || 'Gambar belum tersedia'}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
