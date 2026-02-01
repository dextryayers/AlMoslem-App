import * as fabric from 'fabric';

/**
 * Loads an image into a Fabric.js Image object.
 * Handles both local paths and remote URLs.
 */
export const loadFabricImage = async (url: string): Promise<fabric.Image> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous'; // Crucial for exporting canvas
    img.onload = () => {
      const fabricImg = new fabric.Image(img);
      resolve(fabricImg);
    };
    img.onerror = (e) => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });
};

/**
 * Adds a watermark to the canvas.
 * @param canvas The Fabric canvas instance.
 * @param text The text to display in the watermark.
 * @param logoSource The path to the logo image OR a preloaded fabric.Image object.
 * @param options Options for positioning and styling.
 */
export const addWatermark = async (
  canvas: fabric.Canvas,
  text: string,
  logoSource: string | fabric.Image | null,
  options: {
    width: number;
    height: number;
    padding?: number;
    logoHeight?: number;
    fontSize?: number;
  }
) => {
  try {
    const { width, height, padding = 40, logoHeight = 50, fontSize = 20 } = options;
    
    // Calculate scaling based on canvas width (assuming 1080px base)
    const baseScale = Math.min(width, height) / 1080;
    
    const scaledPadding = padding * baseScale;
    const scaledLogoHeight = logoHeight * baseScale;
    const scaledFontSize = fontSize * baseScale;

    // Load Logo
    let logoImg: fabric.Image | null = null;
    
    if (logoSource instanceof fabric.Image) {
        // Clone the preloaded image so we don't modify the original reference
        logoImg = await logoSource.clone();
    } else if (typeof logoSource === 'string') {
        try {
            logoImg = await loadFabricImage(logoSource);
        } catch (e) {
            console.error("Watermark logo failed to load, falling back to text only", e);
        }
    }


    const wmGroupItems: fabric.Object[] = [];
    let currentLeft = scaledPadding;
    const bottomPos = height - scaledPadding; // Bottom baseline

    if (logoImg) {
        const scaleFactor = scaledLogoHeight / (logoImg.height || 1);
        
        logoImg.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            originX: 'left',
            originY: 'bottom', // Align to bottom
            left: currentLeft,
            top: bottomPos,
            opacity: 1,
            shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 0, offsetY: 2 }),
            selectable: false,
            evented: false,
        });
        
        // Add to canvas directly
        canvas.add(logoImg);
        currentLeft += (logoImg.getScaledWidth() + (15 * baseScale));
    }

    // Add Text
    const wmText = new fabric.Text(text, {
        fontSize: scaledFontSize,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fill: '#ffffff',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.8)', blur: 4, offsetX: 0, offsetY: 1 }),
        originX: 'left',
        originY: 'bottom', // Align to bottom
        left: currentLeft,
        top: bottomPos - (logoImg ? (scaledLogoHeight * 0.15) : 0), // Slight adjustment to align visually with text baseline vs logo
        opacity: 0.9,
        selectable: false,
        evented: false,
    });

    canvas.add(wmText);
    
    // Ensure they are on top
    if (logoImg) canvas.bringObjectToFront(logoImg);
    canvas.bringObjectToFront(wmText);
    
    canvas.renderAll();
    console.log("Watermark added via utility");

  } catch (error) {
    console.error("Error adding watermark:", error);
  }
};
