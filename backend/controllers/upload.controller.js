export function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah.' })
  }
  // URL relatif -- frontend akan menggabungkannya dengan VITE_API_URL
  const url = `/uploads/${req.file.filename}`
  return res.status(201).json({ url })
}
