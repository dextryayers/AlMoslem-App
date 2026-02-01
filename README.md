# 📖 The Holy Qur'an Digital Platform

A comprehensive, modern digital Al-Qur'an application designed to empower spiritual growth and creative Dawah. Featuring a state-of-the-art **Poster Builder**, extensive Hadith collections, and intelligent AI integration, this platform leverages the latest web technologies to deliver a seamless and performant user experience.

![Banner](https://img.shields.io/badge/Status-Active_Development-green?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Key Features

### 1. 🕌 Digital Al-Qur'an
-   **Immersive Reading Experience**: A clean, distraction-free interface for reading the Holy Qur'an.
-   **Translation & Tafsir**: Multi-language translations and in-depth Tafsir to understand the divine message.
-   **Audio Recitation**: High-quality Murottal audio playback from renowned Qaris.

### 2. 🎨 Creative Dawah Studio (Poster Builder)
A powerful tool designed for content creators to spread the message of Islam visually.
-   **Interactive Canvas**: Built on `Fabric.js v7`, offering smooth manipulation of text, images, and shapes.
-   **Fully Responsive**: Optimized mobile experience with a smart **floating sidebar** and **bottom sheet property panel** for on-the-go editing.
-   **Advanced Customization**: Full control over fonts, colors, opacity, shadows, layering, and more.
-   **High-Quality Export**: Export your designs in high-resolution PNG/JPG formats, ready for social media sharing.

### 3. 📚 Hadith Collection
-   **Extensive Library**: Access thousands of authentic Hadiths from major narrators (Bukhari, Muslim, etc.).
-   **Smart Search**: Easily find specific topics or narrations with robust filtering and search capabilities.

### 4. 🤖 AI Companion (Gemini Integration)
-   **Smart Islamic Assistant**: Ask questions about Islamic topics and receive intelligent, context-aware answers powered by Google Gemini AI.
-   **Content Assistance**: Get help with drafting Dawah content, summarizing Tafsir, or finding relevant verses.

---

## 🛠️ Tech Stack

This project is architected using a modern, scalable JavaScript/TypeScript ecosystem:

| Category | Technology |
| :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61DAFB) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Shadcn/UI](https://img.shields.io/badge/Shadcn_UI-000000?style=flat-square&logo=shadcnui&logoColor=white) |
| **Graphics** | ![Fabric.js](https://img.shields.io/badge/Fabric.js_v6-E31C5F?style=flat-square&logo=fabric.js&logoColor=white) ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white) |
| **AI** | ![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google&logoColor=white) |
| **Auth** | ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-black?style=flat-square&logo=next.js&logoColor=white) |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide_Icons-F7931A?style=flat-square&logo=lucide&logoColor=white) |

---

## 🚀 Installation Guide

Follow these steps to set up the project locally on your machine:

### Prerequisites
-   **Node.js** (Version 18+ recommended)
-   **NPM**, **Yarn**, or **PNPM** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/username/qquran.git
cd qquran
```

### 2. Install Dependencies
Install the required packages using your preferred package manager:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
GOOGLE_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start the Development Server
Launch the application in development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

A quick overview of the top-level directory structure:

```
.
├── app/                # App Router Next.js (Pages, Layouts, & API)
│   ├── build-poster/   # Poster Builder Module (Fabric.js logic)
│   ├── hadist/         # Hadith Collection Pages
│   └── api/            # Server-side API Routes
├── components/         # Reusable React Components
│   ├── ui/             # Shadcn UI Base Components
│   └── ...             # Custom Components
├── public/             # Static Assets (Images, Fonts, Icons)
├── lib/                # Utility Functions, Hooks, & Helpers
└── types/              # TypeScript Type Definitions
```

## 🤝 Contribution

We welcome contributions from the community! Whether it's a bug fix, a new feature, or documentation improvement, your help is appreciated.

1.  **Fork** the repository.
2.  Create a new **Branch** for your feature (`git checkout -b feature/amazing-feature`).
3.  **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/amazing-feature`).
5.  Open a **Pull Request**.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

Built with ❤️ by Hanif
