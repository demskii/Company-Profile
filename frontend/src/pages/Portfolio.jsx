import { useEffect, useState } from "react";
import { catalogApi, resolveImageUrl } from "../lib/api.js";
import { buildWaLink } from "../lib/whatsapp.js";
import SmartImage from "../components/SmartImage.jsx";
import { publicContentApi } from "../lib/api.js";
import { mediaImage } from "../lib/staticMedia.js";

const categories = [
  { name: "Konstruksi", image: "/images/portfolio/konstruksi.jpg" },
  { name: "Otomotif", image: "/images/portfolio/otomotif.jpg" },
  { name: "Industri", image: "/images/portfolio/industri.jpg" },
];

export default function Portfolio() {
  const [contents, setContents] = useState([]);
  const [category, setCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    publicContentApi
      .list()
      .then(setContents)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!category) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    catalogApi
      .portfolio(category)
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    document.body.style.overflow = category || selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [category, selectedProject]);

  const closeLayer = () => {
    setSelectedProject(null);
    setCategory(null);
    setProjects([]);
    setError("");
  };

  return (
    <div className="container-page section">
      <h1 className="section-title">Portofolio</h1>
      <p className="section-subtitle">
        Pilih bidang proyek untuk membuka layer hasil pekerjaan.
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => {
              setSelectedProject(null);
              setCategory(c.name);
            }}
            className="text-left rounded-2xl border border-metal-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 bg-white"
          >
            <SmartImage
              src={resolveImageUrl(
                mediaImage(
                  contents,
                  `media_portfolio_${c.name.toLowerCase()}`,
                  c.image
                )
              )}
              alt={c.name}
              className="h-44"
            />
            <div className="p-6">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                Bidang Proyek
              </span>
              <h3 className="font-bold text-xl mt-1">{c.name}</h3>
              <p className="text-sm text-metal-600 mt-2">
                Lihat proyek yang telah dikerjakan pada bidang{" "}
                {c.name.toLowerCase()}.
              </p>
              <span className="inline-flex mt-4 text-sm font-semibold text-primary-600">
                Buka portofolio →
              </span>
            </div>
          </button>
        ))}
      </div>

      {category && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-layer-title"
          onClick={closeLayer}
        >
          <div
            className="h-full w-full bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-metal-100">
              <div className="container-page py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    Portofolio
                  </p>
                  <h2
                    id="portfolio-layer-title"
                    className="text-xl md:text-2xl font-extrabold"
                  >
                    Proyek {category}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeLayer}
                  className="h-10 w-10 rounded-full border border-metal-200 text-metal-600 hover:bg-metal-50 text-xl"
                  aria-label="Tutup portofolio"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="container-page py-8 md:py-12">
              {loading && (
                <p className="text-metal-500">
                  Memuat proyek {category.toLowerCase()}...
                </p>
              )}
              {error && <p className="text-red-600">{error}</p>}
              {!loading && !error && projects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-metal-200 p-8 text-metal-500">
                  Belum ada proyek untuk kategori ini.
                </div>
              )}
              {!loading && !error && projects.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <button
                      type="button"
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="text-left rounded-2xl overflow-hidden border border-metal-100 hover:shadow-xl transition-shadow bg-white h-full flex flex-col"
                    >
                      <SmartImage
                        src={resolveImageUrl(project.image_url)}
                        alt={project.title}
                        className="h-44 shrink-0"
                      />
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-xs font-semibold text-primary-600">
                          {project.category}
                        </span>
                        <h3 className="font-bold mt-1 min-h-[3rem]">
                          {project.title}
                        </h3>
                        <p className="text-sm text-metal-600 mt-2 line-clamp-3 min-h-[4.5rem]">
                          {project.description ||
                            "Klik untuk melihat detail proyek."}
                        </p>
                        <span className="inline-flex mt-auto pt-4 text-sm font-semibold text-primary-600">
                          Lihat hasil proyek →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedProject && (
            <div
              className="absolute inset-0 z-20 bg-black/60 p-4 flex items-center justify-center"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-2xl font-extrabold mt-1">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="text-metal-500 hover:text-metal-800 text-xl"
                    aria-label="Tutup detail"
                  >
                    ✕
                  </button>
                </div>
                <SmartImage
                  src={resolveImageUrl(selectedProject.image_url)}
                  alt={selectedProject.title}
                  className="h-56 rounded-xl mt-6"
                />
                <p className="text-metal-600 mt-6">
                  {selectedProject.description || "Belum ada deskripsi proyek."}
                </p>
                <a
                  href={buildWaLink(
                    `Halo Alumindo Jaya, saya tertarik dengan proyek "${selectedProject.title}" dan ingin diskusi kebutuhan serupa.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !bg-[#25D366] hover:!bg-[#1ebe57] mt-6 w-full justify-center"
                >
                  Diskusikan Proyek Serupa via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
