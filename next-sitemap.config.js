const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://almoslem.haniipp.space',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'], // If we use server-side sitemap
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/private/', '/admin/'] },
    ],
    additionalSitemaps: [
      // 'https://almoslem.haniipp.space/server-sitemap.xml', // If we have one
    ],
  },
  // Generate dynamic paths
  additionalPaths: async (config) => {
    const result = [];
    const now = new Date().toISOString();

    // 1. Surah Routes (1-114)
    // We can fetch from API or use local data. Using local data is faster for build.
    try {
      const filePath = path.join(__dirname, 'app/data/surah-list.json');
      const surahList = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      surahList.forEach((surah) => {
        result.push({
          loc: `/surah/${surah.nomor}`,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: now,
        });
      });
    } catch (e) {
      console.warn('Could not load surah-list.json for sitemap generation', e);
      // Fallback: 1-114 loop
      for (let i = 1; i <= 114; i++) {
        result.push({
          loc: `/surah/${i}`,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: now,
        });
      }
    }

    // 2. Juz Routes (1-30)
    for (let i = 1; i <= 30; i++) {
      result.push({
        loc: `/juz/${i}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: now,
      });
    }

    // 3. Hadith Books
    const hadithBooks = ['nawawi', 'qudsi', 'aladab'];
    hadithBooks.forEach((bookId) => {
      result.push({
        loc: `/hadist/${bookId}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: now,
      });
    });

    // 4. Place Routes
    const places = ['makkiyyah', 'madaniyyah'];
    places.forEach((place) => {
      result.push({
        loc: `/place/${place}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: now,
      });
    });

    // 5. Important Pages (Override priority)
    const importantPages = [
      { loc: '/peta-situs', priority: 0.8 },
      { loc: '/doa', priority: 0.8 },
      { loc: '/hadist', priority: 0.8 },
      { loc: '/urutan-wahyu', priority: 0.8 },
      { loc: '/jadwalsolat', priority: 0.8 },
      { loc: '/ust-ai', priority: 0.9 }, // High priority for AI feature
      { loc: '/preview-img', priority: 0.8 },
      { loc: '/about', priority: 0.7 },
      { loc: '/donation', priority: 0.7 },
      { loc: '/profile', priority: 0.6 },
      { loc: '/setting', priority: 0.6 },
    ];

    importantPages.forEach(page => {
      result.push({
        loc: page.loc,
        changefreq: 'monthly',
        priority: page.priority,
        lastmod: now,
      });
    });

    return result;
  },
}
