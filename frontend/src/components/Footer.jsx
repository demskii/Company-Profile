import { buildWaLink } from '../lib/whatsapp.js'

export default function Footer() {
  return (
    <footer className="bg-metal-800 text-metal-100">
      <div className="container-page py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Alumindo Jaya</h3>
          <p className="text-sm text-metal-300">Manufaktur & fabrikasi produk alumunium berkualitas tinggi sejak 2005.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Tautan</h4>
          <ul className="space-y-2 text-sm text-metal-300">
            <li><a href="/tentang-kami" className="hover:text-white">Tentang Kami</a></li>
            <li><a href="/layanan" className="hover:text-white">Layanan</a></li>
            <li><a href="/portofolio" className="hover:text-white">Portofolio</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm text-metal-300">
            <li>Kawasan Industri, Cikarang, Jawa Barat</li>
            <li>+62 21 0000 0000</li>
            <li>info@alumindojaya.co.id</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Media Sosial</h4>
          <div className="flex gap-3 text-sm">
            <a href="#" className="hover:text-accent-500" aria-label="Instagram">Instagram</a>
            <a href="#" className="hover:text-accent-500" aria-label="LinkedIn">LinkedIn</a>
            <a href={buildWaLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent-500" aria-label="WhatsApp">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="border-t border-metal-600 text-center text-xs text-metal-400 py-4">
        © {new Date().getFullYear()} Alumindo Jaya. Semua hak dilindungi.
      </div>
    </footer>
  )
}
