/* ═══════════ Sac 编辑大刊站 — 交互与动效 ═══════════ */

/* 外链数据(集中维护;U4/U5 接入)*/
const LINKS = {
  articles: {
    "01": "https://x.com/Saccc_c/status/2030909809676149098", // 当未来可以被模拟
    "02": "https://x.com/Saccc_c/status/2051852464400261429", // Codex + HyperFrames
    "03": "https://x.com/Saccc_c/status/2039280139046154325", // GitHub 搜索篇
    "04": "https://x.com/Saccc_c/status/2058057029810594206", // Codex 基础篇
  },
  social: {
    x:        "https://x.com/Saccc_c",
    telegram: "https://t.me/Sacccgx",          // 频道
    telegramDM:"https://t.me/Sacccc_c",        // 私信
    xiaohongshu:"https://www.xiaohongshu.com/user/profile/62bac747000000001501e21a",
    douyin:null, bilibili:null, youtube:null,  // SOON
  },
  email: "sacbeflame@gmail.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined";

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready"); // 兜底:无 JS 动效也能看到内容

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  if (hasGSAP && !reduceMotion) {
    /* ── ① Landing 入场:文字逐行浮现 ── */
    const heroItems = gsap.utils.toArray("#hero [data-reveal]");
    gsap.set(heroItems, { opacity: 0, y: 20 });
    gsap.to(heroItems, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      stagger: 0.14, delay: 0.25,
    });

    /* ── 头像:粒子从左聚合 → 揭示清晰头像 → 左缘溶解(见 js/particles.js)── */

    /* ── ② 后续区块:滚动进入时,内容逐项浮现(放慢)── */
    ["#about", "#writing", "#shoot", "#build", "#contact"].forEach((sel) => {
      const section = document.querySelector(sel);
      const items = gsap.utils.toArray(sel + " [data-reveal]");
      if (!section || !items.length) return;
      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: section, start: "top 76%" },
      });
    });
  }

  /* ── 导航高亮:当前区块 ── */
  const navMap = { hero:null, about:"ABOUT", writing:"WRITING", shoot:"VIDEO", build:"BUILD", contact:"CONTACT" };
  const links = [...document.querySelectorAll(".nav__links a")];
  const setActive = (label) => {
    links.forEach(a =>
      a.classList.toggle("is-active", !!label && a.textContent.trim() === label));
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(navMap[e.target.id]); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["hero","about","writing","shoot","build","contact"].forEach(id => {
      const el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  /* ── 固定导航/装饰反色:仅当"导航线"正落在深色 Shoot 区段内时 ── */
  const shootEl = document.getElementById("shoot");
  if (shootEl) {
    const NAV_LINE = 36; // 约导航条中线
    let raf = 0;
    const syncDark = () => {
      raf = 0;
      const r = shootEl.getBoundingClientRect();
      const overDark = r.top <= NAV_LINE && r.bottom >= NAV_LINE;
      document.body.classList.toggle("theme-shoot", overDark);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(syncDark); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncDark();
  }

  /* ── 平滑滚动 ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    });
  });
});
