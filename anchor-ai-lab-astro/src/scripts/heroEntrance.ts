import { createTimeline } from "animejs";

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
  });

  root.querySelectorAll<SVGPathElement>("[data-protocol-path], [data-protocol-loop]").forEach((path) => {
    path.style.opacity = path.matches("[data-protocol-loop]") ? ".48" : "1";
    path.style.strokeDashoffset = "0";
  });

  document.documentElement.classList.add(readyClass, "hero-entrance-complete");
};

const initHeroEntrance = () => {
  const hero = document.querySelector<HTMLElement>("[data-hero-entrance]");
  if (!hero) return;

  document.documentElement.classList.remove("motion-fallback", readyClass);

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
  setInitial(fieldNote, 14);
  setInitial(title, 36, { letterSpacing: ".035em" });
  setInitial(eyebrow, 18);
  setInitial(subtitle, 18);
  setInitial(meta, 14);
  setInitial(actions, 14);
  setInitial(panel, 12);

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
    mainPath.style.opacity = ".25";
  }

  if (reviewLoop) {
    reviewLoop.style.opacity = "0";
    reviewLoop.style.strokeDashoffset = "42";
  }

  const timeline = createTimeline({
    defaults: {
      ease: "outExpo",
    },
  });

  timeline
    .add(header, { opacity: 1, y: 0, duration: 650 }, 150)
    .add(fieldNote, { opacity: 1, y: 0, duration: 700 }, 350)
    .add(title, { opacity: 1, y: 0, letterSpacing: "0em", duration: 1150 }, 650)
    .add(eyebrow, { opacity: 1, y: 0, duration: 850 }, 1100)
    .add(subtitle, { opacity: 1, y: 0, duration: 900 }, 1350)
    .add(meta, { opacity: 1, y: 0, duration: 900 }, 1650)
    .add(actions, { opacity: 1, y: 0, duration: 900 }, 1950)
    .add(panel, { opacity: 1, y: 0, duration: 900 }, 700);

  if (mainPath) {
    timeline.add(mainPath, { opacity: 1, strokeDashoffset: 0, duration: 2200, ease: "outCubic" }, 950);
  }

  nodes.forEach((node, index) => {
    timeline.add(node, { opacity: 1, scale: 1, duration: 650, ease: "outExpo" }, 1350 + index * 280);
  });

  if (reviewLoop) {
    timeline
      .add(reviewLoop, { opacity: .48, strokeDashoffset: 0, duration: 900 }, 2400)
      .add(reviewLoop, { strokeDashoffset: -18, duration: 1200, ease: "outCubic" }, 3300);
  }

  labels.forEach((label, index) => {
    timeline.add(label, { opacity: 1, y: 0, duration: 700 }, 2600 + Math.min(index, 6) * 120);
  });

  const primaryNode = nodes[0];
  const terminalNode = nodes[3];
  if (primaryNode) {
    timeline.add(primaryNode, { scale: 1.045, duration: 760, ease: "inOutSine" }, 3380);
    timeline.add(primaryNode, { scale: 1, duration: 760, ease: "outCubic" }, 4140);
  }
  if (terminalNode) {
    timeline.add(terminalNode, { scale: 1.035, duration: 720, ease: "inOutSine" }, 3680);
    timeline.add(terminalNode, { scale: 1, duration: 680, ease: "outCubic" }, 4400);
  }

  window.setTimeout(() => {
    showImmediately();
  }, 5000);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroEntrance, { once: true });
} else {
  initHeroEntrance();
}
