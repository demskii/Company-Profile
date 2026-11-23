// Entry point serverless untuk Vercel: seluruh backend Express berjalan sebagai satu fungsi.
// server.js (app.listen) hanya dipakai saat development lokal, bukan di Vercel.
import app from '../backend/app.js';

export default app;
