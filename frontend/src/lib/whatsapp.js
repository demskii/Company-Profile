// Ganti nomor ini dengan nomor WhatsApp bisnis Alumindo Jaya (format 62xxxxxxxxxx, tanpa "+")
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'

/**
 * Membuat link wa.me dengan pesan yang sudah diisi otomatis sesuai konteks halaman.
 * Contoh: buildWaLink('Saya tertarik dengan produk Profil Sliding Window')
 */
export function buildWaLink(message = 'Halo Alumindo Jaya, saya ingin bertanya mengenai produk alumunium.') {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}
