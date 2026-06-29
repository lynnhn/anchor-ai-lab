#!/bin/zsh
# Sac 个人站 hero 参考图 — 深调干净 · 写拍造三件套 · 两个视角
# 用法: zsh gen_hero.sh  (幂等: 已存在跳过)
set -u
cd "$(dirname "$0")"
mkdir -p refs

gen() {
  local name="$1" prompt="$2"
  if [[ -s "refs/$name.png" ]]; then echo "[skip] $name"; return; fi
  echo "[gen ] $name ..."
  codex exec --sandbox workspace-write \
    "Use your image generation tool to create one image: ${prompt} --- Then copy the generated PNG from your generated-images cache into the current working directory with the exact filename 'refs/${name}.png'." \
    >/dev/null 2>&1 </dev/null
  if [[ -s "refs/$name.png" ]]; then echo "[done] $name"; else echo "[FAIL] $name"; fi
}

COMMON="Full-bleed desktop website hero section, wide 16:9 landscape, realistic high-fidelity web UI screenshot captured in a browser at 1440px, NO browser chrome, NO cursor. AESTHETIC: dark but CLEAN and premium, deep charcoal / near-black blue background (#0e1014) with one soft radial light, very generous negative space, minimal, sophisticated, restrained — absolutely NOT busy or cluttered, magazine-grade. A sticky top navigation bar with subtle glass blur: left a small 'Sac' logo, center tiny menu links '关于 · 内容 · 联系', right a small pill button '关注 X'. Centered hero: a small circular avatar chip, a very large light-gradient wordmark 'Sac', and below a refined two-line Chinese tagline '探索00后的财富自由之路 · 探索AI的边际与商业应用'. Electric-blue (#3b82f6) and warm-orange (#ff6b2c) neon accents used ONLY as small glints (screen glow, a camera tally light), surfaces stay neutral dark to keep it clean. Thin hairline as a structural divider. Small monospace labels. Three signature objects represent a young AI-media creator's toolkit, each with a tiny caption: an open MacBook laptop with a dark code-editor / terminal screen (caption '造'), an open paper notebook with handwritten idea sketches (caption '写'), and a Sony-style cinema camera (caption '拍'). Pixel-perfect, elegant, high craft."

# ---- 方向①: 3/4 斜角悬浮 ----
gen "hero_v1_iso" "${COMMON} OBJECT LAYOUT: the three objects float in a row in a gentle 3/4 isometric perspective with soft realistic drop shadows, hovering just above a single thin glowing horizontal line, evenly spaced, laptop in the center slightly larger. Airy, floating, dynamic yet clean."

# ---- 方向②: 正面平视 ----
gen "hero_v2_front" "${COMMON} OBJECT LAYOUT: the three objects rest on a single thin horizontal shelf / desk edge, viewed straight-on at eye level, perfectly aligned, lots of empty space above and below, extremely minimal and calm, product-shot lighting."

echo "ALL DONE"; ls -la refs/