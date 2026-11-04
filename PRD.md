# PRD — Vibescoderz

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | Vibescoderz |
| Tech Stack | Next.js |
| Status | Hampir selesai (beta) |
| Penanggung Jawab | Nabil Aulia Dika |
| Versi Dokumen | 1.0 |
| Tanggal | 2026 |

## 2. Latar Belakang

Proyek ini dikembangkan sebagai bagian dari portofolio dan kebutuhan operasional. Dokumen ini mengikuti standar PRD nasional agar ruang lingkup, fitur, dan kriteria keberhasilan terdefinisi dengan jelas.

## 3. Masalah yang Diselesaikan

Pengguna membutuhkan solusi digital yang efisien, terukur, dan mudah dipelihara untuk kebutuhan yang ditangani oleh proyek ini.

## 4. Tujuan & Sasaran

- Menyediakan fungsionalitas inti secara andal.
- Menjaga kualitas kode dan dokumentasi.
- Memudahkan onboarding kontributor baru.

## 5. Ruang Lingkup

### In Scope
- Fitur inti aplikasi sesuai struktur repo.
- Setup & konfigurasi pengembangan lokal.
- Dokumentasi (README + PRD).

### Out of Scope
- Infrastruktur production (kecuali disebutkan).
- Integrasi pihak ketiga yang belum dikonfigurasi.

## 6. Fitur & Persyaratan Fungsional

Struktur proyek (file/direktori utama):
- AGENTS.md
- ATTACK-CLASSES.md
- AuthGuard.tsx
- DESIGN.MD
- FaqAccordion.tsx
- LICENSE
- LoginClient.tsx
- Logo Area Desain.png
- Logo Barika.png
- Logo Eggeek.png
- Logo Nightcoders.png
- Logo Startup Banda Aceh Community.png
- Logo_Area_Desain.png
- Logo_Barika.png
- Logo_Eggeek.png
- Logo_Nightcoders.png
- Logo_Startup_Banda_Aceh_Community.png
- PRD.MD
- PRD.md
- README.md

## 7. Persyaratan Non-Fungsional

- **Performa:** responsif untuk penggunaan normal.
- **Keamanan:** rahasia (`.env`) tidak boleh ter-commit; gunakan `.env.example`.
- **Maintainability:** kode terstruktur, terdokumentasi.
- **Portabilitas:** dapat dijalankan di Linux/macOS/Windows (sesuai stack).

## 8. Arsitektur & Tech Stack

Next.js

## 9. Milestone / Roadmap

| Fase | Status |
|---|---|
| Inisialisasi & scaffolding | ✅ |
| Pengembangan fitur inti | 🔄 |
| Testing & QA | ⏳ |
| Deployment | ⏳ |
| Dokumentasi | ✅ (README + PRD) |

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Konfigurasi env bocor | `.gitignore` + `.env.example` |
| Dependency usang | Audit berkala (`npm audit` / `pip list --outdated`) |
| Build artifact besar | Tambahkan ke `.gitignore` |

## 11. Kriteria Keberhasilan

- Aplikasi berjalan tanpa error di lingkungan dev.
- README & PRD lengkap dan up-to-date.
- Tidak ada secret yang ter-commit.

## 12. Lampiran

- Struktur: lihat README.md
- Lisensi: MIT (LICENSE)
