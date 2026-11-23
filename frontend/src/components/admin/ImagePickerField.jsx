import { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import MediaPicker from './MediaPicker';

export default function ImagePickerField({ label = 'Gambar', value, previewUrl, onChange, hint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="Pratinjau gambar" />
        ) : (
          <span style={{ display: 'grid', justifyItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <ImagePlus size={26} aria-hidden="true" />
            Belum ada gambar
          </span>
        )}
      </div>
      <div className="image-preview-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
          {previewUrl ? 'Ganti Gambar' : 'Pilih Gambar'}
        </button>
        {previewUrl ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(null)}>
            <Trash2 size={14} aria-hidden="true" /> Hapus
          </button>
        ) : null}
      </div>
      {hint ? <span className="hint">{hint}</span> : null}

      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        currentId={value}
        onSelect={(media) => onChange({ id: media.id, url: media.url, alt: media.alt_text || media.title })}
      />
    </div>
  );
}
