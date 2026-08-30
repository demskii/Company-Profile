import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { authApi, onUnauthorized } from '../lib/api.js'

const AuthContext = createContext(null)

// Sesi diperpanjang setiap 20 menit selagi tab dashboard admin terbuka --
// jauh lebih pendek dari JWT_EXPIRES_IN (default 2 jam) supaya token tidak
// sempat kedaluwarsa hanya karena admin membiarkan tab idle sebentar.
const REFRESH_INTERVAL_MS = 20 * 60 * 1000

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authApi.getToken())
  const [sessionExpired, setSessionExpired] = useState(false)
  const refreshTimerRef = useRef(null)

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password)
    authApi.setToken(data.token)
    setSessionExpired(false)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    authApi.clearToken()
    setSessionExpired(false)
    setToken(null)
  }, [])

  // Kalau API mana pun mengembalikan 401 (token sudah expired/invalid di
  // server), sinkronkan status login di seluruh UI supaya halaman admin
  // otomatis terlempar ke /admin/login alih-alih menampilkan pesan error
  // "Tidak terautentikasi." mentah-mentah di tengah halaman.
  useEffect(() => {
    return onUnauthorized(() => {
      setSessionExpired(true)
      setToken(null)
    })
  }, [])

  // Sliding session: selama ada token aktif dan tab dashboard terbuka,
  // perpanjang otomatis secara berkala. Kalau ternyata token sudah tidak
  // valid lagi saat dicoba diperpanjang, biarkan gagal secara wajar --
  // listener 401 di atas yang akan menangani logout-nya.
  useEffect(() => {
    if (!token) {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
      return
    }

    refreshTimerRef.current = setInterval(async () => {
      try {
        const data = await authApi.refresh()
        authApi.setToken(data.token)
        setToken(data.token)
      } catch {
        // Dibiarkan -- listener onUnauthorized sudah menangani jika memang 401
      }
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(refreshTimerRef.current)
  }, [token])

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, sessionExpired, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
