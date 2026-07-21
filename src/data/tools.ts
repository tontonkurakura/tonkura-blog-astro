export interface Tool {
  slug: string;
  name: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "nihss",
    name: "NIHSS",
    description:
      "NIH Stroke Scale による脳卒中の重症度評価。",
  },
  {
    slug: "hds-r",
    name: "HDS-R",
    description: "改訂 長谷川式簡易知能評価スケールによる認知機能評価。",
  },
  {
    slug: "mmse",
    name: "MMSE",
    description: "Mini-Mental State Examination による認知機能評価。",
  },
  {
    slug: "igg-index",
    name: "IgG Index",
    description:
      "髄液/血清 IgG 比とアルブミン比から血液脳関門機能と髄腔内 IgG 産生を評価。",
  },
];
