# Design System & UI/UX Specification
**Nama Proyek:** PinkyFocus  
**Konsep Visual:** Soft Kawaii, Pinky Pastel, Cozy, Tactile (membulat dan empuk)

---

## 1. Prinsip Desain
1. **Serba Membulat (Extra Rounded):** Hindari sudut tajam. Semua kartu, tombol, dan input menggunakan `border-radius` yang besar agar terlihat ramah dan menggemaskan.
2. **Kontras yang Nyaman:** Meskipun dominan pink dan warna cerah, teks utama harus menggunakan warna cokelat tua/abu-abu gelap kemerahan (bukan hitam pekat `#000000`) agar tetap lembut di mata namun mudah dibaca.
3. **Interaksi yang Hidup (Micro-interactions):** Setiap klik tombol atau centang tugas harus memberikan respons visual yang membal (*bouncy*).

## 2. Palet Warna (Color Palette)

| Peran Warna | Nama Warna | Hex Code | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Background Utama** | *Milk Strawberry* | `#FFF5F7` | Latar belakang halaman keseluruhan |
| **Surface / Card** | *Pure Cream White* | `#FFFFFF` | Latar kartu Timer dan kartu To-Do List |
| **Primary Accent** | *Bubblegum Pink* | `#FF85A2` | Tombol utama (Start), checkbox aktif, highlight |
| **Secondary Accent** | *Soft Blossom* | `#FFC2D1` | Tombol sekunder, border kartu, badge/tag |
| **Hover / Active** | *Berry Pink* | `#FF5C8A` | Warna saat tombol utama di-hover atau ditekan |
| **Text Primary** | *Cocoa Brown* | `#4A353B` | Judul, angka timer, teks tugas utama |
| **Text Secondary** | *Muted Mauve* | `#9E7B85` | Sub-judul, tugas yang sudah dicoret, placeholder |
| **Status: Break** | *Minty Matcha* | `#A8E6CF` | Aksen warna saat timer masuk mode Istirahat |
| **Danger / Delete** | *Peach Red* | `#FF758F` | Tombol hapus tugas |

## 3. Tipografi (Typography)
Gunakan font dari Google Fonts yang memiliki ujung membulat (*rounded terminals*):
* **Heading & Angka Timer:** **'Fredoka'** atau **'Quicksand'** (Weight: 600 - 700). Memberikan kesan *chubby* dan imut pada angka countdown.
* **Body & Daftar Tugas:** **'Nunito'** atau **'Plus Jakarta Sans'** (Weight: 400 - 600). Sangat jelas dibaca untuk teks daftar tugas.

**Ukuran Font Dasar:**
* Angka Timer: `4.5rem` (72px) pada Desktop, `3.5rem` (56px) pada Mobile.
* Judul Seksi: `1.25rem` (20px).
* Teks Tugas: `1rem` (16px).

## 4. Spesifikasi Komponen (Component Styling)

### 4.1. Kartu (Cards)
* **Background:** `#FFFFFF`
* **Border:** `2px solid #FFE3EC`
* **Border Radius:** `24px`
* **Shadow:** `0 8px 24px rgba(255, 133, 162, 0.12)` (bayangan berwarna pink lembut, bukan abu-abu).

### 4.2. Tombol (Buttons)
* **Gaya:** *3D Tactile / Chunky Button* (memiliki border bawah lebih tebal yang mengecil saat ditekan).
* **Border Radius:** `9999px` (Pill shape).
* **Efek Klik:** `transform: translateY(2px)` saat `:active`.

### 4.3. Checkbox To-Do List
* Bentuk lingkaran atau kotak dengan sudut `8px`.
* Saat dicentang: Background berubah menjadi `#FF85A2` dengan ikon centang putih atau ikon hati kecil di dalamnya, disertai animasi `scale(1.15)` lalu kembali ke `scale(1)`.
* Teks tugas yang selesai: Diberi efek `line-through` warna `#9E7B85` dan opasitas `0.6`.

## 5. Tata Letak (Layout Structure)

### Desktop View (Layar > 768px)
Menggunakan sistem **2 Kolom (Grid/Flexbox)** di tengah layar (`max-width: 960px`):
* **Header:** Logo imut di kiri, sapaan singkat di tengah, tombol pengaturan & *ambient sound* di kanan.
* **Kolom Kiri (Lebar 45%):** Kartu Pomodoro Timer, ilustrasi/maskot mini di atas angka timer, tombol kontrol (Start/Pause/Reset), dan indikator tugas yang sedang aktif.
* **Kolom Kanan (Lebar 55%):** Kartu To-Do List, form input tambah tugas di bagian atas, filter tab (*Semua*, *Belum*, *Selesai*), dan daftar tugas yang bisa di-*scroll*.

### Mobile View (Layar <= 768px)
Menggunakan sistem **1 Kolom Vertikal (Stacked)**:
* Kartu Pomodoro Timer berada di paling atas (dengan ukuran sedikit lebih ringkas).
* Kartu To-Do List berada tepat di bawahnya.

## 6. Detail Mikro-Interaksi & Animasi
* **Transisi Mode Timer:** Saat berpindah dari mode *Focus* ke *Break*, warna aksen utama perlahan bertransisi (`transition: all 0.4s ease`) dari nuansa *Bubblegum Pink* ke *Minty Matcha* atau *Soft Peach* agar pengguna merasakan pergantian suasana.
* **Progress Bar:** Garis waktu berbentuk kapsul di bawah angka timer yang terisi penuh secara bertahap seiring berjalannya waktu.