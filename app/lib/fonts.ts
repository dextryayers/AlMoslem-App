// Font definitions using manual CSS import strategy
// This bypasses next/font/google to avoid Turbopack build errors
// Fonts are loaded via @import in app/globals.css

const createFontObj = (name: string, variable: string) => ({
  style: { fontFamily: name },
  variable: variable,
  className: variable // In this strategy, we don't use classNames for fonts, but keeping structure for compat
});

export const amiri = createFontObj('Amiri', '--font-amiri');
export const scheherazadeNew = createFontObj('Scheherazade New', '--font-scheherazade');
export const notoNaskhArabic = createFontObj('Noto Naskh Arabic', '--font-noto-naskh');
export const lateef = createFontObj('Lateef', '--font-lateef');
export const ibmPlexSansArabic = createFontObj('IBM Plex Sans Arabic', '--font-ibm-plex');
export const cairo = createFontObj('Cairo', '--font-cairo');
export const arefRuqaa = createFontObj('Aref Ruqaa', '--font-aref-ruqaa');
export const tajawal = createFontObj('Tajawal', '--font-tajawal');
export const reemKufi = createFontObj('Reem Kufi', '--font-reem-kufi');
export const elMessiri = createFontObj('El Messiri', '--font-el-messiri');

// Empty string because we don't need to inject classes into body
// Fonts are global via CSS import
export const fontVariables = '';

export const fontMap: Record<string, any> = {
  'Amiri': amiri,
  'Scheherazade New': scheherazadeNew,
  'Noto Naskh Arabic': notoNaskhArabic,
  'Lateef': lateef,
  'IBM Plex Sans Arabic': ibmPlexSansArabic,
  'Cairo': cairo,
  'Aref Ruqaa': arefRuqaa,
  'Tajawal': tajawal,
  'Reem Kufi': reemKufi,
  'El Messiri': elMessiri,
};

export const getFontFamily = (fontName: string) => {
    // Fallback for LPMQ Isep Misbah to Scheherazade New if not available
    // Scheherazade New is closer to traditional Indonesian manuscripts than Amiri
    if (fontName === 'LPMQ Isep Misbah') {
        return 'Scheherazade New';
    }
    return fontMap[fontName]?.style.fontFamily || 'Amiri';
};
