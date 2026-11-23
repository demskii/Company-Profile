import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import ProductForm from './admin/ProductForm';
import AdminCategories from './admin/Categories';
import AdminServices from './admin/Services';
import MediaLibrary from './admin/MediaLibrary';
import ContentManager from './admin/ContentManager';
import Messages from './admin/Messages';
import SettingsPage from './admin/Settings';
import Account from './admin/Account';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/produk" element={<Products />} />
        <Route path="/produk/kategori/:slug" element={<CategoryPage />} />
        <Route path="/produk/:slug" element={<ProductDetail />} />
        <Route path="/layanan" element={<Services />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produk" element={<AdminProducts />} />
        <Route path="produk/baru" element={<ProductForm />} />
        <Route path="produk/:id/edit" element={<ProductForm />} />
        <Route path="kategori" element={<AdminCategories />} />
        <Route path="layanan" element={<AdminServices />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="konten" element={<ContentManager />} />
        <Route path="pesan" element={<Messages />} />
        <Route path="pengaturan" element={<SettingsPage />} />
        <Route path="akun" element={<Account />} />
      </Route>
    </Routes>
  );
}
