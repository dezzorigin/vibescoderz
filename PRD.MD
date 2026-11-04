# Product Requirements Document (PRD)
**Nama Proyek:** PinkyFocus (Working Title)  
**Tipe Produk:** Aplikasi Web Produktivitas (To-Do List & Pomodoro Timer)  
**Target Platform:** Web Browser (Desktop & Mobile Responsive)  
**Versi:** 1.0 (MVP)

---

## 1. Ringkasan Produk
PinkyFocus adalah aplikasi web produktivitas yang menggabungkan pencatatan tugas harian (To-Do List) dan pengatur waktu fokus (Pomodoro Timer) dalam satu tampilan berkonsep *cute, pinky, dan cozy*. Aplikasi ini dirancang agar pengguna tidak merasa terintimidasi oleh daftar tugas yang menumpuk, melainkan merasa ditemani dalam suasana yang menyenangkan dan santai.

## 2. Masalah & Tujuan
* **Masalah:** Banyak aplikasi produktivitas memiliki tampilan yang terlalu kaku, membosankan, atau terlalu kompleks sehingga menurunkan motivasi pengguna yang menyukai estetika visual yang manis.
* **Tujuan:** Menyediakan ruang kerja digital yang simpel, instan (tanpa perlu login), dan memanjakan mata dengan estetika *pink pastel* untuk membantu pengguna menyelesaikan tugas fokus satu per satu.

## 3. Fitur Utama (Core Features - MVP)

### 3.1. Pomodoro Timer
* **Tiga Mode Waktu:**
  * *Focus Time*: Default 25 menit.
  * *Short Break*: Default 5 menit.
  * *Long Break*: Default 15 menit (otomatis disarankan setelah 4 sesi fokus selesai).
* **Kontrol Timer:** Tombol Start, Pause, dan Reset.
* **Kustomisasi Durasi:** Pengaturan singkat untuk mengubah durasi menit sesuai preferensi pengguna.
* **Indikator Sesi:** Penanda visual berupa ikon hati atau stroberi kecil yang bertambah setiap kali menyelesaikan 1 sesi fokus.
* **Notifikasi Suara & Visual:** Efek suara yang lembut/lucu (*chime/bell*) saat waktu habis, ditambah perubahan judul tab browser (misal: `(05:12) Fokus yuk!`).

### 3.2. To-Do List Terintegrasi
* **CRUD Tugas:** Tambah tugas baru, tandai selesai (checkbox), edit teks tugas, dan hapus tugas.
* **Kategori/Tag Sederhana:** Label warna pastel (misal: *Kuliah*, *Kerja*, *Pribadi*).
* **Estimasi Pomodoro:** Pengguna bisa menentukan target berapa sesi Pomodoro yang dibutuhkan untuk satu tugas (misal: `0/3 sesi`).
* **Integrasi Aktif:** Pengguna bisa mengklik salah satu tugas untuk menjadikannya **"Tugas Aktif"** yang sedang dikerjakan di bawah layar Timer.

### 3.3. Fitur Pendukung (Cute Enhancers)
* **Teman Fokus (Mini Mascot/Status):** Ilustrasi atau ikon dinamis yang berubah ekspresi sesuai status timer (sedang fokus belajar, sedang istirahat minum teh, atau selesai tugas).
* **Suara Latar (Ambient Sound):** Tombol toggle sederhana untuk memutar suara latar penenang (seperti *Rain*, *Lo-Fi Beats*, atau *Cafe Ambience*).
* **Sapaan & Quotes Harian:** Teks penyemangat singkat yang berganti secara acak setiap kali halaman dibuka.

## 4. Alur Pengguna (User Flow)
1. Pengguna membuka website dan langsung disambut tampilan utama (Timer di sisi kiri/atas, To-Do List di sisi kanan/bawah).
2. Pengguna mengetik daftar tugas di kolom To-Do List dan menentukan estimasi sesi Pomodoro.
3. Pengguna memilih satu tugas untuk dikerjakan, sehingga tugas tersebut tampil di area fokus utama.
4. Pengguna menekan tombol **Start** pada Pomodoro Timer. Maskot berubah ke mode "Fokus".
5. Saat waktu habis, terdengar bunyi notifikasi lucu, jumlah sesi pada tugas aktif bertambah `+1`, dan mode otomatis berpindah ke *Short Break*.
6. Jika tugas sudah beres, pengguna mencentang tugas tersebut (muncul animasi *confetti* kecil warna pink).

## 5. Spesifikasi Teknis
* **Frontend:** HTML5, CSS3 (Vanilla CSS dengan CSS Variables atau Tailwind CSS), Vanilla JavaScript (ES6+).
* **Penyimpanan Data:** `window.localStorage` (menyimpan daftar tugas, riwayat sesi hari ini, dan preferensi durasi timer agar tidak hilang saat di-*refresh*).
* **Aset Eksternal:** Google Fonts, Lucide Icons / Phosphor Icons (gaya *rounded*), file audio `.mp3` ringan untuk alarm dan *ambient sound*.

## 6. Pengembangan Selanjutnya (Future Scope - v2.0)
* Statistik mingguan (grafik jumlah fokus dalam seminggu).
* Pilihan tema warna (*Sakura Pink*, *Peach Coral*, *Lavender Milk*).
* Sinkronisasi akun (Cloud Database) agar bisa diakses lintas perangkat.