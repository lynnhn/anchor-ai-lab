---
title: "feat: Sac 个人站「编辑大刊」1:1 还原 + 动效 + 响应式"
status: active
date: 2026-06-27
type: feat
depth: deep
---

# feat: Sac 个人站「编辑大刊」1:1 还原

> 目标仓库内路径基于 `editorial-manifesto/`。方法论见 `../../core.md`。

---

## Summary

把方向 A「编辑大刊」的 4 张参考图(Hero / About / Work / Contact)1:1 还原成一个单页长滚动网站,纯静态 `HTML + CSS + 原生 JS`,GSAP 驱动滚动动效。核心动效是 Hero 头像的「水墨勾勒显露」、文字 pop-in、以及 About→Work 的「写·拍·造 morph + hairline 脊柱贯穿」。所有文章/社媒可跳真实外链。桌面优先,移动端做响应式堆叠。交付前本地起服务自检。

参考图:`reference/01-hero.png … 04-contact.png`。素材:`assets/`(头像双色调 PNG + 4 封面)。动效原型:`transition-demo.html`。

---

## Problem Frame & Scope

**做什么**:一个 confident、1:1 还原参考图的个人品牌单页站,带签名级动效与可用外链。

**In scope**
- 4 屏 1:1 还原(版式/字体/配色/hairline/留白)。
- 动效:Hero 水墨显露、文字浮现 pop-in、写拍造 morph、hairline 脊柱、缩略图放大、❤ hover、关键词 marquee、脉冲状态点、揭示动画。
- 外链:4 篇文章 → 真实 X 链接;社媒图标 → 各平台主页;邮箱;微信社群占位(留固定框,日后换真 QR)。
- 响应式:桌面优先跑通,移动端堆叠适配。
- 交付:本地服务器自检通过再交付。

**Out of scope(见 Scope Boundaries)**:拍/造 内容、真实微信二维码、博客/CMS 后端、多语言。

---

## Key Technical Decisions

- **KTD1 — 技术栈:纯静态 `HTML + CSS + 原生 JS`,无框架。** 匹配 dawood 那种 Framer 式 2D 质感,零构建、易部署、动效可控。**GSAP 3 + ScrollTrigger**(CDN)做滚动编排——pin/scrub/timeline 正是写拍造 morph 与脊柱贯穿需要的。
- **KTD2 — 字体:Playfair Display(拉丁衡线大字)+ Noto Serif SC(中文大字)+ Inter + Noto Sans SC(grotesk 正文/标签)**,Google Fonts。用户已在样张确认 Playfair。`font-display:swap`,preconnect 预连。
- **KTD3 — 配色 token 化**:`--paper:#F4EFE6 --ink:#1A1714 --accent:#F0652E --line:#C9C0B2 --muted:#7d756a`。全站唯一橙,其余墨黑/灰线。
- **KTD4 — 纸纹背景用代码生成**:SVG `feTurbulence` 细颗粒叠暖象牙白 + 极淡 radial 点阵,无需图片素材。
- **KTD5 — 双色调封面用 CSS/SVG 滤镜**:4 张封面(原图彩色)经 SVG `feColorMatrix` 灰度化 + 双色 duotone 映射(墨黑→橙)统一进体系;GitHub 那张(浅白底)额外反相成「深底橙 octocat」以和其余深色封面统一。避免预处理 5 张图。
- **KTD6 — Hero 水墨显露技术**:对栅格头像 PNG 用**动画 SVG 遮罩**——`feTurbulence` 湍流生成 alpha 笔触遮罩,动画推进遮罩阈值/`mask-position`,让头像像水墨晕开般被「勾勒」出来,末态完全显形;配合轻微 blur→sharp。降级方案:CSS `mask-image` + 笔刷 alpha 渐变动画(`mask-size`)。
- **KTD7 — 文字 pop-in**:不依赖付费 SplitText;手动把标题/行包成 `span`,GSAP `stagger` 做 `opacity`+`y` 浮现,ScrollTrigger 触发。
- **KTD8 — 平台 logo 用品牌彩色 SVG**(用户已拍板),内联以便 hover/着色控制。

---

## High-Level Technical Design

**页面结构(单页锚点)**
```
nav(fixed) · rail(fixed 韵律线) · 四角 crosshair
└ main
   ├ #hero      左 Playfair "Sac" + kicker + slogan + 双CTA / 右 头像(水墨显露)
   ├ #about     左 bio + 小头像 / 右 彩色平台矩阵(含 SOON) / 最右 写拍造竖排
   ├ #work      标题 + 写拍造分类 / 头条01(大图+dek+日期) + 行02-04 / 全部文章
   └ #contact   居中 Let's talk + kicker + 脉冲状态 / marquee / 横向联系栏(邮箱·X·TG·微信QR占位) / 页脚
```

