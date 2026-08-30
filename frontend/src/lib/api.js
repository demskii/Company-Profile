const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
const TOKEN_KEY = 'alumindo_admin_token'

// Token admin disimpan di sessionStorage (BUKAN localStorage). Bedanya:
// - Refresh/reload halaman dalam tab yang sama -> sesi TETAP tersimpan,
//   jadi admin tidak dilempar ke login hanya karena tidak sengaja menekan F5.
// - Menutup tab/browser lalu membukanya lagi (atau tab baru) -> sessionStorage
//   otomatis kosong, sehingga wajib login ulang, sesuai permintaan awal agar
//   sesi tidak "menempel" selamanya seperti localStorage.
function getStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null // mis. mode private browsing yang memblokir storage
  }
}
function setStoredToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Diabaikan -- kalau storage tidak tersedia, sesi tetap jalan di memori
    // untuk request saat ini saja lewat variabel token di closure request().
  }
}
function clearStoredToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // no-op
  }
}

// Pub-sub sederhana supaya AuthContext bisa tahu kapan sesi admin benar-benar
// habis (401 dari server), lalu memperbarui status login di seluruh UI --
// tanpa ini, halaman admin bisa "terlihat" masih login padahal tokennya
// sudah dihapus, sehingga error 401 muncul mentah alih-alih redirect ke login.
const unauthorizedListeners = new Set()
export function onUnauthorized(callback) {
  unauthorizedListeners.add(callback)
  return () => unauthorizedListeners.delete(callback)
}
function notifyUnauthorized() {
  for (const cb of unauthorizedListeners) cb()
}

async function request(path, options = {}) {
  const token = getStoredToken()
  const isFormData = options.body instanceof FormData
  const method = String(options.method || 'GET').toUpperCase()
  const shouldRetry = method === 'GET'
  const maxAttempts = shouldRetry ? 3 : 1
  const retryDelays = [400, 1000]

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response

    try {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      })
    } catch (error) {
      lastError = new Error(
        `Tidak dapat terhubung ke server (${API_URL}). Pastikan backend Node.js dan MySQL sedang berjalan.`
      )
      lastError.cause = error

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt - 1] || 1000))
        continue
      }
      throw lastError
    }

    let data = null
    try {
      data = await response.json()
    } catch {
      // Response tanpa body JSON tetap ditangani sebagai error HTTP biasa.
    }

    if (response.status === 401 && path !== '/api/admin/login') {
      const hadToken = !!getStoredToken()
      clearStoredToken()
      // Hanya beri tahu (dan picu redirect ke login) kalau sebelumnya memang
      // ada sesi admin yang kini dianggap invalid/expired oleh server.
      if (hadToken) notifyUnauthorized()
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Gagal mengambil data dari server (kode ${response.status}).`
      )
      error.status = response.status
      error.details = data?.errors
      lastError = error

      // GET boleh retry untuk error server/transient network, tetapi tidak
      // untuk 4xx karena biasanya itu kesalahan request.
      const retryableStatus = response.status >= 500 || response.status === 408 || response.status === 429
      if (shouldRetry && retryableStatus && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt - 1] || 1000))
        continue
      }
      throw error
    }

    return data
  }

  throw lastError || new Error('Gagal mengambil data dari server.')
}

// Mengubah path relatif dari server (mis. /uploads/xxx.jpg) menjadi URL penuh.
// URL absolut (http://...) dibiarkan apa adanya.
export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (pathOrUrl.startsWith('/images/')) return pathOrUrl
  return `${API_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export const catalogApi = {
  products: (category) => request(`/api/catalog/products${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  product: (id) => request(`/api/catalog/products/${id}`),
  portfolio: (category) => request(`/api/catalog/portfolio${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  portfolioItem: (id) => request(`/api/catalog/portfolio/${id}`),
}


export const publicContentApi = {
  list: () => request('/api/content'),
}

export const authApi = {
  login: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  // Menukar token yang masih valid dengan token baru -- dipanggil berkala
  // agar sesi admin tidak habis selama tab dashboard tetap terbuka.
  refresh: () => request('/api/admin/refresh', { method: 'POST' }),
  getToken: () => getStoredToken(),
  setToken: (token) => setStoredToken(token),
  clearToken: () => clearStoredToken(),
}

export const uploadApi = {
  // file: objek File dari <input type="file">
  upload: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return request('/api/admin/upload', { method: 'POST', body: formData })
  },
}

export const adminContentApi = {
  list: () => request('/api/admin/content'),
  update: (payload) => request('/api/admin/content', { method: 'PUT', body: JSON.stringify(payload) }),
}

export const adminCatalogApi = {
  products: {
    list: () => request('/api/admin/catalog/products'),
    create: (payload) => request('/api/admin/catalog/products', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/api/admin/catalog/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => request(`/api/admin/catalog/products/${id}`, { method: 'DELETE' }),
  },
  portfolio: {
    list: () => request('/api/admin/catalog/portfolio'),
    create: (payload) => request('/api/admin/catalog/portfolio', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/api/admin/catalog/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => request(`/api/admin/catalog/portfolio/${id}`, { method: 'DELETE' }),
  },
}

export const adminMessagesApi = {
  list: () => request('/api/contact'),
}
