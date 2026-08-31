import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import exifr from "exifr";
import { getImage } from "astro:assets";

export type Orientation = "portrait" | "landscape" | "square";

export interface GalleryPhoto {
  name: string;
  /** 一覧に出す縮小版（WebP） */
  thumb: string;
  /** 拡大表示に使う版（WebP）。原寸は配らない。 */
  full: string;
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

/**
 * 写真は src/assets 配下に置く。public だと astro:assets の対象外で、原寸が
 * そのまま配られる（移行直後はそうなっていて、一覧が 78MB あった）。
 */
const sources = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/photos/*.{jpg,jpeg,JPG,JPEG}",
  { eager: true },
);

const PHOTOS_DIR = "src/assets/photos";
const THUMB_WIDTH = 900;
const FULL_WIDTH = 2200;

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

  const photos = await Promise.all(
    Object.entries(sources)
      .map(([key, mod]) => ({ name: path.basename(key), image: mod.default }))
      .filter(({ name }) => name in meta)
      .map(async ({ name, image }) => {
        const e =
          ((await exifr
            .parse(path.resolve(PHOTOS_DIR, name), {
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

        const [thumb, full] = await Promise.all([
          getImage({ src: image, width: THUMB_WIDTH, format: "webp" }),
          getImage({ src: image, width: FULL_WIDTH, format: "webp" }),
        ]);

        return {
          name,
          thumb: thumb.src,
          full: full.src,
          description: meta[name]?.description ?? "",
          date: e.DateTimeOriginal
            ? new Date(e.DateTimeOriginal as string)
            : null,
          width: image.width,
          height: image.height,
          orientation: orientationOf(image.width, image.height),
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
