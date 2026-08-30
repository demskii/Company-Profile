import { useEffect, useState } from "react";
import SmartImage from "../components/SmartImage.jsx";
import { publicContentApi, resolveImageUrl } from "../lib/api.js";
import { mediaImage } from "../lib/staticMedia.js";

export default function About() {
  const [contents, setContents] = useState([]);
  useEffect(() => {
    publicContentApi
      .list()
      .then(setContents)
      .catch(() => {});
  }, []);

  const team = [
    {
      name: "Budi Santoso",
      role: "Direktur Utama",
      photo: resolveImageUrl(
        mediaImage(contents, "media_team_1", "/images/about/team-1.jpg")
      ),
    },
    {
      name: "Sri Wahyuni",
      role: "Kepala Produksi",
      photo: resolveImageUrl(
        mediaImage(contents, "media_team_2", "/images/about/team-2.jpg")
      ),
    },
    {
      name: "Agus Prasetyo",
      role: "Kepala QC",
      photo: resolveImageUrl(
        mediaImage(contents, "media_team_3", "/images/about/team-3.jpg")
      ),
    },
  ];
  return (
    <div className="container-page section">
      <h1 className="section-title">Tentang Kami</h1>
      <p className="section-subtitle">
        Perjalanan Alumindo Jaya membangun kepercayaan di industri manufaktur
        alumunium.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="font-bold text-xl mb-3">Sejarah</h2>
          <SmartImage
            src={resolveImageUrl(
              mediaImage(
                contents,
                "media_about_history",
                "/images/about/sejarah.jpg"
              )
            )}
            alt="Sejarah Alumindo Jaya"
            className="h-48 rounded-2xl mb-4"
          />
          <p className="text-metal-600 leading-relaxed">
            Berdiri sejak 2005, Alumindo Jaya bermula dari bengkel fabrikasi
            kecil dan tumbuh menjadi produsen alumunium dengan kapasitas
            produksi ribuan ton per tahun, melayani klien di sektor konstruksi,
            otomotif, dan elektronik.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-xl mb-3">Visi & Misi</h2>
          <p className="text-metal-600 leading-relaxed">
            <strong>Visi:</strong> Menjadi produsen alumunium terdepan di Asia
            Tenggara.
            <br />
            <strong>Misi:</strong> Menghadirkan produk berkualitas tinggi, ramah
            lingkungan, dan inovatif melalui proses produksi yang efisien dan
            tim yang kompeten.
          </p>
        </div>
      </div>

      <h2 className="font-bold text-xl mb-6">Tim Manajemen</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {team.map((t) => (
          <div
            key={t.name}
            className="text-center p-6 rounded-2xl border border-metal-100"
          >
            <SmartImage
              src={t.photo}
              alt={t.name}
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-metal-500">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
