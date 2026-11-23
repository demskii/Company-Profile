-- ALUMINDO SEJAHTERA - demo seed data
-- Import AFTER schema.sql. All values below are demo content and can be changed in the admin dashboard.
-- Default admin: username "admin", password "Admin#12345" (change it after first login).

USE alumindo_sejahtera;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE contact_messages;
TRUNCATE TABLE website_settings;
TRUNCATE TABLE services;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE media;
TRUNCATE TABLE admins;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO admins (id, username, email, password_hash, name) VALUES
(1, 'admin', 'admin@alumindo.co.id', '$2b$12$xgD6g2nrrDigT6Z3RNBbu.ByciSbMXWzi6JBWdYlXYrbPj99CyMfe', 'Administrator');

INSERT INTO media (id, filename, original_name, path, mime_type, size_bytes, title, alt_text) VALUES
(1, 'hero.svg', 'hero.svg', '/uploads/seed/hero.svg', 'image/svg+xml', 5272, 'Hero industri aluminium', 'Profil aluminium di lini produksi'),
(2, 'facility.svg', 'facility.svg', '/uploads/seed/facility.svg', 'image/svg+xml', 3983, 'Fasilitas produksi', 'Gedung dan area produksi Alumindo Sejahtera'),
(3, 'product-construction.svg', 'product-construction.svg', '/uploads/seed/product-construction.svg', 'image/svg+xml', 4211, 'Profil konstruksi', 'Profil aluminium untuk konstruksi bangunan'),
(4, 'product-automotive.svg', 'product-automotive.svg', '/uploads/seed/product-automotive.svg', 'image/svg+xml', 4080, 'Komponen otomotif', 'Komponen aluminium presisi untuk otomotif'),
(5, 'product-panel.svg', 'product-panel.svg', '/uploads/seed/product-panel.svg', 'image/svg+xml', 3581, 'Panel aluminium', 'Panel aluminium custom dengan perforasi'),
(6, 'product-accessory.svg', 'product-accessory.svg', '/uploads/seed/product-accessory.svg', 'image/svg+xml', 3865, 'Aksesoris aluminium', 'Aksesoris dan hardware aluminium'),
(7, 'service-manufacturing.svg', 'service-manufacturing.svg', '/uploads/seed/service-manufacturing.svg', 'image/svg+xml', 3541, 'Manufaktur aluminium', 'Proses manufaktur aluminium'),
(8, 'service-fabrication.svg', 'service-fabrication.svg', '/uploads/seed/service-fabrication.svg', 'image/svg+xml', 3616, 'Fabrikasi aluminium', 'Proses fabrikasi aluminium presisi'),
(9, 'service-components.svg', 'service-components.svg', '/uploads/seed/service-components.svg', 'image/svg+xml', 3724, 'Produksi komponen', 'Produksi komponen aluminium'),
(10, 'service-industrial.svg', 'service-industrial.svg', '/uploads/seed/service-industrial.svg', 'image/svg+xml', 5231, 'Solusi industri', 'Solusi aluminium untuk kebutuhan industri');

INSERT INTO categories (id, name, slug, description, image_id, is_active, sort_order) VALUES
(1, 'Aluminium Konstruksi', 'aluminium-konstruksi', 'Profil dan sistem aluminium untuk kebutuhan konstruksi bangunan, kusen, fasad, dan partisi.', 3, 1, 1),
(2, 'Komponen Otomotif', 'komponen-otomotif', 'Komponen aluminium presisi untuk industri otomotif dan kendaraan komersial.', 4, 1, 2),
(3, 'Panel Aluminium Custom', 'panel-aluminium-custom', 'Panel aluminium custom untuk fasad, interior, dan aplikasi industri dengan finishing sesuai kebutuhan.', 5, 1, 3),
(4, 'Aksesoris Aluminium', 'aksesoris-aluminium', 'Aksesoris, hardware, dan komponen pendukung sistem aluminium.', 6, 1, 4);

