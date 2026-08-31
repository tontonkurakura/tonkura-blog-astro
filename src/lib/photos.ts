import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import exifr from "exifr";

export type Orientation = "portrait" | "landscape" | "square";

export interface GalleryPhoto {
  name: string;
  src: string;
  /** 撮影地。photos.yaml に人が書く。 */
  description: string;
  date: Date | null;
  width: number;
  height: number;
  orientation: Orientation;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
}

const IMAGES_DIR = "public/images";

/**
 * JPEG の SOF マーカーから縦横を読む。EXIF には入っていない（62枚とも
 * ExifImageWidth が無い）ので、ファイルのヘッダーを直接見る。
 */
function jpegSize(buf: Buffer): { width: number; height: number } | null {
  let i = 2; // SOI を飛ばす
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    const isSOF =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSOF) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
      i += 2;
      continue;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function orientationOf(width: number, height: number): Orientation {
  const r = width / height;
  if (r > 1.1) return "landscape";
  if (r < 0.9) return "portrait";
  return "square";
}

/** 1 秒以上はそのまま、それより短ければ分数で書く。 */
function shutter(t: number | undefined): string | undefined {
  if (!t) return undefined;
  return t >= 1 ? `${Number(t.toFixed(1))}s` : `1/${Math.round(1 / t)}`;
}

/**
 * ギャラリーの写真を撮影日の新しい順で返す。
 *
 * 説明文は photos.yaml（人が書く）、撮影データは JPEG そのもの（機械が持つ）と
 * 出どころを分けてある。写真を足したときに書き足すのは説明だけでよい。
 */
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const meta = (yaml.load(
    fs.readFileSync(path.resolve("src/data/photos.yaml"), "utf-8"),
  ) ?? {}) as Record<string, { description?: string } | null>;

  const dir = path.resolve(IMAGES_DIR);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .filter((f) => f in meta);

  const photos = await Promise.all(
    files.map(async (name) => {
      const file = path.join(dir, name);
      const head = fs.readFileSync(file);
      const size = jpegSize(head) ?? { width: 3, height: 2 };
      const e =
        ((await exifr
          .parse(file, {
            pick: [
              "DateTimeOriginal",
              "Model",
              "LensModel",
              "FocalLength",
              "FNumber",
              "ExposureTime",
              "ISO",
            ],
          })
          .catch(() => null)) as Record<string, unknown> | null) ?? {};

      return {
        name,
        src: `/images/${encodeURIComponent(name)}`,
        description: meta[name]?.description ?? "",
        date: e.DateTimeOriginal ? new Date(e.DateTimeOriginal as string) : null,
        width: size.width,
        height: size.height,
        orientation: orientationOf(size.width, size.height),
        camera: (e.Model as string) || undefined,
        lens: (e.LensModel as string) || undefined,
        focalLength: e.FocalLength ? `${e.FocalLength}mm` : undefined,
        aperture: e.FNumber ? `f/${e.FNumber}` : undefined,
        shutterSpeed: shutter(e.ExposureTime as number | undefined),
        iso: e.ISO ? `ISO ${e.ISO}` : undefined,
      } satisfies GalleryPhoto;
    }),
  );

  return photos.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
}
