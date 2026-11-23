import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function SEO({ title, description }) {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} | ${settings.company_name}` : settings.seo_title || settings.company_name;
    document.title = pageTitle;

    const meta = document.querySelector('meta[name="description"]');
    const content = description || settings.meta_description || '';
    if (meta) meta.setAttribute('content', content);
    else {
      const tag = document.createElement('meta');
      tag.name = 'description';
      tag.content = content;
      document.head.appendChild(tag);
    }
  }, [title, description, settings.company_name, settings.seo_title, settings.meta_description, location.pathname]);

  return null;
}
