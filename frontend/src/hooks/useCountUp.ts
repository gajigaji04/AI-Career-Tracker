import { useEffect, useState } from "react";

export const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);
  // 모션 최소화 설정이면 애니메이션 없이 바로 목표값을 보여준다 (effect 안에서 setState 하지 않음)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduceMotion]);

  return reduceMotion ? target : value;
};