INSERT INTO products (id, category_id, name, slug, short_description, description, specifications, image_id, is_published, is_featured, sort_order) VALUES
(1, 1, 'Profil Aluminium Konstruksi', 'profil-aluminium-konstruksi',
 'Profil aluminium struktural untuk rangka bangunan, kusen, dan sistem fasad.',
 'Profil aluminium konstruksi Alumindo Sejahtera diproduksi dengan toleransi dimensi yang ketat untuk menjaga kekuatan dan kerapian sambungan. Cocok untuk rangka bangunan, kusen pintu dan jendela, serta sistem fasad.',
 'Material: Aluminium 6063-T5\nFinishing: Anodized / Powder Coating\nToleransi: ±0.2 mm\nPanjang: Custom sesuai pesanan\nWarna: Natural, hitam, putih, custom RAL',
 3, 1, 1, 1),
(2, 1, 'Kusen Aluminium Presisi', 'kusen-aluminium-presisi',
 'Sistem kusen aluminium siap pasang untuk proyek residensial dan komersial.',
 'Kusen aluminium presisi dengan profil sambungan rapat dan permukaan finishing halus. Diproduksi sesuai gambar kerja proyek untuk mempermudah proses pemasangan di lapangan.',
 'Material: Aluminium 6063-T5\nKetebalan profil: 1.2 - 2.0 mm\nFinishing: Powder Coating\nSistem: Casement, sliding, fixed\nPemesanan: Berdasarkan gambar kerja',
 3, 1, 0, 2),
(3, 2, 'Komponen Otomotif Presisi', 'komponen-otomotif-presisi',
 'Komponen aluminium hasil machining untuk kebutuhan industri otomotif.',
 'Komponen otomotif aluminium dikerjakan dengan proses machining dan quality control dimensi. Setiap batch produksi melewati pemeriksaan ukuran sebelum dikirim ke pelanggan.',
 'Material: Aluminium 6061 / 7075\nProses: CNC machining\nToleransi: ±0.05 mm\nFinishing: Anodized / bare\nQC: Dimensional check per batch',
 4, 1, 1, 1),
(4, 2, 'Housing Aluminium Mesin', 'housing-aluminium-mesin',
 'Housing dan cover aluminium untuk peralatan mesin dan elektronik industri.',
 'Housing aluminium dirancang untuk melindungi komponen mesin dengan bobot ringan dan pembuangan panas yang baik. Tersedia dalam berbagai dimensi sesuai gambar pelanggan.',
 'Material: Aluminium 6063\nProses: Ekstrusi + machining\nFinishing: Anodized\nCustom: Dimensi dan lubang sesuai drawing\nAplikasi: Mesin industri, elektronik',
 4, 1, 0, 2),
(5, 3, 'Panel Fasad Aluminium', 'panel-fasad-aluminium',
 'Panel aluminium untuk fasad bangunan dengan tampilan modern dan tahan cuaca.',
 'Panel fasad aluminium dengan permukaan rata dan finishing tahan cuaca. Sistem pemasangan dapat disesuaikan dengan desain fasad dan kebutuhan proyek.',
 'Material: Aluminium sheet 2 - 4 mm\nFinishing: PVDF / Powder Coating\nUkuran: Custom\nAplikasi: Fasad, cladding, signage\nWarna: Custom RAL',
 5, 1, 1, 1),
(6, 3, 'Panel Perforasi Custom', 'panel-perforasi-custom',
 'Panel aluminium berlubang dengan pola perforasi sesuai desain arsitektur.',
 'Panel perforasi custom untuk kebutuhan fasad, plafon, dan partisi dengan pola lubang yang dapat disesuaikan. Memberikan sirkulasi udara dan estetika pada tampilan bangunan.',
 'Material: Aluminium sheet 1.5 - 3 mm\nPola: Bulat, persegi, custom\nDiameter lubang: 3 - 20 mm\nFinishing: Powder Coating\nUkuran: Custom',
 5, 1, 0, 2),
