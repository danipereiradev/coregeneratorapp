import Jimp from 'jimp';
import { OUTPUT_HEIGHT, OUTPUT_WIDTH } from './ffmpeg.js';

export const BRAND_ACCENT_RGB = { r: 124, g: 92, b: 255 };
const BRANDING_SCALE = 4;
const TITLE_SCALE = 1.5;

function getTitleFontSize(text: string): number {
  if (text.length <= 18) return 64;
  if (text.length <= 30) return 48;
  return 36;
}

function getBrandingFontSize(text: string): number {
  if (text.length <= 28) return 48;
  return 36;
}

async function loadFont(fontSize: number) {
  if (fontSize >= 64) return Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  if (fontSize >= 48) return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
}

function tintOpaquePixels(image: Jimp, color: { r: number; g: number; b: number }): void {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function scan(_x, _y, idx) {
    const alpha = this.bitmap.data[idx + 3];
    if (alpha > 0) {
      this.bitmap.data[idx] = color.r;
      this.bitmap.data[idx + 1] = color.g;
      this.bitmap.data[idx + 2] = color.b;
    }
  });
}

async function renderTextLayer(
  text: string,
  fontSize: number,
  color: { r: number; g: number; b: number },
): Promise<Jimp> {
  const font = await loadFont(fontSize);
  const maxTextWidth = OUTPUT_WIDTH - 80;
  const textWidth = Jimp.measureText(font, text);
  const textHeight = Jimp.measureTextHeight(font, text, maxTextWidth);
  const shadowOffset = 4;
  const pad = 8;
  const layerW = textWidth + pad * 2 + shadowOffset;
  const layerH = textHeight + pad * 2 + shadowOffset;

  const layer = new Jimp(layerW, layerH, 0x00000000);
  const textX = pad;
  const textY = pad;

  const shadow = new Jimp(layerW, layerH, 0x00000000);
  shadow.print(font, textX + shadowOffset, textY + shadowOffset, text);
  tintOpaquePixels(shadow, { r: 0, g: 0, b: 0 });
  shadow.blur(3);
  layer.composite(shadow, 0, 0);

  const textLayer = new Jimp(layerW, layerH, 0x00000000);
  textLayer.print(font, textX, textY, text);
  tintOpaquePixels(textLayer, color);
  layer.composite(textLayer, 0, 0);

  return layer;
}

async function renderCenteredText(
  text: string,
  fontSize: number,
  color: { r: number; g: number; b: number },
  scaleFactor = 1,
): Promise<Jimp> {
  let layer = await renderTextLayer(text, fontSize, color);

  if (scaleFactor !== 1) {
    layer = layer.resize(
      Math.round(layer.bitmap.width * scaleFactor),
      Math.round(layer.bitmap.height * scaleFactor),
      Jimp.RESIZE_BILINEAR,
    );
  }

  const image = new Jimp(OUTPUT_WIDTH, OUTPUT_HEIGHT, 0x00000000);
  const x = Math.max(0, Math.round((OUTPUT_WIDTH - layer.bitmap.width) / 2));
  const y = Math.max(0, Math.round((OUTPUT_HEIGHT - layer.bitmap.height) / 2));
  image.composite(layer, x, y);

  return image;
}

export async function createTitleOverlayImage(
  titleText: string,
  outputPath: string,
): Promise<void> {
  const fontSize = getTitleFontSize(titleText);
  const image = await renderCenteredText(
    titleText,
    fontSize,
    { r: 255, g: 255, b: 255 },
    TITLE_SCALE,
  );
  await image.writeAsync(outputPath);
}

export async function createBrandingOverlayImage(
  brandingText: string,
  outputPath: string,
): Promise<void> {
  const fontSize = getBrandingFontSize(brandingText);
  const image = await renderCenteredText(
    brandingText,
    fontSize,
    BRAND_ACCENT_RGB,
    BRANDING_SCALE,
  );
  await image.writeAsync(outputPath);
}
