-- Migration katalog + CMS media yang aman dijalankan ulang.
-- Database: alumindo_db
USE alumindo_db;

-- Pastikan tabel katalog tersedia untuk database lama.
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_category_name (category, name)
);

CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_portfolio_category_title (category, title)
);

-- Tambahkan index kategori hanya bila index tersebut belum ada.
SET @idx_products_category_exists := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'products'
    AND index_name = 'idx_products_category'
);
SET @sql_products_category := IF(
  @idx_products_category_exists = 0,
  'ALTER TABLE products ADD INDEX idx_products_category (category)',
  'SELECT 1'
);
PREPARE stmt_products_category FROM @sql_products_category;
EXECUTE stmt_products_category;
DEALLOCATE PREPARE stmt_products_category;

SET @idx_portfolio_category_exists := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'portfolio'
    AND index_name = 'idx_portfolio_category'
);
SET @sql_portfolio_category := IF(
  @idx_portfolio_category_exists = 0,
  'ALTER TABLE portfolio ADD INDEX idx_portfolio_category (category)',
  'SELECT 1'
);
PREPARE stmt_portfolio_category FROM @sql_portfolio_category;
EXECUTE stmt_portfolio_category;
DEALLOCATE PREPARE stmt_portfolio_category;

-- Data awal katalog. INSERT IGNORE mencegah duplikasi pada migration kedua dan seterusnya.
INSERT IGNORE INTO products (category, name, description) VALUES
  ('Konstruksi', 'Profil Sliding Window 7000 Series', 'Profil alumunium untuk sistem jendela sliding dengan desain ringan dan presisi.'),
  ('Konstruksi', 'Profil Curtain Wall 1000 Series', 'Profil untuk fasad dan curtain wall dengan fokus pada kekuatan serta tampilan modern.'),
  ('Konstruksi', 'Profil Pintu Casement', 'Profil kusen dan daun pintu alumunium untuk kebutuhan gedung komersial dan perkantoran.'),
  ('Otomotif', 'Bracket Baterai Kendaraan Listrik', 'Bracket alumunium ringan untuk mendukung pemasangan modul baterai kendaraan listrik.'),
  ('Otomotif', 'Rangka Modul Interior EV', 'Komponen rangka presisi untuk kebutuhan interior kendaraan listrik.'),
  ('Otomotif', 'Housing Komponen Otomotif', 'Housing alumunium custom untuk melindungi dan menopang komponen kendaraan.'),
  ('Industri', 'Panel Enclosure Custom', 'Panel alumunium custom untuk enclosure mesin dan kebutuhan industri.'),
  ('Industri', 'Panel Rack Server', 'Panel dengan dimensi dan bukaan yang disesuaikan untuk rack server.'),
  ('Industri', 'Panel Mesin Presisi', 'Panel fabricated dengan ukuran, lubang, dan finishing sesuai gambar kerja.'),
  ('Retail', 'Handle Pintu Alumunium', 'Handle alumunium untuk pintu dengan beberapa pilihan bentuk dan finishing.'),
  ('Retail', 'Engsel Alumunium Heavy Duty', 'Engsel alumunium untuk penggunaan pintu dan panel dengan kebutuhan daya tahan tinggi.'),
  ('Retail', 'Aksesoris Kusen', 'Komponen pendukung kusen dan sistem pintu/jendela alumunium.');

INSERT IGNORE INTO portfolio (title, description, category) VALUES
  ('Gedung Perkantoran Sudirman', 'Pengerjaan profil dan sistem fasad alumunium untuk area perkantoran dengan kebutuhan presisi dan tampilan modern.', 'Konstruksi'),
  ('Fasad Mall Grand Indonesia', 'Pengerjaan komponen fasad alumunium untuk area komersial dengan perhatian pada detail dan konsistensi finishing.', 'Konstruksi'),
  ('Rangka Komponen Kendaraan Listrik', 'Produksi rangka dan komponen alumunium ringan untuk mendukung kebutuhan kendaraan listrik.', 'Otomotif'),
  ('Bracket Baterai Kendaraan Listrik', 'Produksi bracket custom berbasis gambar teknik untuk kebutuhan modul baterai kendaraan listrik.', 'Otomotif'),
  ('Panel Server Rack Custom', 'Produksi panel rack server custom dengan dimensi, bukaan, dan finishing berdasarkan kebutuhan proyek.', 'Industri'),
  ('Panel Enclosure Mesin', 'Pembuatan panel enclosure alumunium untuk melindungi dan mengintegrasikan komponen mesin industri.', 'Industri');

-- CMS media statis.
INSERT IGNORE INTO contents (section_key, title, body, image_url) VALUES
  ('media_home_hero', 'Hero Beranda', 'Gambar besar pada bagian hero halaman beranda.', NULL),
  ('media_about_history', 'Foto Sejarah', 'Gambar pada bagian Sejarah.', NULL),
  ('media_team_1', 'Foto Tim 1', 'Foto Budi Santoso — Direktur Utama.', NULL),
  ('media_team_2', 'Foto Tim 2', 'Foto Sri Wahyuni — Kepala Produksi.', NULL),
  ('media_team_3', 'Foto Tim 3', 'Foto Agus Prasetyo — Kepala QC.', NULL),
  ('media_service_konstruksi', 'Thumbnail Layanan — Konstruksi', 'Thumbnail kartu Profil Alumunium Konstruksi.', NULL),
  ('media_service_otomotif', 'Thumbnail Layanan — Otomotif', 'Thumbnail kartu Komponen Otomotif.', NULL),
  ('media_service_industri', 'Thumbnail Layanan — Industri', 'Thumbnail kartu Panel Alumunium Custom.', NULL),
  ('media_service_retail', 'Thumbnail Layanan — Retail', 'Thumbnail kartu Aksesoris Alumunium.', NULL),
  ('media_portfolio_konstruksi', 'Thumbnail Portofolio — Konstruksi', 'Thumbnail kategori proyek Konstruksi.', NULL),
  ('media_portfolio_otomotif', 'Thumbnail Portofolio — Otomotif', 'Thumbnail kategori proyek Otomotif.', NULL),
  ('media_portfolio_industri', 'Thumbnail Portofolio — Industri', 'Thumbnail kategori proyek Industri.', NULL);