**滚动动效时间线(GSAP ScrollTrigger)**
```
进入 #hero        → 头像 SVG 遮罩水墨显露 + 左侧文字逐行 pop-in(stagger)
#about→#work 之间 → pin:写拍造竖排 平移/转横 → 落位 Work 分类导航
                    英文标签 + SOON 淡入;hairline 脊柱连续不断(fixed rail)
进入 #work 行      → hairline 先画(scaleX 0→1)+ 行内容上浮 stagger;缩略图 hover 放大
#contact          → marquee 无限滚;状态点橙色脉冲;❤ 默认墨黑、hover 变橙
```
（脊柱=左侧 `rail` 为 `position:fixed`,跨屏不断;❤ hover 行为已在 `transition-demo.html` 验证。）

---

## Output Structure

```
editorial-manifesto/
├── index.html
├── css/
│   ├── tokens.css        # 变量 + 纸纹 + 字体
│   ├── base.css          # reset + 全局结构件(nav/rail/crosshair)
│   └── sections.css      # 四屏样式
├── js/
│   └── main.js           # GSAP 动效 + 交互 + 数据(链接)
├── assets/               # 已就位:avatar-duotone.png + work-01..04
├── reference/            # 参考图(已在)
├── font-sample.html      # 字体样张(已在)
└── transition-demo.html  # 动效原型(已在)
```

---

## Implementation Units

### U1. 项目骨架 + 设计 token + 字体 + 纸纹背景 + 全局结构件
**Goal**:搭好可跑的骨架与全站统一视觉底座。
**Files**:`index.html`、`css/tokens.css`、`css/base.css`。
**Approach**:`index.html` 建四个 `<section>` 锚点 + fixed `nav` + fixed `.rail`(三条韵律线)+ 四角 `.crosshair`。tokens.css 放配色变量、Google Fonts `@import`/`<link>`、SVG `feTurbulence` 纸纹。base.css 放 reset、nav(SAC + WORK/WRITING/ABOUT/CONTACT + 激活态)、rail、crosshair、容器栅格。
**Patterns**:复用 `transition-demo.html` 的 token/nav/rail 写法。
**Verification**:页面起服后纸白底 + 导航 + 韵律线 + 四角准星就位;Playfair/Noto 正确加载(无衬线回退闪烁可接受)。
**Test expectation**: none — 纯脚手架/样式,无行为逻辑。

