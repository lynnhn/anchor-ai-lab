---
title: "feat: Sac 工作台落地页(头像翻转 + 三件套交互 hero)"
status: active
date: 2026-06-27
type: feat
direction: workstation (全新方向,独立于 editorial-manifesto)
---

# feat: Sac 工作台落地页 — 头像翻转 + 三件套交互 Hero

**Target dir:** `design/personal website/workstation/`(全新方向,与 `editorial-manifesto/` 无关)
**Tech:** Vite + 原生 HTML/CSS/JS + GSAP
**素材方案:** A 分层(空桌面背景图 + 3 张透明 PNG + 头像)

---

## Summary

做一个「创作者工作台」交互落地页首屏:深色 premium 桌面上摆放电脑 / 笔记本 / 相机三件套,每件可 hover(抬起+发光+tooltip)、可点击(滚动到对应区块)。桌面上的头像区以**网格翻牌动画**从黑色面板错峰翻转、揭示出 Sac 的 neon 头像。配 顶部导航 + 大字 Sac + slogan + 双 CTA(查看内容 ↓ / 联系我)。本期聚焦 **hero + 交互 + 翻转动画**;下游区块(项目/视频/文章/联系)先做占位锚点,保证点击有落点。

## Problem Frame

- 这是 Sac 个人站的一个**全新方向**(交互工作台),独立建在 `workstation/`,不复用 editorial-manifesto。
- 核心体验在首屏:翻牌揭示头像 + 三件套 hover/点击。要达到 dawood.works 那种"物件可交互、会动"的质感,但用 2D 分层 + CSS/GSAP 实现(dawood 本身就是 2D + 交互,非 3D)。
- 素材(空桌面 + 3 件透明 PNG)由用户自行生成(高度自定义、高保真);本计划负责代码还原 + 交互 + 动画 + 全页骨架。

## Scope Boundaries

