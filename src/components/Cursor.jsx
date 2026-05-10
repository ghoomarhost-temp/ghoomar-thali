import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // GSAP quickTo for high-performance cursor movement
    const xDotTo = gsap.quickTo(dotRef.current, "x", { duration: 0.04, ease: "power3" });
    const yDotTo = gsap.quickTo(dotRef.current, "y", { duration: 0.04, ease: "power3" });
    
    const xRingTo = gsap.quickTo(ringRef.current, "x", { duration: 0.15, ease: "power3" });
    const yRingTo = gsap.quickTo(ringRef.current, "y", { duration: 0.15, ease: "power3" });

    const onMove = (e) => {
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const onEnterLink = () => {
      gsap.to(ringRef.current, {
        scale: 1.8,
        borderColor: 'rgba(230, 185, 92, 0.8)',
        backgroundColor: 'rgba(230, 185, 92, 0.1)',
        duration: 0.3
      });
      gsap.to(dotRef.current, {
        scale: 0,
        duration: 0.2
      });
    };

    const onLeaveLink = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        borderColor: 'rgba(230, 185, 92, 0.5)',
        backgroundColor: 'transparent',
        duration: 0.3
      });
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.2
      });
    };

    window.addEventListener('mousemove', onMove);
    
    const links = document.querySelectorAll('a, button, [role="button"], .menu-card, input, select');
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
