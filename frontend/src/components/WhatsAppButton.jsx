import { buildWaLink } from '../lib/whatsapp.js'

/**
 * Tombol WhatsApp mengambang, tampil di semua halaman publik.
 * `message` opsional -- override pesan default sesuai konteks halaman (mis. nama produk).
 */
export default function WhatsAppButton({ message }) {
  return (
    <a
      href={buildWaLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-xl shadow-black/20 px-4 py-3 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.593 4.376 1.63 6.212L3.2 28.8l6.77-1.598A12.74 12.74 0 0 0 16.004 28.8c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.8-12.8-12.8Zm0 23.253a10.39 10.39 0 0 1-5.31-1.454l-.38-.226-4.017.948.982-3.91-.248-.402a10.39 10.39 0 0 1-1.6-5.508c0-5.755 4.68-10.437 10.437-10.437 2.79 0 5.413 1.088 7.386 3.06a10.372 10.372 0 0 1 3.058 7.377c0 5.755-4.68 10.552-10.308 10.552Zm5.72-7.727c-.313-.157-1.85-.913-2.137-1.017-.287-.104-.496-.157-.705.157-.209.313-.809 1.017-.992 1.226-.183.209-.365.235-.678.078-.313-.157-1.322-.487-2.518-1.552-.93-.83-1.559-1.855-1.742-2.168-.183-.313-.02-.482.137-.639.14-.14.313-.365.47-.548.157-.183.209-.313.313-.522.104-.209.052-.391-.026-.548-.078-.157-.705-1.7-.966-2.328-.254-.61-.512-.527-.705-.537l-.6-.011c-.209 0-.548.078-.835.391s-1.096 1.07-1.096 2.611c0 1.54 1.122 3.028 1.279 3.237.157.209 2.208 3.372 5.35 4.728.747.323 1.33.516 1.784.66.749.238 1.43.204 1.969.124.6-.09 1.85-.756 2.111-1.487.261-.73.261-1.356.183-1.487-.078-.13-.287-.209-.6-.365Z" />
      </svg>
      <span className="hidden sm:inline text-sm font-semibold pr-1">Chat WhatsApp</span>
    </a>
  )
}
