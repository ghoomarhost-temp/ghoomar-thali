import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// coordinates: x = (lon - 68.0) * 27.128, y = (37.5 - lat) * 29.403
const JOURNEY = [
  { id: 'amritsar', city: 'Amritsar', region: 'Punjab', tag: 'The Golden City', desc: 'Where faith and flavour converge — the sacred Golden Temple\'s golden ghats inspiring our most revered dishes.', svgX: 186, svgY: 173, zoom: 5 },
  { id: 'ludhiana', city: 'Ludhiana', region: 'Punjab', tag: 'Heart of Punjab', desc: 'The industrial pulse of Punjab, where royal feasts match the city\'s legendary spirit and appetite.', svgX: 213, svgY: 194, zoom: 5 },
  { id: 'mohali', city: 'Mohali', region: 'Chandigarh', tag: 'The Twin City', desc: 'India\'s most planned city\'s twin — where modern ambition is nourished by ancestral dining traditions.', svgX: 238, svgY: 199, zoom: 5 },
  { id: 'pitampura', city: 'Pitampura', region: 'Delhi', tag: 'Capital\'s North', desc: 'A verdant northern enclave of the capital, serving Rajputana royalty to Delhi\'s historic heartland.', svgX: 248, svgY: 258, zoom: 9 },
  { id: 'cp', city: 'Connaught Place', region: 'Delhi', tag: 'The Imperial Core', desc: 'At the beating heart of India\'s capital — our most storied and most visited royal outpost.', svgX: 250, svgY: 261, zoom: 9 },
  { id: 'vasantkunj', city: 'Vasant Kunj', region: 'Delhi', tag: 'The Southern Court', desc: 'A tranquil southern enclave of the capital — understated grandeur nestled in a forest-lined setting.', svgX: 248, svgY: 264, zoom: 9 },
  { id: 'gurugram', city: 'Gurugram', region: 'Delhi NCR', tag: 'The Millennium City', desc: 'Where the corporate world\'s titans seek the soul of Rajasthan after the day\'s long conquest.', svgX: 245, svgY: 266, zoom: 9 },
  { id: 'noida', city: 'Noida', region: 'Delhi NCR', tag: 'Eastern Gateway', desc: 'Across the Yamuna — a thriving satellite city with an appetite for the truly extraordinary.', svgX: 253, svgY: 263, zoom: 9 },
  { id: 'ghaziabad', city: 'Ghaziabad', region: 'Delhi NCR', tag: 'Gateway to the Doab', desc: 'Ancient crossroads of western UP — where the road to Agra begins and royal flavours linger longest.', svgX: 256, svgY: 260, zoom: 8 },
  { id: 'agra', city: 'Agra', region: 'Uttar Pradesh', tag: 'City of the Taj', desc: 'In the shadow of immortal love and marble — we serve flavours carved with equal devotion and precision.', svgX: 271, svgY: 303, zoom: 4.5 },
  { id: 'kanpur', city: 'Kanpur', region: 'Uttar Pradesh', tag: 'Heart of the Doab', desc: 'The great industrial heart of Uttar Pradesh where our royal table feels most grandly at home.', svgX: 335, svgY: 325, zoom: 4 },
  { id: 'patna', city: 'Patna', region: 'Bihar', tag: 'Ancient Pataliputra', desc: 'On the sacred Ganges, the ancient capital that once ruled all of the subcontinent — now savours our heritage.', svgX: 465, svgY: 350, zoom: 3.8 },
  { id: 'guwahati', city: 'Guwahati', region: 'Assam', tag: 'Gateway to the East', desc: 'Where the Brahmaputra flows wide and wild — a taste of Rajputana in the land of the seven sisters.', svgX: 644, svgY: 333, zoom: 3.2 },
  { id: 'bhopal', city: 'Bhopal', region: 'Madhya Pradesh', tag: 'City of Lakes', desc: 'Draped in twin lakes and Nawabi heritage — our Rajputana court finds its deepest spiritual cousin here.', svgX: 255, svgY: 419, zoom: 4.2 },
  { id: 'vadodara', city: 'Vadodara', region: 'Gujarat', tag: 'The Cultural Capital', desc: 'The Maratha royal city that opens its arms to Rajputana hospitality with unmatched grace and warmth.', svgX: 141, svgY: 447, zoom: 4.5 },
  { id: 'pune', city: 'Pune', region: 'Maharashtra', tag: 'Oxford of the East', desc: 'Where scholars and soldiers have dined for centuries — a new royal court now firmly established.', svgX: 159, svgY: 558, zoom: 4.2 },
  { id: 'goa', city: 'Goa', region: 'Goa', tag: 'Pearl of the Orient', desc: 'Sun-kissed and gold-washed — our coastal outpost where the spirit of Rajputana meets the Arabian Sea.', svgX: 155, svgY: 660, zoom: 4.8 },
  { id: 'mangalore', city: 'Mangalore', region: 'Karnataka', tag: 'Port of Perfumes', desc: 'Spices from across India converge at this fragrant coast — a fitting home for our spice-mastered heritage.', svgX: 186, svgY: 723, zoom: 4.8 },
  { id: 'jaipur', city: 'Jaipur', region: 'Rajasthan', tag: 'The Origin — The Pink City', desc: 'Here, on the rose-red streets of the Pink City, it all began. Every feast across the empire traces its soul back to this royal kitchen.', svgX: 211, svgY: 311, zoom: 4.5, primary: true },
];

