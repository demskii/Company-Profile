import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./pages/admin/Login.jsx";
import AdminDashboardHome from "./pages/admin/DashboardHome.jsx";
import AdminMessages from "./pages/admin/Messages.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import AdminPortfolio from "./pages/admin/PortfolioAdmin.jsx";
import AdminMedia from "./pages/admin/Media.jsx";

// Layout untuk halaman publik: Navbar, Footer, dan tombol WhatsApp mengambang.
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* --- Halaman Publik --- */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/tentang-kami"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/layanan"
        element={
          <PublicLayout>
            <Services />
          </PublicLayout>
        }
      />
      <Route
        path="/portofolio"
        element={
          <PublicLayout>
            <Portfolio />
          </PublicLayout>
        }
      />
      <Route
        path="/kontak"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      {/* --- Dashboard Admin --- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="pesan" element={<AdminMessages />} />
        <Route path="produk" element={<AdminProducts />} />
        <Route path="portofolio" element={<AdminPortfolio />} />
        <Route path="media" element={<AdminMedia />} />
      </Route>
    </Routes>
  );
}
