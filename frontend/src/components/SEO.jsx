import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function SEO({ title, description }) {
  const { settings, image } = useSettings();
  const location = useLocation();
  const favicon = image('favicon_id');

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

  useEffect(() => {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // Browser keeps the last icon when the link is removed, so reset to a blank icon instead.
    link.href = favicon || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E';
  }, [favicon]);

  return null;
}
