import { useEffect, useState } from "react";
import { catalogApi, resolveImageUrl } from "../lib/api.js";
import { buildWaLink } from "../lib/whatsapp.js";
import SmartImage from "../components/SmartImage.jsx";
import { publicContentApi } from "../lib/api.js";
import { mediaImage } from "../lib/staticMedia.js";

const serviceCategories = [
  {
    name: "Profil Alumunium Konstruksi",
    category: "Konstruksi",
    desc: "Lihat pilihan produk profil konstruksi yang tersedia.",
    image: "/images/services/konstruksi.jpg",
  },
  {
    name: "Komponen Otomotif",
    category: "Otomotif",
    desc: "Lihat komponen dan rangka otomotif yang tersedia.",
    image: "/images/services/otomotif.jpg",
  },
  {
    name: "Panel Alumunium Custom",
    category: "Industri",
    desc: "Lihat pilihan panel custom untuk kebutuhan industri.",
    image: "/images/services/industri.jpg",
  },
  {
    name: "Aksesoris Alumunium",
    category: "Retail",
    desc: "Lihat aksesoris pendukung berbahan alumunium.",
    image: "/images/services/retail.jpg",
  },
];

export default function Services() {
  const [contents, setContents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    publicContentApi
      .list()
      .then(setContents)
      .catch(() => {});
  }, []);

  const categoriesWithMedia = serviceCategories.map((service) => ({
    ...service,
    image: resolveImageUrl(
      mediaImage(
        contents,
        `media_service_${service.category.toLowerCase()}`,
        service.image
      )
    ),
  }));

  useEffect(() => {
    if (!selectedCategory) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    catalogApi
      .products(selectedCategory.category)
      .then((data) => {
        if (!cancelled) setProducts(data);
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
  }, [selectedCategory]);

  useEffect(() => {
    document.body.style.overflow =
      selectedCategory || selectedProduct ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCategory, selectedProduct]);

  const closeCategory = () => {
    setSelectedProduct(null);
    setSelectedCategory(null);
    setProducts([]);
    setError("");
  };

  return (
    <div className="container-page section">
      <h1 className="section-title">Layanan & Produk</h1>
      <p className="section-subtitle">
        Pilih layanan untuk membuka layer katalog produk.
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        {categoriesWithMedia.map((service) => (
          <button
            type="button"
            key={service.name}
            onClick={() => {
              setSelectedProduct(null);
              setSelectedCategory(service);
            }}
            className="text-left rounded-2xl border border-metal-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 bg-white"
          >
            <SmartImage
              src={service.image}
              alt={service.name}
              className="h-40"
            />
            <div className="p-6">
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">
                {service.category}
              </span>
              <h3 className="font-bold text-lg mt-1 mb-2">{service.name}</h3>
              <p className="text-sm text-metal-600">{service.desc}</p>
              <span className="inline-flex mt-4 text-sm font-semibold text-primary-600">
                Buka katalog →
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-layer-title"
          onClick={closeCategory}
        >
          <div
            className="h-full w-full bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-metal-100">
              <div className="container-page py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-accent-600 uppercase tracking-wide">
                    Katalog {selectedCategory.category}
                  </p>
                  <h2
                    id="service-layer-title"
                    className="text-xl md:text-2xl font-extrabold"
                  >
                    {selectedCategory.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCategory}
                  className="h-10 w-10 rounded-full border border-metal-200 text-metal-600 hover:bg-metal-50 text-xl"
                  aria-label="Tutup katalog"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="container-page py-8 md:py-12">
              {loading && <p className="text-metal-500">Memuat produk...</p>}
              {error && <p className="text-red-600">{error}</p>}
              {!loading && !error && products.length === 0 && (
                <div className="rounded-2xl border border-dashed border-metal-200 p-8 text-metal-500">
                  Belum ada produk untuk kategori ini.
                </div>
              )}
              {!loading && !error && products.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="text-left rounded-2xl overflow-hidden border border-metal-100 hover:shadow-xl transition-shadow bg-white h-full flex flex-col"
                    >
                      <SmartImage
                        src={resolveImageUrl(product.image_url)}
                        alt={product.name}
                        className="h-44 shrink-0"
                      />
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold min-h-[3rem]">
                          {product.name}
                        </h3>
                        <p className="text-sm text-metal-600 mt-2 line-clamp-3 min-h-[4.5rem]">
                          {product.description ||
                            "Detail produk tersedia melalui tim kami."}
                        </p>
                        <span className="inline-flex mt-auto pt-4 text-sm font-semibold text-primary-600">
                          Lihat detail →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedProduct && (
            <div
              className="absolute inset-0 z-20 bg-black/60 p-4 flex items-center justify-center"
              onClick={() => setSelectedProduct(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-extrabold mt-1">
                      {selectedProduct.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="text-metal-500 hover:text-metal-800 text-xl"
                    aria-label="Tutup detail"
                  >
                    ✕
                  </button>
                </div>
                <SmartImage
                  src={resolveImageUrl(selectedProduct.image_url)}
                  alt={selectedProduct.name}
                  className="h-52 rounded-xl mt-6"
                />
                <p className="text-metal-600 mt-6">
                  {selectedProduct.description || "Belum ada deskripsi produk."}
                </p>
                <a
                  href={buildWaLink(
                    `Halo Alumindo Jaya, saya ingin bertanya mengenai produk "${selectedProduct.name}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !bg-[#25D366] hover:!bg-[#1ebe57] mt-6 w-full justify-center"
                >
                  Tanya Produk Ini via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
