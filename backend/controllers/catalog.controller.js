import { dbQuery } from '../config/db.js'

function normalizeCategory(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function listProducts(req, res) {
  const category = normalizeCategory(req.query.category)

  try {
    const [rows] = category
      ? await dbQuery(
          `SELECT id, category, name, description, image_url, created_at
           FROM products
           WHERE category = ?
           ORDER BY id DESC`,
          [category]
        )
      : await dbQuery(
          `SELECT id, category, name, description, image_url, created_at
           FROM products
           ORDER BY id DESC`
        )

    return res.json(rows)
  } catch (err) {
    console.error('List products error:', err.message)
    return res.status(500).json({ message: 'Gagal mengambil data produk.' })
  }
}

export async function getProduct(req, res) {
  try {
    const [rows] = await dbQuery(
      `SELECT id, category, name, description, image_url, created_at
       FROM products WHERE id = ? LIMIT 1`,
      [req.params.id]
    )

    if (!rows[0]) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
    return res.json(rows[0])
  } catch (err) {
    console.error('Get product error:', err.message)
    return res.status(500).json({ message: 'Gagal mengambil detail produk.' })
  }
}

export async function createProduct(req, res) {
  const { category, name, description, image_url } = req.body
  try {
    const [result] = await dbQuery(
      `INSERT INTO products (category, name, description, image_url)
       VALUES (?, ?, ?, ?)`,
      [category || null, name, description || null, image_url || null]
    )
    return res.status(201).json({
      id: result.insertId,
      message: 'Produk berhasil ditambahkan.',
    })
  } catch (err) {
    console.error('Create product error:', err.message)
    return res.status(500).json({ message: 'Gagal menambahkan produk.' })
  }
}

export async function updateProduct(req, res) {
  const { category, name, description, image_url } = req.body
  try {
    const [result] = await dbQuery(
      `UPDATE products
       SET category = ?, name = ?, description = ?, image_url = ?
       WHERE id = ?`,
      [category || null, name, description || null, image_url || null, req.params.id]
    )

    if (!result.affectedRows) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
    return res.json({ message: 'Produk berhasil diperbarui.' })
  } catch (err) {
    console.error('Update product error:', err.message)
    return res.status(500).json({ message: 'Gagal memperbarui produk.' })
  }
}

export async function deleteProduct(req, res) {
  try {
    const [result] = await dbQuery('DELETE FROM products WHERE id = ?', [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
    return res.json({ message: 'Produk berhasil dihapus.' })
  } catch (err) {
    console.error('Delete product error:', err.message)
    return res.status(500).json({ message: 'Gagal menghapus produk.' })
  }
}

export async function listPortfolio(req, res) {
  const category = normalizeCategory(req.query.category)

  try {
    const [rows] = category
      ? await dbQuery(
          `SELECT id, title, description, category, image_url, created_at
           FROM portfolio
           WHERE category = ?
           ORDER BY id DESC`,
          [category]
        )
      : await dbQuery(
          `SELECT id, title, description, category, image_url, created_at
           FROM portfolio
           ORDER BY id DESC`
        )

    return res.json(rows)
  } catch (err) {
    console.error('List portfolio error:', err.message)
    return res.status(500).json({ message: 'Gagal mengambil data portofolio.' })
  }
}

export async function getPortfolioItem(req, res) {
  try {
    const [rows] = await dbQuery(
      `SELECT id, title, description, category, image_url, created_at
       FROM portfolio WHERE id = ? LIMIT 1`,
      [req.params.id]
    )

    if (!rows[0]) return res.status(404).json({ message: 'Proyek tidak ditemukan.' })
    return res.json(rows[0])
  } catch (err) {
    console.error('Get portfolio error:', err.message)
    return res.status(500).json({ message: 'Gagal mengambil detail proyek.' })
  }
}

export async function createPortfolioItem(req, res) {
  const { title, description, category, image_url } = req.body
  try {
    const [result] = await dbQuery(
      `INSERT INTO portfolio (title, description, category, image_url)
       VALUES (?, ?, ?, ?)`,
      [title, description || null, category || null, image_url || null]
    )
    return res.status(201).json({
      id: result.insertId,
      message: 'Proyek berhasil ditambahkan.',
    })
  } catch (err) {
    console.error('Create portfolio error:', err.message)
    return res.status(500).json({ message: 'Gagal menambahkan proyek.' })
  }
}

export async function updatePortfolioItem(req, res) {
  const { title, description, category, image_url } = req.body
  try {
    const [result] = await dbQuery(
      `UPDATE portfolio
       SET title = ?, description = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [title, description || null, category || null, image_url || null, req.params.id]
    )

    if (!result.affectedRows) return res.status(404).json({ message: 'Proyek tidak ditemukan.' })
    return res.json({ message: 'Proyek berhasil diperbarui.' })
  } catch (err) {
    console.error('Update portfolio error:', err.message)
    return res.status(500).json({ message: 'Gagal memperbarui proyek.' })
  }
}

export async function deletePortfolioItem(req, res) {
  try {
    const [result] = await dbQuery('DELETE FROM portfolio WHERE id = ?', [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Proyek tidak ditemukan.' })
    return res.json({ message: 'Proyek berhasil dihapus.' })
  } catch (err) {
    console.error('Delete portfolio error:', err.message)
    return res.status(500).json({ message: 'Gagal menghapus proyek.' })
  }
}
