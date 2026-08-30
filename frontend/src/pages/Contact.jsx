import { useState } from "react";
import { buildWaLink } from "../lib/whatsapp.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim pesan");
      setStatus({
        state: "success",
        msg: "Pesan berhasil dikirim. Tim kami akan segera menghubungi Anda.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    }
  };

  return (
    <div className="container-page section">
      <h1 className="section-title">Hubungi Kami</h1>
      <p className="section-subtitle">
        Kirimkan kebutuhan proyek Anda, tim kami akan merespons dalam 1x24 jam
        kerja.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-metal-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300/40"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              maxLength={150}
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-metal-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300/40"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              No. Telepon
            </label>
            <input
              id="phone"
              name="phone"
              maxLength={20}
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-metal-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300/40"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-metal-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300/40"
            />
          </div>

          <button
            type="submit"
            disabled={status.state === "loading"}
            className="btn-primary w-full justify-center"
          >
            {status.state === "loading" ? "Mengirim..." : "Kirim Pesan"}
          </button>

          {status.state === "success" && (
            <p role="status" className="text-green-600 text-sm">
              {status.msg}
            </p>
          )}
          {status.state === "error" && (
            <p role="alert" className="text-red-600 text-sm">
              {status.msg}
            </p>
          )}
        </form>

        <div className="space-y-6">
          <a
            href={buildWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-metal-100 p-5 hover:shadow-lg transition-shadow bg-[#25D366]/5"
          >
            <span className="h-11 w-11 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-lg">
              W
            </span>
            <span>
              <span className="block font-semibold">
                Lebih cepat lewat WhatsApp
              </span>
              <span className="block text-sm text-metal-600">
                Chat langsung dengan tim kami tanpa menunggu balasan email
              </span>
            </span>
          </a>

          <div className="rounded-2xl overflow-hidden border border-metal-100 h-64">
            <iframe
              title="Lokasi Pabrik Alumindo Jaya"
              className="w-full h-full"
              loading="lazy"
              src="https://www.google.com/maps?q=Cikarang,Jawa%20Barat&output=embed"
            />
          </div>
          <div className="text-sm text-metal-600 space-y-2">
            <p>
              <strong>Alamat:</strong> Kawasan Industri, Cikarang, Jawa Barat
            </p>
            <p>
              <strong>Telepon:</strong> +62 21 0000 0000
            </p>
            <p>
              <strong>Email:</strong> info@alumindojaya.co.id
            </p>
            <p>
              <strong>Jam Operasional:</strong> Senin–Jumat, 08.00–17.00 WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
