#!/bin/zsh
# 生成个人网站首屏参考图 — 3 个方向，codex imagegen
# 用法: zsh gen_refs.sh   (幂等: 已存在的 png 跳过)
set -u
cd "$(dirname "$0")"
mkdir -p refs

gen() {
  local name="$1" prompt="$2"
  if [[ -s "refs/$name.png" ]]; then
    echo "[skip] $name 已存在"
    return
  fi
  echo "[gen ] $name ..."
  codex exec --sandbox workspace-write \
    "Use your image generation tool to create one image: ${prompt} --- Then copy the generated PNG from your generated-images cache into the current working directory with the exact filename 'refs/${name}.png'." \
    >/dev/null 2>&1 </dev/null
  if [[ -s "refs/$name.png" ]]; then echo "[done] $name"; else echo "[FAIL] $name"; fi
}

COMMON="Full-bleed desktop website hero section design mockup, wide 16:9 landscape framing, realistic high-fidelity web UI screenshot as if captured in a browser at 1440px width, clean modern personal-brand homepage, generous spacing, crisp typography, pixel-perfect, no browser chrome, no cursor, professional web design portfolio quality."

# ---------- 方向 A: 暗调科技 / 终端感 ----------
gen "A_dark_tech" "${COMMON} STYLE: dark techy terminal aesthetic. Near-black background (#0a0b0f) with very subtle fine glowing grid lines. A circular avatar of a stylised anime character with electric-blue and orange neon split lighting glowing on the right side. Left side huge bold sans-serif headline in white reading 'Sac', below it a thinner Chinese tagline line '探索00后的财富自由之路 · 探索AI的边际与商业应用'. Electric blue (#3b82f6) and warm orange (#ff6b2c) accent colors only. Monospace code-style small labels, a glowing pill button '关注 X' and a ghost button '加入 TG 社群'. A small stat '25K followers' in mono. Thin neon divider line. Subtle scanline / code motif. Sophisticated, not cluttered."

# ---------- 方向 B: 明亮编辑杂志感 ----------
gen "B_bright_editorial" "${COMMON} STYLE: bright editorial magazine aesthetic. Warm off-white paper background (#f7f5f0). Large elegant serif display headline 'Sac' in near-black ink, paired with a refined Chinese tagline '探索00后的财富自由之路，探索AI的边际与商业应用'. Strong typographic hierarchy, big margins, thin hairline rules separating zones, small numbered labels like '01 / About'. One restrained accent color (deep ink black plus a single warm terracotta orange). A circular avatar photo placed with editorial asymmetry. Calm, premium, content-creator vibe, lots of whitespace, NOT a blocky card grid — organized by thin lines."

# ---------- 方向 C: 高对比大胆海报感 ----------
gen "C_bold_poster" "${COMMON} STYLE: bold high-contrast poster aesthetic. Dramatic color blocking, oversized condensed display typography, the name 'Sac' set extremely large filling much of the screen, diagonal slanted divider creating dynamic energy. A huge number '25K' as a graphic element. Electric blue and vivid orange clashing against deep black, plus one accent magenta. Chinese tagline '探索AI的边际与商业应用' in a bold strip. The neon anime avatar integrated into a slanted color block. Energetic, memorable, confident, magazine-cover impact."

echo "ALL DONE"
ls -la refs/