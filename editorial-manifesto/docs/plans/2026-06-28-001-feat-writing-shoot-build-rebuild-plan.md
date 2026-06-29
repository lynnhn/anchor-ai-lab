---
title: "feat: Work 拆分为 Writing / Shoot / Build 三页重构"
status: active
date: 2026-06-28
type: feat
depth: deep
---

# feat: Work 拆分为 Writing / Shoot / Build 三页重构

> 仓库内路径基于 `editorial-manifesto/`。参考图:`reference/`(用户新出的 writing/shoot/build/hero 重构稿)。方法论见 `../../core.md`。

---

## Summary

把现有单一的 Work 区块拆成**三个独立整屏**——Writing(纸白编辑)、Shoot(深黑电影)、Build(纸白终端),排在 About 之后、Contact 之前,完全照用户新参考图的样式。同时**移除 写·拍·造 spine-morph**(用户不要了)。Writing 复用现有 4 张文章封面(只改框样式)、保留缓慢 pop-in / hover / 文章跳转;Shoot 用 `assets/shoot-bg.png`;Build 是纯代码终端,带**逐字符流式打字**与 **0→compiling→100 进度条**动画。About 本轮不动。

---

## Problem Frame & Scope

**做什么**:Work 内容升级为三张高冲击力的独立页面,视觉对齐参考图。

