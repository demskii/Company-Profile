import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errors?.length) return data.errors[0].message;
  if (data?.message) return data.message;
  if (error?.code === 'ERR_NETWORK') return 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
  return error?.message || 'Terjadi kesalahan. Coba lagi.';
}

export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, item) => {
    if (item.field && !acc[item.field]) acc[item.field] = item.message;
    return acc;
  }, {});
}
