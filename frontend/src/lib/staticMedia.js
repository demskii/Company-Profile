export const STATIC_MEDIA = [
  { key: 'media_home_hero', label: 'Hero Beranda', group: 'Beranda', description: 'Gambar besar pada bagian hero halaman beranda.', fallback: '/images/hero/hero-pabrik.jpg', aspect: 'hero' },
  { key: 'media_about_history', label: 'Foto Sejarah', group: 'Tentang Kami', description: 'Gambar pada bagian Sejarah.', fallback: '/images/about/sejarah.jpg', aspect: 'wide' },
  { key: 'media_team_1', label: 'Foto Tim 1', group: 'Tim Manajemen', description: 'Foto Budi Santoso — Direktur Utama.', fallback: '/images/about/team-1.jpg', aspect: 'square', person: 'Budi Santoso', role: 'Direktur Utama' },
  { key: 'media_team_2', label: 'Foto Tim 2', group: 'Tim Manajemen', description: 'Foto Sri Wahyuni — Kepala Produksi.', fallback: '/images/about/team-2.jpg', aspect: 'square', person: 'Sri Wahyuni', role: 'Kepala Produksi' },
  { key: 'media_team_3', label: 'Foto Tim 3', group: 'Tim Manajemen', description: 'Foto Agus Prasetyo — Kepala QC.', fallback: '/images/about/team-3.jpg', aspect: 'square', person: 'Agus Prasetyo', role: 'Kepala QC' },
  { key: 'media_service_konstruksi', label: 'Thumbnail Layanan — Konstruksi', group: 'Layanan & Produk', description: 'Thumbnail kartu Profil Alumunium Konstruksi.', fallback: '/images/services/konstruksi.jpg', aspect: 'card' },
  { key: 'media_service_otomotif', label: 'Thumbnail Layanan — Otomotif', group: 'Layanan & Produk', description: 'Thumbnail kartu Komponen Otomotif.', fallback: '/images/services/otomotif.jpg', aspect: 'card' },
  { key: 'media_service_industri', label: 'Thumbnail Layanan — Industri', group: 'Layanan & Produk', description: 'Thumbnail kartu Panel Alumunium Custom.', fallback: '/images/services/industri.jpg', aspect: 'card' },
  { key: 'media_service_retail', label: 'Thumbnail Layanan — Retail', group: 'Layanan & Produk', description: 'Thumbnail kartu Aksesoris Alumunium.', fallback: '/images/services/retail.jpg', aspect: 'card' },
  { key: 'media_portfolio_konstruksi', label: 'Thumbnail Portofolio — Konstruksi', group: 'Portofolio', description: 'Thumbnail kategori proyek Konstruksi.', fallback: '/images/portfolio/konstruksi.jpg', aspect: 'card' },
  { key: 'media_portfolio_otomotif', label: 'Thumbnail Portofolio — Otomotif', group: 'Portofolio', description: 'Thumbnail kategori proyek Otomotif.', fallback: '/images/portfolio/otomotif.jpg', aspect: 'card' },
  { key: 'media_portfolio_industri', label: 'Thumbnail Portofolio — Industri', group: 'Portofolio', description: 'Thumbnail kategori proyek Industri.', fallback: '/images/portfolio/industri.jpg', aspect: 'card' },
]

export function mediaImage(contents, key, fallback = '') {
  return contents?.find(item => item.section_key === key)?.image_url || fallback
}