(7, 4, 'Aksesoris Kusen Aluminium', 'aksesoris-kusen-aluminium',
 'Hardware dan aksesoris pendukung sistem kusen aluminium.',
 'Aksesoris kusen aluminium meliputi engsel, handle, bracket, dan konektor dengan material yang tahan lama. Cocok untuk melengkapi sistem aluminium pada proyek residensial maupun komersial.',
 'Material: Aluminium alloy\nJenis: Engsel, handle, bracket, konektor\nFinishing: Anodized\nKemasan: Per set / per pcs\nAplikasi: Kusen dan pintu aluminium',
 6, 1, 1, 1),
(8, 4, 'Bracket & Konektor Aluminium', 'bracket-konektor-aluminium',
 'Bracket dan konektor untuk sambungan rangka aluminium yang kuat.',
 'Bracket dan konektor aluminium dirancang untuk memperkuat sambungan rangka tanpa mengurangi kerapian tampilan. Tersedia dalam beberapa ukuran standar dan custom.',
 'Material: Aluminium alloy\nUkuran: Standar dan custom\nFinishing: Natural / anodized\nAplikasi: Rangka aluminium, partisi\nPemesanan: Eceran dan grosir',
 6, 1, 0, 2);

INSERT INTO services (id, title, description, detail, image_id, is_published, sort_order) VALUES
(1, 'Aluminium Manufacturing', 'Produksi profil dan komponen aluminium dengan proses manufaktur terkontrol.',
 'Kami memproduksi profil dan komponen aluminium sesuai kebutuhan industri, mulai dari ekstrusi hingga finishing. Setiap tahap produksi mengikuti pemeriksaan kualitas agar hasil konsisten dan siap digunakan.', 7, 1, 1),
(2, 'Custom Aluminium Fabrication', 'Fabrikasi aluminium sesuai gambar kerja, ukuran, dan finishing pilihan pelanggan.',
 'Layanan fabrikasi mencakup pemotongan, machining, perakitan, dan finishing aluminium sesuai gambar kerja. Tim kami membantu menyesuaikan detail teknis agar hasil akhir sesuai kebutuhan proyek.', 8, 1, 2),
(3, 'Aluminium Component Production', 'Produksi komponen aluminium presisi untuk otomotif dan peralatan industri.',
 'Produksi komponen aluminium untuk kebutuhan otomotif dan industri dengan kontrol dimensi yang ketat. Proses produksi dapat menyesuaikan spesifikasi material, toleransi, dan finishing.', 9, 1, 3),
(4, 'Industrial Aluminium Solutions', 'Solusi aluminium terintegrasi untuk kebutuhan konstruksi dan industri.',
 'Kami membantu merancang solusi aluminium yang sesuai dengan kebutuhan teknis dan anggaran proyek, mulai dari pemilihan profil, perhitungan kebutuhan material, hingga dukungan produksi.', 10, 1, 4);

