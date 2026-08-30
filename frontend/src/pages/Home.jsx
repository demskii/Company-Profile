import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SmartImage from "../components/SmartImage.jsx";
import { publicContentApi, resolveImageUrl } from "../lib/api.js";
import { mediaImage } from "../lib/staticMedia.js";

const services = [
  {
    title: "Ekstrusi Alumunium",
    desc: "Produksi profil alumunium custom sesuai spesifikasi proyek.",
  },
  {
    title: "Fabrikasi & Cutting",
    desc: "Pemotongan presisi dan perakitan komponen alumunium.",
  },
  {
    title: "Finishing & Anodizing",
    desc: "Pelapisan permukaan tahan korosi dengan berbagai pilihan warna.",
  },
  {
    title: "Konsultasi Desain",
    desc: "Pendampingan teknis dari desain hingga produksi massal.",
  },
];

export default function Home() {
  const [contents, setContents] = useState([]);
  useEffect(() => {
    publicContentApi
      .list()
      .then(setContents)
      .catch(() => {});
  }, []);
  const heroImage = mediaImage(
    contents,
    "media_home_hero",
    "/images/hero/hero-pabrik.jpg"
  );
  return (
    <>
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-metal-50 overflow-hidden">
        <div className="container-page py-20 md:py-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-accent-500/10 text-accent-600 font-semibold text-sm px-3 py-1 rounded-full mb-4">
              Manufaktur Alumunium Terpercaya
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-metal-800 leading-tight mb-6">
              Solusi Alumunium Presisi untuk Industri Anda
            </h1>
            <p className="text-metal-600 text-lg mb-8">
              Alumindo Jaya memproduksi dan memfabrikasi komponen alumunium
              berkualitas tinggi untuk kebutuhan konstruksi, otomotif, dan
              manufaktur skala besar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/kontak" className="btn-primary">
                Minta Penawaran
              </Link>
              <Link to="/layanan" className="btn-outline">
                Lihat Layanan
              </Link>
            </div>
          </div>
          <SmartImage
            src={resolveImageUrl(heroImage)}
            alt="Pabrik dan produk Alumindo Jaya"
            className="rounded-2xl h-64 md:h-96 shadow-2xl"
          />
        </div>
      </section>

      <section className="section container-page">
        <h2 className="section-title">Layanan Unggulan Kami</h2>
        <p className="section-subtitle">
          Rangkaian layanan manufaktur alumunium dari produksi hingga finishing.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="p-6 rounded-2xl border border-metal-100 hover:shadow-xl hover:-translate-y-1 transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold mb-4">
                EX
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-metal-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-600 text-white">
        <div className="container-page py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-primary-50 mb-8 max-w-xl mx-auto">
            Tim kami siap membantu merancang solusi alumunium sesuai kebutuhan
            spesifik industri Anda.
          </p>
          <Link to="/kontak" className="btn-primary !bg-accent-500">
            Hubungi Tim Kami
          </Link>
        </div>
      </section>
    </>
  );
}
