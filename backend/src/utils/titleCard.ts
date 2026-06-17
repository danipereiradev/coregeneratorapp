import Jimp from 'jimp';
import { fileExists } from './cleanup.js';
import { getSkullAssetPath, OUTPUT_HEIGHT, OUTPUT_WIDTH } from './ffmpeg.js';

const SKULL_EMOJI = '💀';
const SKULL_GAP = 14;

function getTitleFontSize(text: string): number {
  if (text.length <= 18) return 64;
  if (text.length <= 30) return 48;
  return 36;
}

async function loadFont(fontSize: number) {
  if (fontSize >= 64) return Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  if (fontSize >= 48) return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
}

function splitTitleAndEmoji(titleText: string): { text: string; hasSkull: boolean } {
  const hasSkull = titleText.includes(SKULL_EMOJI);
  const text = titleText.replace(new RegExp(`\\s*${SKULL_EMOJI}\\s*$`), '').trimEnd();
  return { text, hasSkull };
}

async function renderTitleImage(
  titleText: string,
  background: number,
): Promise<Jimp> {
  const { text, hasSkull } = splitTitleAndEmoji(titleText);
  const fontSize = getTitleFontSize(titleText);
  const font = await loadFont(fontSize);

  const image = new Jimp(OUTPUT_WIDTH, OUTPUT_HEIGHT, background);
  const textWidth = Jimp.measureText(font, text);
  const textHeight = Jimp.measureTextHeight(font, text, OUTPUT_WIDTH - 80);

  let skullSize = 0;
  if (hasSkull) {
    skullSize = Math.round(fontSize * 1.15);
  }

  const totalWidth = textWidth + (hasSkull ? SKULL_GAP + skullSize : 0);
  const x = Math.max(40, Math.round((OUTPUT_WIDTH - totalWidth) / 2));
  const y = Math.max(40, Math.round((OUTPUT_HEIGHT - textHeight) / 2));

  image.print(font, x, y, text);

  if (hasSkull) {
    const skullPath = getSkullAssetPath();
    if (await fileExists(skullPath)) {
      const skull = await Jimp.read(skullPath);
      skull.resize(skullSize, skullSize);
      const skullY = y + Math.round((textHeight - skullSize) / 2);
      image.composite(skull, x + textWidth + SKULL_GAP, skullY);
    } else {
      console.warn('[titleCard] skull.png not found at', skullPath);
    }
  }

  return image;
}

export async function createTitleOverlayImage(
  titleText: string,
  outputPath: string,
): Promise<void> {
  const image = await renderTitleImage(titleText, 0x00000000);
  await image.writeAsync(outputPath);
}

export async function createTitleCardImage(
  titleText: string,
  outputPath: string,
): Promise<void> {
  const image = await renderTitleImage(titleText, 0x000000ff);
  await image.writeAsync(outputPath);
}