### U2. Hero 区块 1:1(静态)
**Goal**:还原 `reference/01-hero.png`。
**Files**:`index.html`(#hero)、`css/sections.css`。
**Approach**:左栏 `01 — INDEX` hairline 方括号、Playfair `Sac`(中等尺寸)、kicker(橙点 + AI media × builder)、两行 slogan、双 CTA(`查看内容 →` 描边 / `联系我 →` 下划线);右侧头像 `<img>` 带 hairline 裁切框 + 准星,出血右缘。唯一橙=橙点或主 CTA 箭头。
**Patterns**:`reference/01-hero.png` 像素级比对。
**Verification**:与参考图叠加比对,字号/间距/位置吻合;静态无动效先。
**Test expectation**: none — 样式还原。

### U3. About 区块 1:1(静态)
**Goal**:还原 `reference/02-about.png`。
**Files**:`index.html`(#about)、`css/sections.css`。
**Approach**:左 `About me`(Playfair,无序号)+ 3 行 bio + 左下小头像(hairline 框);右 `我的全平台频道` 大标题 + 彩色 logo 平台矩阵(X 标 25.3K + 橙点,其余不标数;抖音/B站/YouTube 灰阶 SOON);最右 `写·拍·造` 竖排书脊。logo 用内联品牌 SVG。
**Verification**:对图比对;6 平台顺序/SOON/着色正确。
**Test expectation**: none — 样式还原。

### U4. Work 区块 1:1 + 封面双色调处理
**Goal**:还原 `reference/03-work.png`,并把 4 封面统一成双色调。
**Files**:`index.html`(#work)、`css/sections.css`、`css/base.css`(SVG duotone 滤镜 def)。
**Approach**:`Work` 标题 + 写拍造分类(写激活/拍造 SOON);头条 01 放大(大缩略图 + dek + 日期 `2025.8.12` + `696 ❤`);行 02–04 常规(各 dek + 日期 + 缩略图);`全部文章 →`。封面经 SVG `feColorMatrix`+duotone 映射;`work-03-github` 走深底反相分支。缩略图 `object-fit:cover` + `object-position` 保主体(尤其超宽封面右侧 ChatGPT 方块)。头条只一处橙(❤),箭头墨黑。
**Verification**:对图比对;4 封面均呈墨黑+橙、GitHub 那张为深底;头条放大且只一处橙。
**Test expectation**: none — 样式 + 滤镜还原(渲染结果靠目视/截图比对)。

### U5. Contact 区块 1:1(静态)
**Goal**:还原 `reference/04-contact.png`。
**Files**:`index.html`(#contact)、`css/sections.css`。
**Approach**:居中 kicker `GET IN TOUCH / 联系`、Playfair `Let's talk.` + 橙下划线笔触、副标、脉冲状态点占位 + `当前开放合作 · Available`;下部关键词 marquee 结构;底部横向联系栏(竖 hairline 分列:邮箱正常字号 + X/TG 彩色 logo + 微信社群 QR 占位框=填满的微信图标+网点+敬请期待);贴底页脚 `© 2026 Sac` / `回到顶部 ↑`。
**Verification**:对图比对;联系行紧凑无大空框;QR 槽固定尺寸(日后 1:1 换真码)。
**Test expectation**: none — 样式还原。

### U6. Hero 水墨显露 + 文字 pop-in 动效
**Goal**:实现 KTD6/KTD7。
**Files**:`js/main.js`、`css/sections.css`、`index.html`(头像 SVG 遮罩结构)。
**Approach**:GSAP 载入后,头像用动画 SVG 遮罩(`feTurbulence` alpha + 阈值/`mask-position` 推进)做水墨晕开显形 + blur→sharp;左侧文字包行 `span`,`stagger` opacity+y 浮现;首屏入场即触发(非滚动依赖)。降级:`prefers-reduced-motion` 直接显终态。
**Dependencies**:U2。
**Verification**:刷新首屏头像从无到有「被勾勒」显形、文字逐行浮现;reduced-motion 下直接终态、无动画。
**Test scenarios**:① 正常进入 → 头像遮罩从 0 推进到完全显形;② `prefers-reduced-motion:reduce` → 跳过动画显终态;③ 慢网 GSAP 未载入 → 头像仍最终可见(不卡在隐藏态)。

### U7. About→Work 衔接 morph + 脊柱 + 区块揭示
**Goal**:实现核心衔接动效(参照 `transition-demo.html`)。
**Files**:`js/main.js`、`css/sections.css`。
**Approach**:ScrollTrigger pin About 末段,scrub 控制 `写·拍·造` 竖排→Work 横排分类的位置/角度补间;英文标签 + SOON 淡入;rail 保持 fixed 连续=脊柱;进入 Work 时行 hairline `scaleX 0→1` + 内容上浮 stagger。
**Dependencies**:U3、U4。
**Verification**:滚动 About→Work,写拍造平滑变形落位、脊柱不断、Work 行依次画线浮现;reduced-motion 下无 pin、直接成稿。
**Test scenarios**:① 下滚 → 写拍造从竖排补间到横排分类且英文/SOON 淡入;② 反向上滚 → 动画可逆;③ reduced-motion → 不 pin、两屏直接静态成稿;④ 快速滚动 → 无错位/残影。

### U8. 交互动效:缩略图放大 / ❤ hover / marquee / 脉冲
**Goal**:补齐细节动效。
**Files**:`js/main.js`、`css/sections.css`。
**Approach**:Work 缩略图 hover `scale` 放大 + 行 hover ❤ 墨黑→橙、箭头右移(CSS 为主);Contact 关键词 marquee 无限滚(JS/CSS)、状态点橙色脉冲(CSS keyframes)。
**Dependencies**:U4、U5。
**Verification**:hover 缩略图放大、❤ 仅 hover 变橙;marquee 平滑循环;脉冲点呼吸。
**Test scenarios**:① hover 文章行 → 该行 ❤ 变橙、缩略图放大、箭头右移;② 非 hover → ❤ 墨黑;③ marquee 循环无跳帧;④ reduced-motion → marquee/脉冲降为静止。

### U9. 外链接入(文章 / 社媒 / 邮箱 / QR 占位)
**Goal**:实现功能交互 3(a)(b)。
**Files**:`js/main.js`(链接数据表)、`index.html`。
**Approach**:集中一份链接数据:4 篇文章 → 各自真实 X 链接(见 Open Questions:需采集);社媒 → X `x.com/Saccc_c`、TG 频道 `t.me/Sacccgx`、TG DM `t.me/Sacccc_c`、小红书主页、抖音/B站/YouTube(SOON 暂禁用点击或指向占位);邮箱 `mailto:`(待用户给真实地址,暂占位);微信 QR 框留 `data-` 钩子,日后换图。外链 `target="_blank" rel="noopener"`。
**Dependencies**:U2–U5。
**Verification**:点 4 篇文章跳对应 X 链接;点已上线社媒跳对主页;SOON 平台不误跳;邮箱唤起 mailto。
**Test scenarios**:① 点每篇文章 → 新标签打开正确 X URL;② 点 X/TG/小红书 → 各自主页;③ 点抖音/B站/YouTube(SOON)→ 不跳或提示即将开放;④ 点邮箱 → mailto 唤起。

### U10. 响应式(移动端堆叠)
**Goal**:完成响应式,桌面优先、移动端可用。
**Files**:`css/sections.css`、`css/base.css`。
**Approach**:断点(≤768)下:nav 收起为精简/汉堡或换行;Hero 改上下堆叠(头像在上或下);About 左右两栏堆叠、平台矩阵单列;Work 行简化(缩略图缩小或上移、dek 保留);Contact 联系栏由横排改纵列。动效在窄屏降级(morph 改简单淡入)。
**Dependencies**:U2–U8。
**Verification**:375/768/1440 三档无溢出、可读、可点;桌面端保持 1:1。
**Test scenarios**:① 375px → 四屏单列堆叠、无横向滚动;② 768px → 过渡布局合理;③ 1440px → 与参考图一致;④ 窄屏动效降级不卡。

### U11. 本地服务器自检与交付
**Goal**:交付前自验(交付要求 5)。
**Files**:全站。
**Approach**:`python3 -m http.server` 起本地服务,逐屏对参考图比对、过四档断点、点所有链接、跑动效与 reduced-motion;截图记录。修掉偏差再交付。
**Dependencies**:U1–U10。
**Verification**:四屏 1:1、动效正常、链接可跳、响应式通过;自检清单全绿后交付。
**Test expectation**: none — 集成自检关卡(产出为比对截图 + 问题清单)。

---

## Scope Boundaries

### Deferred to Follow-Up Work
- 微信社群真实二维码(框已留,上线后 `data-` 钩子换图)。
- 邮箱真实地址(占位 `hello@sac.xxx`,用户给后替换)。
- 4 篇文章真实 X 链接采集(见 Open Questions)。

### Outside this product's identity
- 拍(视频)/ 造(项目)内容区块(当前 SOON)。
- 博客/CMS、后端、评论、多语言、深色模式。

---

## Open Questions

- **OQ1(实现期需解决,非阻塞)— 4 篇文章的真实 X 链接**:目前只有标题。实现 U9 时,用 `xreach` 搜 `@Saccc_c` 推文匹配这 4 篇标题取链接,交用户确认;或用户直接给 4 个 URL。先以占位 `#` 搭好,链接到位即填。
- **OQ2 — 邮箱地址 / 主 CTA**:Contact 邮箱待用户给真实地址;若不愿公开邮箱则改主 CTA 为「在 X 私信我」。先占位。

---

## Risks & Dependencies

- **R1 — 字体度量差异**:Playfair 与参考图(GPT 渲染)可能在字重/字距上略偏。缓解:U2 用 `font-weight`/`letter-spacing`/`font-optical-sizing` 微调对图。
- **R2 — 水墨遮罩性能/兼容**:SVG `feTurbulence` 动画在低端机可能掉帧。缓解:KTD6 降级 CSS mask;`prefers-reduced-motion` 直接终态。
- **R3 — 双色调封面观感**:CSS duotone 还原参考图的脏颗粒可能不足 100%。缓解:先 CSS;不够味再单独预处理那一张(路线 2)。
- **R4 — 头条版权图**:MiroFish(电影截图)已经用户拍板照用,双色调处理后抽象一层;风险归用户接受。
- **R5 — pin morph 与移动端**:窄屏 pin 体验差。缓解:U10 窄屏降级为淡入。

---

## Verification Strategy

逐屏对 `reference/*.png` 叠加比对(1:1);GSAP 动效逐条目视 + `prefers-reduced-motion` 分支;四档断点(375/768/1024/1440);所有外链点击;最后 `python3 -m http.server` 全站自检(U11)通过再交付。
