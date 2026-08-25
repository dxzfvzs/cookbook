import React from "react";
import "./strike-text.css";

const STRIKE_LINE_STAGGER_MS = 90;

type StrikeLine = { left: number; top: number; width: number };

const StrikeText: React.FC<{ active: boolean; className?: string; children: React.ReactNode }> = ({
  active,
  className,
  children
}) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const [lines, setLines] = React.useState<StrikeLine[]>([]);
  const [grown, setGrown] = React.useState(false);

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    const range = document.createRange();
    range.selectNodeContents(container);
    const containerRect = container.getBoundingClientRect();
    setLines(Array.from(range.getClientRects()).map(r => ({
      left: r.left - containerRect.left,
      top: r.top - containerRect.top + r.height / 2,
      width: r.width
    })));
  };

  React.useLayoutEffect(() => {
    if (!active) {
      setLines([]);
      setGrown(false);
      return;
    }

    measure();
    setGrown(false);
    const raf = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(raf);
  }, [active]);

  React.useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <span className={className} style={{ position: "relative" }} ref={containerRef}>
      {children}
      {lines.map((line, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className={"strike-text-line" + (grown ? " is-grown" : "")}
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transitionDelay: `${idx * STRIKE_LINE_STAGGER_MS}ms`
          }}
        />
      ))}
    </span>
  );
};

export default StrikeText;
