# Strategi SEO Al-Moslem (Ultimate Guide)

Dokumen ini berisi strategi SEO komprehensif untuk memastikan Al-Moslem mendominasi hasil pencarian Google dan muncul dalam ringkasan AI (seperti Google SGE, ChatGPT, dll).

## 1. Keyword Strategy (Kata Kunci Target)

Kami menargetkan kombinasi *Short-tail* (volume tinggi) dan *Long-tail* (niat spesifik) keywords.

### High Volume (Utama)
- "Al Quran Online"
- "Baca Quran Digital"
- "Terjemahan Al Quran Indonesia"
- "Tafsir Quran Kemenag"
- "Jadwal Sholat"

### Niche & Specific (Long-tail)
- "Baca surat Yasin latin dan terjemahan"
- "Ayat kursi mp3 merdu"
- "Doa harian muslim lengkap"
- "Hadits Arbain Nawawi terjemahan"
- "Tanya jawab islam AI gratis" (untuk fitur Ustaz AI)
- "Murottal 30 juz full offline"

## 2. Technical SEO (Implementasi Teknis)

Implementasi teknis berikut telah diterapkan pada codebase Next.js:

### A. Metadata Optimization (`app/layout.tsx`)
- **Title Tag Dinamis**: Menggunakan template `%s | Al-Moslem` untuk branding konsisten.
- **Meta Description**: Deskripsi 150-160 karakter yang mengandung keyword utama dan *Call-to-Action* (CTA).
- **Open Graph (OG) & Twitter Cards**: Memastikan link yang dibagikan di sosial media (WhatsApp, Twitter, FB) tampil menarik dengan gambar preview.
- **Canonical URLs**: Mencegah konten duplikat.
- **Robots.txt**: Mengarahkan bot crawler untuk mengindeks halaman penting dan menghindari halaman admin/private.

### B. Structured Data / Schema Markup (JSON-LD)
Kami menambahkan Schema.org untuk membantu Google memahami konteks website:
- **WebSite Schema**: Untuk memunculkan *Sitelinks Search Box*.
- **Organization Schema**: Membangun *Knowledge Graph* (Panel informasi di kanan hasil pencarian).
- **BreadcrumbList**: Membantu navigasi user dan bot di hasil pencarian.

### C. Sitemap XML (`app/sitemap.ts`)
Sitemap dinamis yang diperbarui secara otomatis mencakup:
- Halaman Statis (Home, Doa, Hadits, dll)
- Halaman Surat (1-114)
- Halaman Juz (1-30)
- Halaman Hadits (Detail)

### D. Performance (Core Web Vitals)
- **Next.js App Router**: Server-Side Rendering (SSR) untuk rendering konten HTML instan (sangat disukai Google Bot).
- **Image Optimization**: Penggunaan `next/image` untuk loading gambar cepat.
- **Lazy Loading**: Komponen berat dimuat belakangan.

## 3. Content Strategy (Strategi Konten)

Untuk memenangkan *AI Overviews* dan *Snippet*, konten harus:
1.  **Otoritatif & Akurat**: Menggunakan sumber Kemenag dan kitab hadits shahih.
2.  **Terstruktur**: Menggunakan Heading (H1, H2, H3) yang jelas.
3.  **Lengkap**: Menyediakan Arab, Latin, Terjemahan, dan Tafsir dalam satu tampilan.
4.  **Interaktif**: Fitur audio dan share image meningkatkan *Time on Site* (faktor ranking penting).

## 4. Rencana Backlink & Promosi

- **Social Signals**: Fitur "Share Image" (Quote Ayat) yang didesain viral untuk Instagram/WhatsApp Status akan mendatangkan traffic organik.
- **GitHub & Portfolio**: Link dari platform developer (high domain authority) meningkatkan kredibilitas.

## 5. Checklist Harian (Maintenance)
- [ ] Cek Google Search Console untuk error indexing.
- [ ] Monitor kecepatan loading page (PageSpeed Insights).
- [ ] Update konten doa/hadits secara berkala.
