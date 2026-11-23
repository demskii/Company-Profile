import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext(null);

export const defaultSettings = {
  company_name: 'ALUMINDO SEJAHTERA',
  tagline: 'Manufaktur Aluminium untuk Industri Modern',
  seo_title: 'ALUMINDO SEJAHTERA - Manufaktur Aluminium',
  meta_description: '',
  hero_title: '',
  hero_subtitle: '',
  about_title: '',
  about_text: '',
  history: '',
  vision: '',
  mission: '',
  values: [],
  why_items: [],
  stats: [],
  cta_title: '',
  cta_text: '',
  contact_address: '',
  contact_phone: '',
  contact_whatsapp: '',
  contact_email: '',
  contact_maps: '',
  social: [],
  footer_text: '',
  office_hours: '',
};

export function SettingsProvider({ children }) {
  const [data, setData] = useState({ settings: defaultSettings, media: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const response = await api.get('/settings');
      const payload = response.data.data;
      setData({
        settings: { ...defaultSettings, ...payload.settings },
        media: payload.media || {},
      });
      setError(null);
      return payload;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      settings: data.settings,
      media: data.media,
      loading,
      error,
      refresh,
      image(key) {
        return data.media[key]?.url || '';
      },
      imageAlt(key, fallback = '') {
        return data.media[key]?.alt || fallback;
      },
    }),
    [data, loading, error, refresh],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings harus dipakai di dalam SettingsProvider.');
  return context;
}
