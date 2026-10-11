import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Check if device supports fine hover pointer
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isVisible = false;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        glow.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      glow.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      glow.style.opacity = '1';
    };

    const render = () => {
      // Smooth lerp (linear interpolation) for trailing momentum
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