const SVG_W = 786.7, SVG_H = 867.4;
const FULL_VB = `-150 -150 ${SVG_W + 300} ${SVG_H + 300}`;

function viewBoxFor(cx, cy, zoom) {
  const w = SVG_W / zoom;
  const h = SVG_H / zoom;
  const vx = Math.max(0, Math.min(cx - w / 2, SVG_W - w));
  const vy = Math.max(0, Math.min(cy - h / 2, SVG_H - h));
  return `${vx.toFixed(1)} ${vy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}

// Quadratic bezier trail between two map points with gentle perpendicular curvature
function trailPath(a, b) {
  const mx = (a.svgX + b.svgX) / 2;
  const my = (a.svgY + b.svgY) / 2;
  const dx = b.svgX - a.svgX;
  const dy = b.svgY - a.svgY;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return `M ${a.svgX} ${a.svgY} L ${b.svgX} ${b.svgY}`;
  const curve = Math.min(len * 0.18, 36);
  const cpx = (mx + (-dy / len) * curve).toFixed(1);
  const cpy = (my + (dx / len) * curve).toFixed(1);
  return `M ${a.svgX} ${a.svgY} Q ${cpx} ${cpy} ${b.svgX} ${b.svgY}`;
}

// Pin shape: tip at origin (0,0), head extends upward by sz*2.4
const pinPath = (sz) =>
  `M 0,0 C ${-sz*0.4},${-sz*0.9} ${-sz},${-sz*1.7} ${-sz},${-sz*2.4}` +
  ` A ${sz},${sz} 0 1,1 ${sz},${-sz*2.4}` +
  ` C ${sz},${-sz*1.7} ${sz*0.4},${-sz*0.9} 0,0 Z`;

const sortedByX = [...JOURNEY].sort((a, b) => a.svgX - b.svgX);
const midIndex = Math.ceil(sortedByX.length / 2);
const leftHalfIds = new Set(sortedByX.slice(0, midIndex).map(l => l.id));

const leftC = [...JOURNEY].filter(l => leftHalfIds.has(l.id)).sort((a, b) => a.svgY - b.svgY);
const rightC = [...JOURNEY].filter(l => !leftHalfIds.has(l.id)).sort((a, b) => a.svgY - b.svgY);

const getLabelData = (id) => {
  const lIdx = leftC.findIndex(c => c.id === id);
  if (lIdx !== -1) {
    const sp = 700 / Math.max(1, leftC.length - 1);
    return { side: 'left', labelX: 20, labelY: 100 + lIdx * sp };
  }
  const rIdx = rightC.findIndex(c => c.id === id);
  if (rIdx !== -1) {
    const sp = 700 / Math.max(1, rightC.length - 1);
    return { side: 'right', labelX: 766, labelY: 100 + rIdx * sp };
  }
  return { side: 'left', labelX: 0, labelY: 0 };
};

// Gradient strings
const MAP_MASK = [
  'linear-gradient(to right,',
  '  transparent 0%,',
  '  rgba(0,0,0,0.15) 18%,',
  '  rgba(0,0,0,0.7) 34%,',
  '  black 52%,',
  '  black 100%)'
].join('');

export default function LocationSection() {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const svgRef = useRef(null);

  // New refs for the Master Timeline strict architecture
  const titleWrapperRef = useRef(null);
  const leftContentRef = useRef(null);
  const mapPanelRef = useRef(null);
  const finalDataRef = useRef(null);
  const outpostsRef = useRef(null);
  const statesRef = useRef(null);
  const introRef = useRef(null);   // Intro paragraph shown when title shifts left

  const [mapContent, setMapContent] = useState('');

  // Fetch + inline the SVG so it renders transparent against the dark background
  useEffect(() => {
    fetch('/india-map.svg')
      .then(r => r.text())
      .then(text => {
        const m = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
        if (m) setMapContent(m[1]);
      });
  }, []);

  useEffect(() => {
    if (!mapContent) return; // Wait for SVG

    const ctx = gsap.context(() => {
      // ── MASTER TIMELINE SETUP ────────────────────────────────────────────────
      // Assign abstract duration units. 1 unit roughly = 1vh of visual scrolling.
      const PH0_ENTRY_DUR = 0;   // removed: overlay was transparent, wasted scroll
      const PH1_TITLE_DUR = 1.0;
      const PH2_LAYOUT_DUR = 1.5;

      // Per-location: map moves immediately, text crossfades (no dead time)
      const STEP_MAP_DUR  = 1.2;
      const STEP_HOLD_DUR = 0.9;  // longer hold so text is readable
      // Text crossfades with map move — no sequential text dur in timeline budget
      const STEP_LOOP_DUR = STEP_MAP_DUR + STEP_HOLD_DUR; // 2.1 per location

      const PH4_ZOOM_DUR = 1.5;
      const PH5_DATA_DUR = 1.5;
      const PH6_EXPAND_DUR = 1.5;
      const PH7_END_GAP  = 0.5; // Minimal hold — just enough to absorb the final view

      const TOTAL_DUR = PH1_TITLE_DUR + PH2_LAYOUT_DUR +
        (JOURNEY.length * STEP_LOOP_DUR) +
        PH4_ZOOM_DUR + PH5_DATA_DUR + PH6_EXPAND_DUR + PH7_END_GAP;

      // TOTAL_VH controls how long the pin lasts in viewports height.
      const TOTAL_VH = TOTAL_DUR * 0.7; // Scale duration to manageable scroll height

      // ── INITIAL STATES ───────────────────────────────────────────────────────
      gsap.set('.loc-overlay', { opacity: 1 });

      gsap.set(titleWrapperRef.current, {
        xPercent: -50, yPercent: 0, left: '50%', top: '40vh', scale: 1.2, opacity: 0, y: 150, textAlign: 'center', transformOrigin: 'left top'
      });

      gsap.set(leftContentRef.current, { opacity: 0 });
      gsap.set(mapPanelRef.current, { opacity: 0, x: 300, scale: 0.7, filter: 'blur(15px)' });
      // Intro para: starts off-screen right, hidden
      gsap.set(introRef.current, { opacity: 0, x: 70 });

      gsap.set(svgRef.current, { attr: { viewBox: FULL_VB } });
      gsap.set('.marker-group .pulse-ring', { opacity: 0, display: 'none' });
      gsap.set('.marker-group .pulse-ring-primary', { opacity: 0, display: 'none' });
      gsap.set('.marker-group .solid-dot', { opacity: 0 });
      gsap.set('.trail-path', { opacity: 0 });
      gsap.set('.loc-text', { opacity: 0, y: 30 });

      gsap.set(finalDataRef.current, { opacity: 0, y: 30 });
      gsap.set('.leader-group', { opacity: 0 });
      gsap.set('.left-leader', { x: -15 });
      gsap.set('.right-leader', { x: 15 });

      // ── PRE-ENTRY: Reveal title before pin activates ───────────────────────────
      // As the user scrolls from CultureSection, the section's 100vh outer div
      // is entirely transparent. This trigger fades the heading in early so there
      // is no blank-space gap before the master timeline pin kicks in.
      gsap.fromTo(titleWrapperRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top 88%',   // fires as section enters viewport from below
            end:   'top 8%',    // finishes just before pin grabs at top:top
            scrub: 0.8,
          },
        }
      );

      // ── THE MASTER TIMELINE ──────────────────────────────────────────────────
      // ARCHITECTURE: Pin outerRef itself (trigger === pin) — the standard GSAP
      // pattern that guarantees correct pinSpacing spacer calculation.
      // Pre-compute a concrete pixel value; invalidateOnRefresh recalculates on resize.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: () => `+=${TOTAL_VH * window.innerHeight}`,
          scrub: 1.2,
          pin: true,           // pin the trigger itself (outerRef)
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      let time = 0;

      // PHASE 0: removed (overlay was transparent — no effect, just wasted scroll)

      // PHASE 1: Hold — title is already visible from pre-entry trigger.
      // We keep PH1_TITLE_DUR in the budget so Phase 2 timing is unchanged.
      // fromTo ensures the scrubbed timeline owns the element fully and
      // doesn't fight with the pre-entry trigger on reverse scroll.
      tl.fromTo(titleWrapperRef.current,
        { opacity: 1, y: 0 },
        { opacity: 1, y: 0, duration: PH1_TITLE_DUR, ease: 'none' },
        time
      );
      time += PH1_TITLE_DUR;

      // PHASE 2: Layout Transformation + Intro Para pop-in
      tl.to(titleWrapperRef.current, {
        left: '7vw', top: '15vh', xPercent: 0, yPercent: 0, scale: 0.85,
        duration: PH2_LAYOUT_DUR, ease: 'power2.inOut'
      }, time);
      tl.to(leftContentRef.current, { opacity: 1, duration: PH2_LAYOUT_DUR * 0.8, ease: 'power2.out' }, time + PH2_LAYOUT_DUR * 0.2);
      tl.to(mapPanelRef.current, {
        opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: PH2_LAYOUT_DUR, ease: 'back.out(1.2)'
      }, time);
      // Intro para slides in from right as layout settles
      tl.to(introRef.current, {
        opacity: 1, x: 0, duration: PH2_LAYOUT_DUR * 0.6, ease: 'power3.out'
      }, time + PH2_LAYOUT_DUR * 0.4);
      time += PH2_LAYOUT_DUR;

      // PHASE 3: Location Journey — crossfade text (no dead time)
      JOURNEY.forEach((loc, i) => {
        const prevLoc = i > 0 ? JOURNEY[i - 1] : null;
        const markerEl = svgRef.current.querySelector(`#m-${loc.id}`);
        const textEl = leftContentRef.current.querySelector(`#lt-${loc.id}`);
        const prevTextEl = prevLoc ? leftContentRef.current.querySelector(`#lt-${prevLoc.id}`) : null;
        const prevMarkerEl = prevLoc ? svgRef.current.querySelector(`#m-${prevLoc.id}`) : null;
        const trailEl = prevLoc ? svgRef.current.querySelector(`#trail-${prevLoc.id}`) : null;

        const loopStart = time;

        // ── Fade out intro para on very first location ───────────────────────
        if (i === 0) {
          tl.to(introRef.current, { opacity: 0, x: -40, duration: 0.4, ease: 'power2.in' }, loopStart);
        }

        // ── EXIT PREVIOUS (overlaps with new text entry) ─────────────────────
        if (prevLoc) {
          // Fast fade-out — new text crossfades over it immediately
          tl.to(prevTextEl, { opacity: 0, y: -14, duration: 0.3, ease: 'power2.in' }, loopStart);

          const prevPulseClass = prevLoc.primary ? '.pulse-ring-primary' : '.pulse-ring';
          tl.to(prevMarkerEl.querySelector(prevPulseClass), { opacity: 0, duration: 0.2 }, loopStart);
          tl.set(prevMarkerEl.querySelector(prevPulseClass), { display: 'none' }, loopStart + 0.2);
          tl.to(prevMarkerEl.querySelector('.solid-dot'), { opacity: 0.5, duration: 0.7 }, loopStart);
        }

        // ── MAP MOVE — starts immediately, no delay ──────────────────────────
        const vb = viewBoxFor(loc.svgX, loc.svgY, loc.zoom);
        tl.to(svgRef.current, {
          attr: { viewBox: vb }, duration: STEP_MAP_DUR, ease: 'power2.inOut'
        }, loopStart);

        // ── TRAIL ANIMATE ────────────────────────────────────────────────────
        if (trailEl) {
          const pathLen = trailEl.getTotalLength ? trailEl.getTotalLength() : 300;
          tl.set(trailEl, { strokeDasharray: pathLen, strokeDashoffset: pathLen, opacity: 0 }, loopStart);
          tl.to(trailEl, {
            strokeDashoffset: 0, opacity: 0.8, duration: STEP_MAP_DUR, ease: 'power2.inOut'
          }, loopStart);
          tl.to(trailEl, { opacity: 0, duration: 0.3, ease: 'power2.in' }, loopStart + STEP_MAP_DUR);
        }

        // ── MARKER ACTIVATE at 96% of map move — viewBox fully settled ───────
        const arrivalTime = loopStart + STEP_MAP_DUR * 0.96;
        const pulseClass = loc.primary ? '.pulse-ring-primary' : '.pulse-ring';
        const activeColor = loc.primary ? '#C4476A' : 'rgba(197,164,109,1)';
        tl.set(markerEl.querySelector(pulseClass), { display: 'block' }, arrivalTime);
        tl.to(markerEl.querySelector(pulseClass), { opacity: 1, duration: 0.15 }, arrivalTime);
        tl.to(markerEl.querySelector('.solid-dot'), { opacity: 1, duration: 0.2 }, arrivalTime);

        // ── TEXT ENTRY — starts at 30% of map move (crossfades with exit) ───
        const textStart = loopStart + STEP_MAP_DUR * 0.3;
        tl.to(textEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, textStart);

        // Advance time by one loop slot — text duration is absorbed into map move
        time += STEP_LOOP_DUR;
      });

      // PHASE 4: Final Zoom Out
      const lastLoc = JOURNEY[JOURNEY.length - 1];
      const lastTextEl = leftContentRef.current.querySelector(`#lt-${lastLoc.id}`);

      tl.to(lastTextEl, { opacity: 0, y: -20, duration: PH4_ZOOM_DUR * 0.5 }, time);
      tl.to(svgRef.current, { attr: { viewBox: FULL_VB }, duration: PH4_ZOOM_DUR, ease: 'power2.inOut' }, time);

      // Reveal ALL pulses and markers for a grand finale
      tl.set(['.pulse-ring', '.pulse-ring-primary'], { display: 'block' }, time + PH4_ZOOM_DUR * 0.4);
      tl.to(['.pulse-ring', '.pulse-ring-primary'], { opacity: 1, duration: PH4_ZOOM_DUR * 0.6 }, time + PH4_ZOOM_DUR * 0.4);
      tl.to('.solid-dot', { 
        opacity: 1, 
        duration: PH4_ZOOM_DUR * 0.6, 
        stagger: { each: 0.02, from: 'center' },
        ease: 'power2.out'
      }, time + PH4_ZOOM_DUR * 0.4);

      time += PH4_ZOOM_DUR;

      // PHASE 5: Final Data Reveal
      tl.to(finalDataRef.current, { opacity: 1, y: 0, duration: PH5_DATA_DUR, ease: 'power2.out' }, time);

      const countObj = { outposts: 0, states: 0 };
      tl.to(countObj, {
        outposts: 19, states: 11, duration: PH5_DATA_DUR, ease: 'power2.out',
        onUpdate: () => {
          if (outpostsRef.current) outpostsRef.current.innerText = Math.floor(countObj.outposts) + '+';
          if (statesRef.current) statesRef.current.innerText = Math.floor(countObj.states);
        }
      }, time);

      time += PH5_DATA_DUR;

      // PHASE 6: Final Expansion
      tl.to('.left-leader', { opacity: 1, x: 0, stagger: 0.05, duration: PH6_EXPAND_DUR, ease: 'power2.out' }, time);
      tl.to('.right-leader', { opacity: 1, x: 0, stagger: 0.05, duration: PH6_EXPAND_DUR, ease: 'power2.out' }, time);

      // Force GSAP to sort all active ScrollTriggers by DOM order.
      // This is critical because LocationSection creates its trigger async AFTER ReserveSection,
      // so without sorting, ReserveSection calculates its start position before LocationSection's spacer is ready.
      ScrollTrigger.sort();

    }, outerRef);

    // After the pin initializes its spacer div, force all downstream sections
    // (ReserveSection, QuickBookSection) to recalculate their trigger positions.
    // Double-rAF: first frame = GSAP commits spacer to DOM, second = browser reflows.
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ctx.revert();
    };
  }, [mapContent]);

  return (
    <div
      ref={outerRef}
      id="locations"
      style={{ position: 'relative', height: '100vh', width: '100%', background: 'transparent', zIndex: 1 }}
    >
      <div ref={stickyRef} style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>

        {/* Removed Top/bottom vignette to eliminate horizontal bands */}

        {/* ── TITLE CONTAINER ───────────────────────────────────────────────────── */}
        <div
          ref={titleWrapperRef}
          style={{
            position: 'absolute', zIndex: 15, pointerEvents: 'none',
            width: 'max-content', maxWidth: '44vw',
            willChange: 'transform, opacity, left, top',
          }}
        >
          <span className="section-tag" style={{ display: 'block', marginBottom: 10, letterSpacing: '0.5em', textAlign: 'inherit' }}>
            Our Empire
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(2.6rem, 4.2vw, 4.4rem)',
            color: 'var(--ivory)', lineHeight: 1.05, marginBottom: 0,
            textAlign: 'inherit',
          }}>
            A Kingdom Across <em style={{ color: 'var(--gold)' }}>India</em>
          </h2>
        </div>

        {/* ── LEFT PANEL (30%) ──────────────────────────────────────────────────── */}
        <div
          ref={leftContentRef}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%',
            zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 2vw 0 7vw', pointerEvents: 'none',
          }}
        >
          {/* Subtle text-legibility gradient — softer than before, no dark blob */}
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(to right, rgba(14,6,12,0.82) 40%, rgba(14,6,12,0.45) 65%, transparent 100%)' }} />

          <div style={{ position: 'relative', marginTop: '12vh' }}>
            <div className="gold-divider-left" style={{ marginBottom: 40 }} />

            <div style={{ position: 'relative', minHeight: 280 }}>
              {JOURNEY.map((loc) => (
                <div
                  key={loc.id} id={`lt-${loc.id}`} className="loc-text"
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, willChange: 'transform, opacity' }}
                >
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
                    fontSize: 'clamp(1.8rem, 2.8vw, 3.2rem)',
                    color: 'var(--ivory)', lineHeight: 1.08, marginBottom: 18,
                  }}>
                    {loc.city}
                  </h3>
                  <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)', marginBottom: 18 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', lineHeight: 1.82, color: 'var(--ivory-dim)', maxWidth: 360, marginBottom: 24 }}>
                    {loc.desc}
                  </p>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: loc.primary ? 'var(--gold)' : 'var(--maroon)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--sand)', textTransform: 'uppercase', letterSpacing: '0.22em' }}>
                        {loc.region}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                      {loc.tag}
                    </div>
                  </div>
                </div>
              ))}

              {/* INTRO PARA — shown when title shifts left, before first location */}
              <div
                ref={introRef}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, willChange: 'transform, opacity' }}
              >
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.02rem', lineHeight: 1.85,
                  color: 'var(--ivory-dim)', maxWidth: 360,
                  marginBottom: 24,
                }}>
                  From the rose-red streets of Jaipur, a culinary empire was born — now stretching across 
                  <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>19 royal outposts</em>
                   in 11 states of India, united by the soul of Rajputana hospitality.
                </p>
                <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
              </div>

              {/* FINAL DATA REVEAL */}
              <div
                ref={finalDataRef}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, willChange: 'transform, opacity' }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ivory-dim)', maxWidth: 380, marginBottom: 48 }}>
                  With over 19 majestic outposts bridging these historic landscapes, Ghoomar Village weaves a tapestry of diverse cultures tightly together, bound by our shared reverence for the royal feast.
                </p>
                <div style={{ display: 'flex', gap: 48 }}>
                  <div>
                    <div ref={outpostsRef} style={{ fontFamily: 'var(--font-royal)', fontSize: '2.8rem', color: 'var(--gold)', lineHeight: 1 }}>0+</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--sand)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 8 }}>Royal Outposts</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(197,164,109,0.2)', alignSelf: 'stretch' }} />
                  <div>
                    <div ref={statesRef} style={{ fontFamily: 'var(--font-royal)', fontSize: '2.8rem', color: 'var(--gold)', lineHeight: 1 }}>0</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--sand)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 8 }}>States</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAP PANEL (70%) ───────────────────────────────────────────────────── */}
        <div
          ref={mapPanelRef}
          style={{
            position: 'absolute', right: '-3vw', top: '-4vh', bottom: '-6vh', width: '75vw', zIndex: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            maskImage: MAP_MASK, WebkitMaskImage: MAP_MASK,
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1,
            background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(142,31,60,0.2) 0%, transparent 70%)',
          }} />

          {/* Wait until mapContent is loaded to render svg container to avoid ref issues during initialization */}
          {mapContent && (
            <svg
              ref={svgRef}
              viewBox={FULL_VB}
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative', top: 10 }}
            >
              <defs>
                <style>{`
                  @keyframes markerPulse {
                    0%   { transform: scale(0.5); opacity: 0; }
                    30%  { opacity: 0.8; }
                    100% { transform: scale(1.6); opacity: 0; }
                  }
                  .pulse-ring, .pulse-ring-primary {
                    transform-box: fill-box;
                    transform-origin: center;
                    animation: markerPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    pointer-events: none;
                  }
                `}</style>
              </defs>

              <g dangerouslySetInnerHTML={{ __html: mapContent }} />

              <g id="trails">
                {JOURNEY.slice(0, -1).map((loc, i) => (
                  <path
                    key={`trail-${loc.id}`} id={`trail-${loc.id}`} className="trail-path"
                    d={trailPath(loc, JOURNEY[i + 1])}
                    fill="none" stroke="rgba(197,164,109,0.7)" strokeWidth="2" strokeLinecap="round"
                  />
                ))}
              </g>

              <g id="leader-lines">
                {JOURNEY.map((loc) => {
                  const ld = getLabelData(loc.id);
                  const isLeft = ld.side === 'left';
                  return (
                    <g key={`leader-${loc.id}`} className={`leader-group ${isLeft ? 'left-leader' : 'right-leader'}`}>
                      <path
                        d={`M ${loc.svgX} ${loc.svgY} C ${(loc.svgX + ld.labelX) / 2} ${loc.svgY}, ${(loc.svgX + ld.labelX) / 2} ${ld.labelY}, ${ld.labelX} ${ld.labelY}`}
                        fill="none" stroke="rgba(197,164,109,0.35)" strokeWidth="1" strokeDasharray="4 4"
                      />
                      <text
                        x={isLeft ? ld.labelX - 10 : ld.labelX + 10}
                        y={ld.labelY + 4}
                        fill="rgba(234,220,212,0.9)" fontFamily="var(--font-royal)" fontSize="13" letterSpacing="0.08em"
                        textAnchor={isLeft ? 'end' : 'start'}
                      >
                        {loc.city}
                      </text>
                    </g>
                  );
                })}
              </g>

              <g id="markers">
                {JOURNEY.map((loc, i) => {
                  const sz = loc.primary ? 9.5 : 6;
                  const headY = loc.svgY - sz * 2.4;
                  const pinColor = loc.primary ? '#C4476A' : 'rgba(197,164,109,1)';
                  const pulseColor = loc.primary ? 'rgba(196,71,106,0.4)' : 'rgba(197,164,109,0.3)';
                  return (
                    <g key={loc.id} id={`m-${loc.id}`} className="marker-group">
                      {/* Pulse ring around pin head */}
                      <circle
                        className={loc.primary ? 'pulse-ring-primary' : 'pulse-ring'}
                        cx={loc.svgX} cy={headY}
                        r={loc.primary ? sz * 2.2 : sz * 1.8}
                        fill={pulseColor}
                        style={{ animationDelay: `${((i * 0.35) % 3).toFixed(2)}s` }}
                      />
                      {/* Pin: tip at (svgX, svgY), body extends upward */}
                      <g
                        className="solid-dot"
                        transform={`translate(${loc.svgX}, ${loc.svgY})`}
                        style={{ transformBox: 'fill-box', transformOrigin: '50% 29%' }}
                      >
                        <path
                          d={pinPath(sz)}
                          fill={pinColor}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="0.6"
                        />
                        {/* Inner circle hole */}
                        <circle
                          cx={0} cy={-sz * 2.4} r={sz * 0.42}
                          style={{ fill: 'rgba(255,255,255,0.92)' }}
                        />
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