**In scope**
- 删除 `#work` 区块 + `initSpineMorph` + `.about__spine`(连同相关 CSS/JS)。
- 新增 `#writing` / `#shoot` / `#build` 三个 section,nav 锚点对齐(WRITING→#writing,VIDEO→#shoot,BUILD→#build)。
- Writing:巨型字 + 写拍造静态分类 + 头条大封面拼贴 + 02/03/04 编号列表 + pop-in/hover/跳转。
- Shoot:站内唯一深色屏,full-bleed 背景 + 播放器 UI + 巨型 SHOOT(剪字)+ coming soon。
- Build:终端窗口 + 流式打字 + 进度条 + 蓝图注释,纯代码零素材。
- 滚动揭示、nav 高亮接入三页。

**Out of scope**:About 重构(下一轮)、Hero 粒子(用户另行处理)、真实视频内容、Writing 新版艺术封面(沿用现有)。

---

## Key Technical Decisions

- **KTD1 — 三 section 替换 `#work`**:保持单页长滚动锚点结构。顺序 Hero→About→Writing→Shoot→Build→Contact。nav 已含五项,只需把 WORK/WRITING 两条锚点重定向到新 id。
- **KTD2 — 移除 spine-morph**:删 `js/main.js` 的 `initSpineMorph()` 及其调用、删 `.about__spine` 标记与 CSS、删 `body.is-spine-*` 规则。Writing 的写拍造分类改为**静态**(写—WRITE 激活,拍/造 SOON),复用 `.cat__zh/.cat__en/.cat__soon` 结构但去掉 morph 依赖。
- **KTD3 — Writing 头条"拼贴框"= 真封面 + 代码叠加**:用现有 `work-01-mirofish.jpeg` 作底图,上叠 SVG/CSS 画的细网格、四角准星、测量基线、技术小标注,组成"蓝图拼贴"。不新增素材。双色调沿用 `#duotone` 滤镜(hover 才上色,延续现有交互)。
- **KTD4 — Shoot 局部深色**:section 内用 CSS 变量覆盖(`--paper`→深墨、`--ink`→浅)实现单屏深色,不污染全站。full-bleed `shoot-bg.png` + 暗 tonal overlay 保证文字可读;巨型「SHOOT」用 `background-clip:text` 把背景剪进字;REC 时间码、播放器 scrubber、play、EP.01、进度 0% 全是 UI 代码;唯一橙强调延续。
- **KTD5 — Build 终端纯代码**:mac 三点窗口 + 代码行 + `v0.1.0 — compiling…` 进度条 + 四周蓝图注释/网格/`{ }`/底部时间轴,全 HTML/CSS/SVG。打字与进度由 `js/build.js` 驱动。
- **KTD6 — Build 动画**:逐字符流式打入(光标闪烁、行间错峰),从 `sac build --in-public` 起的若干原创日志行;进度条数值 0→100 与条宽同步,到 100 切 `done · 即将开源`;由 ScrollTrigger 进入视口触发一次;`prefers-reduced-motion` 降级为直接显示全文 + 满条。
- **KTD7 — 揭示/交互沿用现有模式**:`data-reveal` + ScrollTrigger 放慢 pop-in;hover 文字变橙 + 缩略图放大延续 `.wrow` 写法;文章链接复用 `LINKS.articles`;外链 `target=_blank rel=noopener`。

---

## High-Level Technical Design

**新结构(单页锚点)**
```
main
 ├ #hero      (不动)
 ├ #about     (不动;移除右侧 .about__spine)
 ├ #writing   巨型 Writing / 写拍造静态分类 / 头条01大封面拼贴 / 02-04编号列表 / 全部文章
 ├ #shoot     [深色] full-bleed bg / REC·player UI / 巨型 SHOOT 剪字 / coming soon / 抢先关注
 ├ #build     mac终端(打字+进度条) / 蓝图注释 / 巨型 Build / 公开建造中·GitHub
 └ #contact   (不动)
```

**Build 动画时序(进入视口触发,scrub=否,一次性)**
```
0.0s  终端窗口淡入(光标闪)
→     逐行逐字符打入日志(每行打完→下一行,带 stagger)
→     打到 compiling 行 → 进度条启动:width 0→100% + 数字同步递增
1.0   到 100% → 文案切 "done · 即将开源",停。reduced-motion:跳过过程直接终态。
```

---

## Implementation Units

### U1. 结构清理 + 三 section 脚手架 + nav 锚点
**Goal**:删 Work/spine-morph,落三个新 section 占位,nav 指向新 id。
**Files**:`index.html`、`js/main.js`、`css/sections.css`。
**Approach**:删 `#work` 整段、`.about__spine` 整段;`js/main.js` 删 `initSpineMorph()` 定义与调用、删 spine 相关测量;删 `css/sections.css` 中 `.about__spine`/`body.is-spine-*`/`.work__cats` morph 残留(保留通用 `.cat_*` 供 Writing 复用)。在 About 后插入 `<section id="writing">`/`<section id="shoot">`/`<section id="build">` 空骨架。nav:`WORK`链接删或并入,`WRITING`→`#writing`、`VIDEO`→`#shoot`、`BUILD`→`#build`。`main.js` 的 navMap / IntersectionObserver / reveal 列表改用新 id。
**Verification**:页面四屏正常滚动、无 spine-morph、无 JS 报错、nav 点击跳对锚点。
**Test expectation**: none — 结构脚手架,无独立逻辑(行为在后续单元)。

### U2. Writing 页标记 + 样式
**Goal**:还原 `reference/writing.png`。
**Files**:`index.html`(#writing)、`css/sections.css`。
**Approach**:巨型衬线「Writing」(带印刷颗粒)。写拍造静态分类(写—WRITE 激活橙、拍/造 灰 SOON)。头条 01:大尺寸封面(`work-01-mirofish.jpeg`)套**蓝图拼贴框**(SVG 细网格 + 四角准星 + 测量线 + 小标注),旁置序号 01、标题《当未来可以被模拟…》、标签/日期/阅读时长/❤696、`阅读 →`(链 article 01)。右侧 02/03/04 编号列表:大号灰序号 + 标题 + 标签·日期 + ❤,02 行用浅橙高亮块 + 小装饰图;各行链对应文章。底部 `全部文章 →`(链主页)。`data-reveal` pop-in;hover 文字变橙 + 缩略图。
**Patterns**:复用 `.wrow` hover 与 `LINKS.articles`;封面 `#duotone` 滤镜默认彩色、hover 上色(延续现有约定)。
**Verification**:对 `reference/writing.png` 比对;4 篇链接正确;hover/pop-in 生效。
**Test scenarios**:① 点 01「阅读」→ 新标签开 article 01 URL;② 点 02/03/04 → 各自 X 链接;③ hover 行 → 文字变橙、缩略图放大;④ 进入视口 → 元素逐项浮现;⑤ reduced-motion → 直接显示、无动画。

### U3. Shoot 页(深色)标记 + 样式
**Goal**:还原 `reference/shoot.png`(深色电影屏)。
**Files**:`index.html`(#shoot)、`css/sections.css`。
**Approach**:section 局部深色(CSS 变量覆盖)。full-bleed `assets/shoot-bg.png` + 暗 tonal overlay。顶部 REC●时间码 `00:00:00` + 右上 `EP.01 · 拍摄中`;中部 `拍 · Films coming soon / 视频即将上映`;底部播放器 scrubber(play ▶ + `00:00` + 进度轴 + `0%`,橙强调)。左下巨型「SHOOT」用 `background-clip:text` 把 `shoot-bg` 剪进字 + `拍 — SHOOT` 小标 + `抢先关注 →` CTA。`data-reveal` pop-in。
**Verification**:对图比对;深色仅限本屏、不外溢;文字在背景上可读;巨型字纹理填充生效。
**Test scenarios**:① 进入视口 → 内容浮现;② 上/下屏仍为纸白(深色未污染全站);③ `抢先关注` 链接可点(指向 X 或占位);④ reduced-motion → 静态显示。

### U4. Build 页标记 + 样式
**Goal**:还原 `reference/build.png` 的终端布局与蓝图注释。
**Files**:`index.html`(#build)、`css/sections.css`。
**Approach**:巨型「Build」+ `拍 — BUILD`(应为 `造 — BUILD`)小标 + `公开建造中 · 即将开源` + `在 GitHub 撸一个 →`。中-右 mac 终端窗口(三点标题栏 `sac build --in-public`)含若干代码/日志行 + `v0.1.0 — compiling…` + 进度条(条 + 百分比)。四周蓝图注释:左侧小 spec 列表、`{ }` motif、`build done/in progress` 标注、底部时间轴刻度、细网格。全 HTML/CSS/SVG。
**Verification**:对图比对;终端窗口、进度条、注释齐全(静态态先正确)。
**Test expectation**: none — 样式还原;动画在 U5。

### U5. Build 动画(流式打字 + 进度条)
**Goal**:实现 KTD6 的打字与编译进度动画。
**Files**:`js/build.js`(新)、`index.html`(引入)、`css/sections.css`(光标/进度条过渡)。
**Approach**:进入视口(ScrollTrigger / IntersectionObserver)触发一次:逐行逐字符打入日志(光标闪烁、行间错峰),打到 compiling 行后进度条 `width 0→100%` 且百分比数字同步;到 100% 文案切 `done · 即将开源`。`prefers-reduced-motion`:跳过过程,直接显示完整日志 + 满条 + done。提供"已触发"标记避免重复。
**Dependencies**:U4。
**Verification**:滚到 Build,代码像在被敲入、左到右、行错峰;进度 0→100 数字与条同步;reduced-motion 直接终态。
**Test scenarios**:① 进入视口 → 逐字符打字开始、光标闪;② 打到 compiling → 进度条与数字 0→100 同步;③ 到 100 → 文案变 done;④ 反复滚入滚出 → 不重复乱触发(只播一次或可控重播);⑤ reduced-motion → 直接显示全文 + 满条,无动画。

### U6. 揭示/导航接线 + 本地自检
**Goal**:三页接入滚动揭示与 nav 高亮,并整体自检。
**Files**:`js/main.js`、全站。
**Approach**:`main.js` 的区块揭示循环与 IntersectionObserver navMap 加入 `writing/shoot/build`;确认 reduced-motion 与兜底 `.is-ready` 仍生效。`python3 -m http.server` 起服,逐屏对参考图、过断点、点所有链接、跑 Build 动画与 reduced-motion、确认深色仅限 Shoot。
**Dependencies**:U1–U5。
**Verification**:三屏 1:1、nav 高亮跟随、链接可跳、Build 动画正常、深色不外溢;自检清单全绿。
**Test expectation**: none — 集成自检关卡(产出为比对截图 + 问题清单)。

---

## Scope Boundaries

### Deferred to Follow-Up Work
- About「标本页」重构 + `avatar-about.png` 换朝向人物(下一轮)。
- Hero 粒子头像(用户自行处理中)。
- Writing 升级版艺术拼贴封面(沿用现有 4 张)。
- Shoot 真实视频内容与播放(现为 coming soon 占位)。

### Outside this product's identity
- 后端/CMS、评论、多语言、暗色全站模式(深色仅 Shoot 单屏)。

---

## Open Questions

- **OQ1(实现期)— Build 终端日志文案**:用原创的"公开建造"日志行(安装依赖→编译→进度);到位后可按用户口味微调。
- **OQ2 — Shoot「抢先关注」/ Build「在 GitHub 撸一个」目标链接**:先指向 X 主页 / 占位 `#`,用户给真实 GitHub/订阅链接后替换。

---

## Risks & Dependencies

- **R1 — 局部深色外溢**:Shoot 用变量覆盖若作用域没控好会污染相邻屏。缓解:深色变量只挂 `#shoot` 作用域,过渡处用明确分界。
- **R2 — `background-clip:text` 兼容/可读**:剪字在某些渲染下可能糊。缓解:加 `-webkit-` 前缀 + 兜底纯色字。
- **R3 — Build 动画与 rAF**:预览无头环境看不到(rAF 不跑),需真实浏览器验。缓解:结构/计时用 inspect 核;reduced-motion 兜底保证终态可见。
- **R4 — 文章封面双色调 hover 一致性**:延续现有约定即可。

---

## Verification Strategy

逐屏对 `reference/writing.png|shoot.png|build.png` 比对(1:1);四档断点;所有外链点击;Build 打字+进度条动画与 `prefers-reduced-motion` 分支;确认深色仅限 Shoot;`python3 -m http.server` 自检通过再交付。
