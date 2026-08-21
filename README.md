# Persona-Style Interactive Web Portfolio

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greenock)
![License](https://img.shields.io/badge/License-MIT-red)

> "Take Your Time." — Sebuah web portofolio interaktif dan imersif yang terinspirasi penuh dari estetika UI/UX serial game RPG Persona 5 (Atlus).

---

## Fitur Utama

- **Persona 5 Visual Styling**: Halftone background, diagonal dynamic banners, skewed badges, serta skema warna ikonik khas Persona.
- **Dynamic Screen Transitions**: Efek transisi antarhalaman yang dinamis dan lancar menggunakan GSAP Timeline lengkap dengan layar pemuat (loading overlay) beraksen teks Katakana (`ヨガタマ ダファ`).
- **Integrated Persona Audio Player**: Fitur pemutar musik floating interaktif berbasis gaya Battle Command Menu Persona 5 lengkap dengan soundtrack pilihan serial Persona.
- **Keyboard & Mouse Navigation**: Navigasi intuitif menggunakan tombol panah (`↑`, `↓`, `←`, `→`), `WASD`, `ENTER`, `ESC`, serta wheel scroll mouse.
- **Adaptive Desktop Scaler & Mobile Notice**: Fitur pendeteksi orientasi layar yang secara otomatis meminta pengguna di perangkat seluler untuk mengaktifkan mode fullscreen landscape demi kenyamanan antarmuka.
- **Live GitHub Integration**: Menampilkan repositori GitHub secara otomatis dan real-time melalui GitHub API pada halaman Projects.

---

## Stack Teknologi

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Native CSS Animation
- **Animation Engine**: [GSAP (GreenSock)](https://greensock.com/gsap/) & `@gsap/react`
- **Icon Pack**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## Struktur Direktori

```text
perdafos-persona_portofolio/
├── src/
│   ├── components/
│   │   ├── DesktopScaler.tsx      # Overlay pengunci orientasi landscape untuk mobile
│   │   ├── PersonaAudioPlayer.tsx # Pemutar musik gaya Battle Command Persona
│   │   └── TransitionOverlay.tsx  # Layar transisi GSAP + animasi Katakana
│   ├── config/
│   │   └── assets.ts              # Konfigurasi CDN & tautan media eksternal
│   ├── pages/
│   │   └── home/
│   │       ├── About.tsx          # Halaman informasi personal / Bio
│   │       ├── ContactMe.tsx      # Halaman formulir kontak & tautan sosial
│   │       ├── HomePage.tsx       # Menu utama portofolio
│   │       ├── Projects.tsx       # Integrasi GitHub Repositories
│   │       └── Skills.tsx         # Visualisasi skor keahlian / Tech Stack
│   ├── App.tsx                    # Routing bawaan & manajemen keadaan utama
│   ├── main.tsx                   # Entry point React
│   └── index.css                  # Konfigurasi Tailwind CSS & style global
├── package.json
├── vite.config.ts
└── README.md