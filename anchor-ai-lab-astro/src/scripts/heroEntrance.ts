import { createTimeline } from "animejs";

const readyClass = "hero-entrance-complete";

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
  });

  root.querySelectorAll<SVGPathElement>("[data-protocol-path], [data-protocol-loop]").forEach((path) => {
    path.style.opacity = path.matches("[data-protocol-loop]") ? ".48" : "1";
    path.style.strokeDashoffset = "0";
  });

  document.documentElement.classList.add(readyClass);
};

const initHeroEntrance = () => {
  const hero = document.querySelector<HTMLElement>("[data-hero-entrance]");
  if (!hero) return;

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

  setInitial(header, -10);
  setInitial(fieldNote, 10);
  setInitial(title, 28, { letterSpacing: ".03em" });
  setInitial(eyebrow, 12);
  setInitial(subtitle, 14);
  setInitial(meta, 12);
  setInitial(actions, 12);
  setInitial(panel, 18);

  labels.forEach((el) => {
    const item = el as HTMLElement;
    item.style.opacity = "0";
    item.style.transform = "translateY(7px)";
  });

  nodes.forEach((node) => {
    node.style.opacity = "0";
    node.style.transformBox = "fill-box";
    node.style.transformOrigin = "center";
    node.style.transform = "scale(.7)";
  });

  if (mainPath) {
    const length = mainPath.getTotalLength();
    mainPath.style.strokeDasharray = `${length}`;
    mainPath.style.strokeDashoffset = `${length}`;
    mainPath.style.opacity = "1";
  }

  if (reviewLoop) {
    reviewLoop.style.opacity = "0";
    reviewLoop.style.strokeDashoffset = "42";
  }

  const timeline = createTimeline({
    defaults: {
      ease: "outCubic",
    },
  });

  timeline
    .add(header, { opacity: 1, y: 0, duration: 500 }, 80)
    .add(fieldNote, { opacity: 1, y: 0, duration: 500 }, 180)
    .add(title, { opacity: 1, y: 0, letterSpacing: "0em", duration: 800 }, 300)
    .add(eyebrow, { opacity: 1, y: 0, duration: 500 }, 480)
    .add(subtitle, { opacity: 1, y: 0, duration: 550 }, 620)
    .add(meta, { opacity: 1, y: 0, duration: 500 }, 760)
    .add(actions, { opacity: 1, y: 0, duration: 500 }, 900)
    .add(panel, { opacity: 1, y: 0, duration: 700 }, 500);

  if (mainPath) {
    timeline.add(mainPath, { strokeDashoffset: 0, duration: 1150, ease: "outQuart" }, 560);
  }

  nodes.forEach((node, index) => {
    timeline.add(node, { opacity: 1, scale: 1, duration: 460, ease: "outBack" }, 760 + index * 130);
  });

  if (reviewLoop) {
    timeline.add(reviewLoop, { opacity: .48, strokeDashoffset: 0, duration: 620 }, 1120);
  }

  labels.forEach((label, index) => {
    timeline.add(label, { opacity: 1, y: 0, duration: 420 }, 1200 + Math.min(index, 5) * 45);
  });

  window.setTimeout(() => {
    document.documentElement.classList.add(readyClass);
  }, 1850);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroEntrance, { once: true });
} else {
  initHeroEntrance();
}