**In scope**
- `workstation/` 新项目脚手架(Vite + GSAP)
- Hero:分层合成(桌面背景 + 三件透明 PNG + 头像翻转区 + UI 层)
- 头像翻牌揭示动画
- 三件套 hover(抬起/发光/tooltip 造·写·拍)+ 点击(平滑滚动到锚点)
- 顶部导航 + Sac + slogan + 双 CTA
- 鼠标视差、响应式(桌面/平板/手机)、`prefers-reduced-motion` 降级
- 下游区块占位锚点(#projects / #videos / #articles / #contact)

### Deferred to Follow-Up Work
- 项目/视频/文章区块的真实内容与版式(本期仅占位锚点)
- 4 篇精选文章的真实数据接入(标题已在 memory:personal-website-sac)
- 平台矩阵、Contact 完整区块
- 可选升级:真 3D(Three.js)版本的物件

---

## Key Technical Decisions

### KTD1 — 分层合成(A 方案)
背景=空桌面图(含光池/暗角/反光,**不含**物件、头像、文字);三件套=透明 PNG 各一层,可独立 hover 位移;头像=翻转动画层;文字/导航/CTA/tooltip=代码。
**素材一致性**:用户**从同一张母图派生**——先出完整场景母图,再 ①擦掉物件得空桌面 ②抠出每个物件透明 PNG。保证角度/光照/透视一致。
**接触阴影**:每个物件的落影用 CSS(`filter: drop-shadow` 或下方镜像渐变)动态生成,hover 时阴影加深/位移,不烤进 PNG。

### KTD2 — 翻牌动画:CSS Grid + 3D transform,GSAP 控错峰
头像切 N×N(默认 12×12=144)网格;每格双面块(正=黑,背=头像切片,`background-position` 定位);`rotateY(180deg)` 翻转,GSAP `stagger`(对角/径向/随机可配)控制错峰;`IntersectionObserver` 进视口触发,可 hover/点击重播。性能:仅动 transform(GPU 合成),144 格稳。

### KTD3 — Vite + 原生 + GSAP
单页落地页,Vite 提供 dev server/HMR/构建;GSAP 负责翻牌 stagger、hover 时间线、滚动/视差。无框架,和既有 wukong/sphere-gallery 一贯。

### KTD4 — 动效降级
`prefers-reduced-motion: reduce` 时:翻牌直接淡入定格为头像、关闭视差、hover 改为即时态;保证可用与无障碍。

---

## Asset Requirements(用户产出,代码集成)

统一规范:同一母图派生、3/4 略俯视一致、主光左上、长边 ≥2000px。

| 素材 | 文件 | 说明 |
|---|---|---|
| 空桌面背景 | `assets/desk-bg.png/webp` | premium 深色台面 + 光池 + 暗角 + 反光;**不含**物件/头像/文字,头像位留空桌面 |
| 电脑(造) | `assets/laptop.png` | 透明,屏可亮 Claude Code(或留深屏由代码叠) |
| 笔记本(写) | `assets/notebook.png` | 透明,摊开页 |
| 相机(拍) | `assets/camera.png` | 透明,日常 vlog 摄像级 |
| 头像 | `assets/avatar.jpg` | 已有(400×400),喂翻牌动画 |

> 素材未到位前用占位图(纯色块/现有 refs)搭建,到位后直接替换(文件名约定好即可零改代码)。

---

## Implementation Units

### U1. 项目脚手架 + 设计令牌
**Goal:** 在 `workstation/` 建 Vite 工程,接入 GSAP,建立 CSS 令牌与基础。
**Files:** `workstation/package.json`, `workstation/vite.config.js`, `workstation/index.html`, `workstation/css/tokens.css`, `workstation/css/base.css`, `workstation/js/main.js`, `workstation/assets/`(占位)
**Approach:** Vite 原生模板;`tokens.css` 定义配色(深色台面、蓝橙 neon accent、橙 #D97757)、字体、间距、层级 z-index;`base.css` reset + 布局基础;装 `gsap`。
**Test/验证:** `npm run dev` 起 server,空白页无报错;GSAP 能 import。
**Test expectation:** 脚手架单元,无行为逻辑——仅验证可启动、无控制台错误。

### U2. Hero 静态合成 + 响应式骨架
**Goal:** 把分层合成搭出来(无交互):桌面背景 + 三件套定位(三角布局) + 导航 + Sac/slogan/双 CTA + 头像区占位。
**Dependencies:** U1
**Files:** `workstation/index.html`, `workstation/css/hero.css`, `workstation/css/nav.css`
**Approach:** 绝对定位分层(z-index:背景<头像区<物件<UI);物件用百分比定位成三角;CSS `drop-shadow` 做接触阴影;导航 sticky + 毛玻璃;CTA 真按钮(主「查看内容 ↓」实心橙、次「联系我」ghost);桌面/平板/手机三档(手机三件套竖排堆叠)。
**Patterns to follow:** core.md 口味护栏(结构用线、单一强调色、明亮≠不史诗)。
**Test scenarios:**
- 1440 / 768 / 390 三宽下:导航、Sac/slogan、双 CTA、三件套、头像区都在合理位置不重叠。
- 物件有可见接触阴影,层级正确(UI 在最上)。
- 占位素材替换为真实素材后无需改布局代码(仅换文件)。
**Verification:** preview 截图三档宽度,目视构图与 hero 参考图一致。

### U3. 头像翻牌揭示动画
**Goal:** 头像区从黑色网格面板错峰翻转、揭示 neon 头像。
**Dependencies:** U2
**Files:** `workstation/js/flip-reveal.js`, `workstation/css/flip.css`
**Approach:** JS 生成 12×12 翻转块(每格 `--r/--c`,背面 `background-position` 切片);GSAP `stagger`(对角/径向/随机三种,先用对角)触发 `rotateY(180deg)`;`IntersectionObserver` 进视口播放;暴露重播接口(供 hover/点击)。`prefers-reduced-motion` 时淡入定格。
**Technical design(方向性):** 见 KTD2 骨架。
**Test scenarios:**
- 首次进视口:全黑 → 错峰翻转 → 定格为完整头像(切片对齐无错位/缝隙)。
- 网格数可配(改 12 → 16 不破布局)。
- `prefers-reduced-motion: reduce`:跳过翻转,直接淡入头像。
- 重播接口可再次触发动画。
**Verification:** preview 录制/逐帧看翻转波浪;切换 reduced-motion 媒体特性验证降级。

### U4. 三件套 hover 交互
**Goal:** hover 物件 → 抬起 + 发光 + tooltip(造/写/拍)。
**Dependencies:** U2
**Files:** `workstation/js/interactions.js`, `workstation/css/objects.css`
**Approach:** 每个物件 GSAP 时间线:`y` 上移 + `scale` 微增 + 阴影加深 + neon 描边/外发光 + tooltip 淡入(造=电脑/写=笔记本/拍=相机);移出还原;键盘可聚焦(无障碍)。
**Test scenarios:**
- hover 电脑/笔记本/相机:各自抬起、发光、显示正确 tooltip(造/写/拍)。
- 移出:平滑还原,无残留态。
- 键盘 Tab 聚焦物件:同样触发可见态(focus-visible)。
- reduced-motion:hover 改为即时描边/ tooltip,无位移动画。
**Verification:** preview 模拟 hover/focus,截图三态(默认/hover/focus)。

### U5. 点击导航 + 平滑滚动
**Goal:** 点击物件与 CTA → 平滑滚动到对应锚点。
**Dependencies:** U2, U4, U6
**Files:** `workstation/js/interactions.js`, `workstation/js/main.js`
**Approach:** 电脑→`#projects`、相机→`#videos`、笔记本→`#articles`;主 CTA「查看内容 ↓」→`#projects`(或内容首屏)、次 CTA「联系我」→`#contact`;导航链接同理;GSAP ScrollTo 或原生 `scrollIntoView({behavior:smooth})`;点击有轻微按下反馈。
**Test scenarios:**
- 点电脑/相机/笔记本:分别滚到 #projects / #videos / #articles。
- 点双 CTA、导航项:滚到正确锚点。
- 锚点不存在时不报错(优雅降级)。
- 键盘 Enter 在聚焦物件上等效点击。
**Verification:** preview 点击各目标,确认滚动落点正确。

### U6. 下游占位区块 + 锚点
**Goal:** 建 #projects / #videos / #articles / #contact 占位区块,让点击有落点。
**Dependencies:** U1
**Files:** `workstation/index.html`, `workstation/css/sections.css`
**Approach:** 每区块一个带标题的占位(项目/视频/文章/联系),留 `id`;文章区可先列 memory 中 4 篇精选标题做占位;明确标注「敬请期待」处。保持与 hero 同一配色系统。
**Test scenarios:**
- 四个锚点存在且可被 U5 滚动命中。
- 占位区块响应式不破版。
**Test expectation:** 占位单元,行为以 U5 滚动覆盖;本单元仅验证锚点存在与基本版式。

### U7. 视差 + 收尾打磨
**Goal:** 鼠标移动轻微视差、整体动效节奏与无障碍收尾。
**Dependencies:** U2, U3, U4
**Files:** `workstation/js/parallax.js`, `workstation/css/base.css`
**Approach:** 鼠标移动 → 背景/物件/头像层做微小反向位移(景深感),GSAP `quickTo` 平滑;限制幅度避免眩晕;`prefers-reduced-motion` 全关;移动端关视差。
**Test scenarios:**
- 桌面鼠标移动:各层轻微视差,幅度克制不抖。
- reduced-motion / 触屏:视差关闭。
**Verification:** preview 移动鼠标观察层次位移;切换 reduced-motion 验证关闭。

---

## Risks & Dependencies

- **素材一致性(高)**:三件 PNG + 空桌面若非同母图派生,合成会"贴上去"感。缓解:KTD1 派生流程 + 代码统一接触阴影/色调微调滤镜。
- **翻牌切片对齐**:`background-position`/`background-size` 百分比在非正方头像或高 DPI 下易错位。缓解:头像用正方(已是 400×400),切片用 `calc(var(--c)*-100%/(N-1))` 公式;preview 逐帧验证。
- **性能**:翻牌 + 视差 + hover 同时;缓解:只动 transform/opacity,`will-change` 限量,移动端降配。
- **依赖**:hero 真实观感依赖用户产出 4 张素材;未到位用占位先行,接口/文件名先约定。

## Open Questions(执行期再定)

- 翻牌揭示节奏(对角/径向/随机)最终选哪个 → U3 做成可切,preview 后定。
- 网格密度(12 vs 16)→ 看头像清晰度与性能,preview 定。
- 主 CTA「查看内容 ↓」滚到 #projects 还是一个内容总览屏 → 取决于下游区块最终结构(本期占位)。

## Verification Strategy

视觉/交互为主,采用 **preview 验证**(起 dev server → 截图/快照/模拟 hover·click·resize·reduced-motion),而非重型单测。每个 feature 单元的 Test scenarios 即 preview 验收清单。
