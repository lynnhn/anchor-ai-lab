import { animate } from "animejs";

const readyClass = "motion-complete";

const showImmediately = (root: ParentNode = document) => {
  const items = root.querySelectorAll<HTMLElement>(
    [
      "[data-hero-header]",
      "[data-hero-field-note]",
      "[data-hero-title]",
      "[data-hero-eyebrow]",
      "[data-hero-subtitle]",
      "[data-hero-meta]",
      "[data-hero-actions]",
      "[data-protocol-panel]",
      "[data-protocol-node]",
      "[data-protocol-label]",
    ].join(",")
  );

  items.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.letterSpacing = "";
    el.style.clipPath = "";
  });

  root.querySelectorAll<SVGPathElement>("[data-protocol-path], [data-protocol-loop]").forEach((path) => {
    path.style.opacity = path.matches("[data-protocol-loop]") ? ".48" : "1";
    path.style.strokeDashoffset = "0";
  });

  document.documentElement.classList.remove("archive-reveal-active");
  document.documentElement.classList.add(readyClass, "hero-entrance-complete");
};

const initHeroEntrance = () => {
  const hero = document.querySelector<HTMLElement>("[data-hero-entrance]");
  if (!hero) return;

  document.documentElement.classList.remove("motion-started", "motion-fallback", readyClass);
  hero.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    el.classList.remove("is-revealed");
    el.removeAttribute("data-reveal");
    el.style.removeProperty("--reveal-delay");
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showImmediately();
    return;
  }

  const header = document.querySelector<HTMLElement>("[data-hero-header]");
  const fieldNote = hero.querySelector<HTMLElement>("[data-hero-field-note]");
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const eyebrow = hero.querySelector<HTMLElement>("[data-hero-eyebrow]");
  const subtitle = hero.querySelector<HTMLElement>("[data-hero-subtitle]");
  const meta = hero.querySelector<HTMLElement>("[data-hero-meta]");
  const actions = hero.querySelector<HTMLElement>("[data-hero-actions]");
  const panel = hero.querySelector<HTMLElement>("[data-protocol-panel]");
  const mainPath = hero.querySelector<SVGPathElement>("[data-protocol-path]");
  const reviewLoop = hero.querySelector<SVGPathElement>("[data-protocol-loop]");
  const nodes = [...hero.querySelectorAll<SVGElement>("[data-protocol-node]")];
  const labels = [...hero.querySelectorAll<HTMLElement | SVGElement>("[data-protocol-label]")];

  const setInitial = (el: HTMLElement | null, y: number, extra: Partial<CSSStyleDeclaration> = {}) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    Object.assign(el.style, extra);
  };

  setInitial(header, -12);
  setInitial(fieldNote, 0, { clipPath: "inset(0 100% 0 0)" });
  setInitial(title, 0, { opacity: "1", clipPath: "inset(0 100% 0 0)", letterSpacing: ".035em" });
  setInitial(eyebrow, 22);
  setInitial(subtitle, 24);
  setInitial(meta, 0, { clipPath: "inset(0 0 100% 0)" });
  setInitial(actions, 18);
  setInitial(panel, 0, { clipPath: "inset(0 0 100% 0)" });

  labels.forEach((el) => {
    const item = el as HTMLElement;
    item.style.opacity = "0";
    item.style.transform = "translateY(7px)";
  });

  nodes.forEach((node) => {
    node.style.opacity = "0";
    node.style.transformBox = "fill-box";
    node.style.transformOrigin = "center";
    node.style.transform = "scale(0)";
  });

  if (mainPath) {
    const length = mainPath.getTotalLength();
    mainPath.style.strokeDasharray = `${length}`;
    mainPath.style.strokeDashoffset = `${length}`;
    mainPath.style.opacity = ".25";
  }

  if (reviewLoop) {
    reviewLoop.style.opacity = "0";
    reviewLoop.style.strokeDashoffset = "42";
  }

  document.documentElement.classList.add("motion-started", "archive-reveal-active");

  animate(header, { opacity: 1, y: 0, duration: 530, delay: 120, ease: "outExpo" });
  animate(fieldNote, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 550, delay: 350, ease: "outCubic" });
  animate(title, { clipPath: "inset(0 0% 0 0)", letterSpacing: "0em", duration: 1050, delay: 650, ease: "inOutCubic" });
  animate(eyebrow, { opacity: 1, y: 0, duration: 800, delay: 1200, ease: "outExpo" });
  animate(subtitle, { opacity: 1, y: 0, duration: 800, delay: 1450, ease: "outExpo" });
  animate(meta, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 850, delay: 1700, ease: "outCubic" });
  animate(actions, { opacity: 1, y: 0, duration: 600, delay: 2350, ease: "outExpo" });
  animate(panel, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 900, delay: 800, ease: "outCubic" });

  if (mainPath) {
    animate(mainPath, { opacity: 1, strokeDashoffset: 0, duration: 2400, delay: 800, ease: "inOutSine" });
  }

  nodes.forEach((node, index) => {
    animate(node, { opacity: 1, scale: 1, duration: 520, delay: 1450 + index * 220, ease: "outBack" });
  });

  if (reviewLoop) {
    animate(reviewLoop, { opacity: .48, strokeDashoffset: 0, duration: 820, delay: 2300, ease: "outExpo" });
    animate(reviewLoop, { strokeDashoffset: -18, duration: 1200, delay: 3300, ease: "outCubic" });
  }

  labels.forEach((label, index) => {
    animate(label, { opacity: 1, y: 0, duration: 650, delay: 2450 + Math.min(index, 6) * 115, ease: "outExpo" });
  });

  const primaryNode = nodes[0];
  const terminalNode = nodes[3];
  if (primaryNode) {
    animate(primaryNode, { scale: 1.04, duration: 720, delay: 3300, ease: "inOutSine" });
    animate(primaryNode, { scale: 1, duration: 680, delay: 4020, ease: "outCubic" });
  }
  if (terminalNode) {
    animate(terminalNode, { scale: 1.03, duration: 680, delay: 3580, ease: "inOutSine" });
    animate(terminalNode, { scale: 1, duration: 640, delay: 4260, ease: "outCubic" });
  }

  window.setTimeout(() => {
    document.documentElement.classList.remove("archive-reveal-active");
  }, 1800);

  window.setTimeout(() => {
    showImmediately();
  }, 5000);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroEntrance, { once: true });
} else {
  initHeroEntrance();
}
