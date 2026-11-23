export function formatDate(value, withTime = false) {
  if (!value) return '-';
  const normalized = typeof value === 'string' ? value.replace(' ', 'T') : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

export function formatBytes(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileFormat(mime = '') {
  const map = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/svg+xml': 'SVG',
  };
  return map[mime] || mime.replace('image/', '').toUpperCase() || '-';
}

export function whatsappLink(number, text = '') {
  const clean = String(number || '').replace(/[^0-9]/g, '');
  if (!clean) return '';
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${clean}${query}`;
}

export function parseSpecifications(value) {
  if (!value) return [];
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf(':');
      if (index === -1) return { label: '', value: line };
      return { label: line.slice(0, index).trim(), value: line.slice(index + 1).trim() };
    });
}

export function truncate(value, length = 140) {
  const text = String(value || '');
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}...`;
}