INSERT INTO website_settings (setting_key, setting_value, setting_group, setting_type) VALUES
('company_name', 'ALUMINDO SEJAHTERA', 'general', 'text'),
('tagline', 'Manufaktur Aluminium untuk Industri Modern', 'general', 'text'),
('logo_id', '', 'general', 'image'),
('favicon_id', '', 'general', 'image'),
('seo_title', 'ALUMINDO SEJAHTERA - Manufaktur Aluminium Indonesia', 'general', 'text'),
('meta_description', 'Alumindo Sejahtera memproduksi profil, komponen, dan panel aluminium untuk kebutuhan konstruksi dan industri dengan kualitas terkontrol.', 'general', 'textarea'),
('hero_title', 'Solusi Manufaktur Aluminium untuk Kebutuhan Industri Modern', 'home', 'text'),
('hero_subtitle', 'Alumindo Sejahtera memproduksi profil, komponen, dan panel aluminium dengan proses terkontrol, toleransi presisi, dan layanan yang menyesuaikan kebutuhan proyek Anda.', 'home', 'textarea'),
('hero_image_id', '1', 'home', 'image'),
('about_title', 'Manufaktur aluminium yang tumbuh bersama kebutuhan industri', 'home', 'text'),
('about_text', 'Alumindo Sejahtera bergerak di bidang manufaktur aluminium, melayani kebutuhan konstruksi, otomotif, dan industri. Kami menggabungkan proses produksi yang terkontrol dengan komunikasi teknis yang jelas di setiap tahap proyek.', 'home', 'textarea'),
('about_image_id', '2', 'home', 'image'),
('history', 'Alumindo Sejahtera didirikan sebagai usaha manufaktur aluminium yang berfokus pada profil dan komponen untuk kebutuhan konstruksi. Seiring bertambahnya kebutuhan pelanggan, layanan kami berkembang ke fabrikasi custom, komponen otomotif, dan panel aluminium. Sampai saat ini, kami terus meningkatkan proses produksi dan kontrol kualitas agar dapat memenuhi kebutuhan industri yang terus berubah.', 'about', 'textarea'),
('vision', 'Menjadi mitra manufaktur aluminium yang terpercaya melalui kualitas produk, ketepatan pengiriman, dan layanan teknis yang profesional.', 'about', 'textarea'),
('mission', 'Menyediakan produk aluminium yang konsisten dan sesuai spesifikasi.\nMeningkatkan efisiensi proses produksi secara berkelanjutan.\nMembangun komunikasi teknis yang jelas dengan pelanggan.\nMengembangkan kompetensi tim dan teknologi manufaktur.', 'about', 'textarea'),
('values', '[{"title":"Integritas","description":"Menjaga kejujuran dan transparansi dalam setiap kesepakatan kerja."},{"title":"Kualitas","description":"Mengutamakan ketepatan ukuran dan konsistensi hasil produksi."},{"title":"Kolaborasi","description":"Bekerja bersama pelanggan untuk menemukan solusi yang tepat."}]', 'about', 'json'),
('why_items', '[{"title":"Kualitas Terkontrol","description":"Pemeriksaan dimensi dan material pada setiap tahap produksi."},{"title":"Ketepatan Produksi","description":"Proses kerja mengikuti gambar dan tenggat yang disepakati."},{"title":"Teknologi Manufaktur","description":"Peralatan produksi dan finishing untuk hasil yang konsisten."},{"title":"Profesionalisme","description":"Komunikasi teknis yang jelas dari penawaran hingga pengiriman."},{"title":"Solusi Sesuai Kebutuhan","description":"Spesifikasi produk disesuaikan dengan kebutuhan proyek."}]', 'home', 'json'),
('stats', '[{"label":"Pengalaman","value":"10","suffix":"+ Tahun"},{"label":"Kapasitas Produksi","value":"500","suffix":" Ton/Bulan"},{"label":"Varian Produk","value":"40","suffix":"+ Produk"},{"label":"Pelanggan","value":"120","suffix":"+ Pelanggan"}]', 'home', 'json'),
('cta_title', 'Butuh solusi aluminium untuk proyek Anda?', 'home', 'text'),
('cta_text', 'Sampaikan kebutuhan Anda. Tim kami akan membantu menyiapkan spesifikasi dan penawaran yang sesuai.', 'home', 'textarea'),
('contact_address', 'Kawasan Industri, Cikarang, Bekasi, Jawa Barat, Indonesia', 'contact', 'textarea'),
('contact_phone', '(021) 0000 0000', 'contact', 'text'),
('contact_whatsapp', '6281200000000', 'contact', 'text'),
('contact_email', 'info@alumindo.co.id', 'contact', 'text'),
('contact_maps', 'https://www.google.com/maps?q=Kawasan%20Industri%20Cikarang&output=embed', 'contact', 'text'),
('social', '[{"platform":"LinkedIn","url":"https://www.linkedin.com/"},{"platform":"Instagram","url":"https://www.instagram.com/"}]', 'contact', 'json'),
('footer_text', 'Manufaktur aluminium untuk konstruksi, otomotif, dan kebutuhan industri.', 'general', 'textarea'),
('office_hours', 'Senin - Jumat, 08.00 - 17.00 WIB', 'contact', 'text');
