import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY = [
  { id: 'amritsar', city: 'Amritsar', region: 'Punjab', tag: 'The Golden City', desc: 'In a city where langar feeds the faithful daily, our Rajputana thali brings its own form of devotion. Twenty-four dishes, served unlimited, in the same spirit of abundance that has always defined this sacred land.', svgX: 186, svgY: 173, zoom: 5 },
  { id: 'ludhiana', city: 'Ludhiana', region: 'Punjab', tag: 'Heart of Punjab', desc: 'Punjab\'s great appetite deserves a table worthy of its boldness. Our Ludhiana kitchen serves the full ceremony of the Rajasthani thali to a city that has always celebrated eating as an act of joy and generosity.', svgX: 213, svgY: 194, zoom: 5 },
  { id: 'mohali', city: 'Mohali', region: 'Chandigarh', tag: 'The Twin City', desc: 'Mohali\'s modern sensibility meets Rajputana tradition at our table. Guests from across Chandigarh come to sit with a thali of twenty-four courses, each one a quiet reminder of what unhurried dining truly feels like.', svgX: 238, svgY: 199, zoom: 5 },
  { id: 'pitampura', city: 'Pitampura', region: 'Delhi', tag: 'Capital\'s North', desc: 'In the residential heart of North Delhi, we have built a table where families return again and again. The unlimited Rajasthani thali here is not just a meal; it is the ritual that brings generations together under one roof.', svgX: 248, svgY: 258, zoom: 9 },
  { id: 'cp', city: 'Connaught Place', region: 'Delhi', tag: 'The Imperial Core', desc: 'Our Connaught Place kitchen sits at the centre of the capital, serving the full weight of Rajputana cuisine to those who lead and those who seek. It is our most visited table, and perhaps our proudest one.', svgX: 250, svgY: 261, zoom: 9 },
  { id: 'vasantkunj', city: 'Vasant Kunj', region: 'Delhi', tag: 'The Southern Court', desc: 'Nestled at the edge of Delhi\'s Aravalli forest, our Vasant Kunj table offers the Ghoomar thali experience in a setting of genuine calm. Here, the food arrives the way it should: slowly, generously, and with great care.', svgX: 248, svgY: 264, zoom: 9 },
  { id: 'gurugram', city: 'Gurugram', region: 'Delhi NCR', tag: 'The Millennium City', desc: 'Our grandest court. Ghoomar Village in Gurugram spans 25,000 square feet of living Rajasthani culture. The thali is only the beginning. Folk musicians, open courtyards and heritage craft make every dinner a full evening of celebration.', svgX: 245, svgY: 266, zoom: 9 },
  { id: 'noida', city: 'Noida', region: 'Delhi NCR', tag: 'Eastern Gateway', desc: 'East of the Yamuna, our Noida kitchen draws families seeking the full Rajasthani thali experience. Twenty-four dishes served with the patience that fast food has long forgotten, in a city still discovering what a great meal can feel like.', svgX: 253, svgY: 263, zoom: 9 },
  { id: 'ghaziabad', city: 'Ghaziabad', region: 'Delhi NCR', tag: 'Gateway to the Doab', desc: 'On the ancient trade road where Rajput and Mughal histories once crossed, our Ghaziabad table serves a thali that carries the richness of both. Rich dals, stone-ground spices and ghee-touched rotis made fresh for every guest.', svgX: 256, svgY: 260, zoom: 8 },
  { id: 'agra', city: 'Agra', region: 'Uttar Pradesh', tag: 'City of the Taj', desc: 'In a city where emperors built for eternity, we serve a meal with equal devotion. Our Agra thali is crafted with the same precision that defines this city, each of its twenty-four dishes a small act of lasting craft and care.', svgX: 271, svgY: 303, zoom: 4.5 },
  { id: 'kanpur', city: 'Kanpur', region: 'Uttar Pradesh', tag: 'Heart of the Doab', desc: 'Kanpur has always known how to feast. Our Rajasthani thali here honours that tradition: rich Marwari curries, dal baati churma, and the full spread of a royal kitchen served unlimited to a city with a long memory for good food.', svgX: 335, svgY: 325, zoom: 4 },
  { id: 'patna', city: 'Patna', region: 'Bihar', tag: 'Ancient Pataliputra', desc: 'On the banks of the Ganga where Chandragupta once ruled, our Patna kitchen brings a Rajasthani feast to a city of deep culinary pride. Two great traditions of the north share the same table, and guests leave with both in their memory.', svgX: 465, svgY: 350, zoom: 3.8 },
  { id: 'guwahati', city: 'Guwahati', region: 'Assam', tag: 'Gateway to the East', desc: 'Our furthest reach, and perhaps our most warmly welcomed. In Guwahati, where the Brahmaputra runs wide, our Rajputana thali arrived as something entirely new. It is now the table that the northeast\'s food lovers travel to find.', svgX: 644, svgY: 333, zoom: 3.2 },
  { id: 'bhopal', city: 'Bhopal', region: 'Madhya Pradesh', tag: 'City of Lakes', desc: 'Between two shimmering lakes and beneath Nawabi domes, our Bhopal table offers a Rajputana thali to a city that has always valued refined dining. The depth of a slow-cooked dal is not lost on those who have grown up beside royal water.', svgX: 255, svgY: 419, zoom: 4.2 },
  { id: 'vadodara', city: 'Vadodara', region: 'Gujarat', tag: 'The Cultural Capital', desc: 'Maharaja Sayajirao\'s city has long had the finest taste in India. Our Vadodara kitchen was welcomed here as a natural equal. The Rajasthani thali, with its parade of seasonal dishes and sweet endings, feels perfectly and permanently at home.', svgX: 141, svgY: 447, zoom: 4.5 },
  { id: 'pune', city: 'Pune', region: 'Maharashtra', tag: 'Oxford of the East', desc: 'Where Peshwa courts once gathered the finest minds, our Pune kitchen now gathers those who still believe that a meal deserves full attention. Twenty-four dishes made from memory and mastery, for a city that truly understands craft.', svgX: 159, svgY: 558, zoom: 4.2 },
  { id: 'goa', city: 'Goa', region: 'Goa', tag: 'Pearl of the Orient', desc: 'Our Goa table is where the ceremony of Rajputana meets the ease of the coast. For guests who come here chasing sea and sunlight, the royal thali offers a different discovery: the quieter pleasure of food made with patience and pride.', svgX: 155, svgY: 660, zoom: 4.8 },
  { id: 'mangalore', city: 'Mangalore', region: 'Karnataka', tag: 'Port of Perfumes', desc: 'In a city shaped by centuries of the spice trade, our kitchen was received with an expert eye. Mangalore\'s cooks and food lovers recognised the quality in every dish and the care in every preparation, and they welcomed us warmly for it.', svgX: 186, svgY: 723, zoom: 4.8 },
  { id: 'jaipur', city: 'Jaipur', region: 'Rajasthan', tag: 'The Origin, The Pink City', desc: 'Every dish served at every Ghoomar table across India traces its soul back here, to the ancestral kitchen of the Pink City. Jaipur is not simply where we began. It is the reason every meal we serve carries the taste of something real and lasting.', svgX: 211, svgY: 311, zoom: 4.5, primary: true },
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

const pinPath = (sz) =>
  `M 0,0 C ${-sz * 0.4},${-sz * 0.9} ${-sz},${-sz * 1.7} ${-sz},${-sz * 2.4}` +
  ` A ${sz},${sz} 0 1,1 ${sz},${-sz * 2.4}` +
  ` C ${sz},${-sz * 1.7} ${sz * 0.4},${-sz * 0.9} 0,0 Z`;

const MAP_MASK = [
  'linear-gradient(to right,',
  '  transparent 0%,',
  '  rgba(0,0,0,0.15) 18%,',
  '  rgba(0,0,0,0.7) 34%,',
  '  black 52%,',
  '  black 100%)'
].join('');

export default function MobileLocationSection({ mapContent }) {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const svgRef = useRef(null);
  const titleWrapperRef = useRef(null);

  useEffect(() => {
    if (!mapContent) return;

    const ctx = gsap.context(() => {
      const PH1_TITLE_DUR = 0.5;
      const PH2_LAYOUT_DUR = 0.9;
      
      const STEP_MAP_DUR = 1.2;
      const STEP_HOLD_DUR = 1.2; // slightly longer hold for reading on mobile
      const STEP_LOOP_DUR = STEP_MAP_DUR + STEP_HOLD_DUR;

      const PH4_ZOOM_DUR = 1.5;
      const PH5_END_GAP = 0.5;

      const TOTAL_DUR = PH1_TITLE_DUR + PH2_LAYOUT_DUR +
        (JOURNEY.length * STEP_LOOP_DUR) +
        PH4_ZOOM_DUR + PH5_END_GAP;

      // Ensure enough scroll height for the whole journey
      const TOTAL_VH = TOTAL_DUR * 0.35; 

      // ── INITIAL STATES ──
      gsap.set(titleWrapperRef.current, {
        opacity: 0, y: 100
      });

      gsap.set(svgRef.current, { attr: { viewBox: FULL_VB } });
      gsap.set('.marker-group .pulse-ring', { opacity: 0, display: 'none' });
      gsap.set('.marker-group .pulse-ring-primary', { opacity: 0, display: 'none' });
      gsap.set('.marker-group .solid-dot', { opacity: 0 });
      gsap.set('.trail-path', { opacity: 0 });
      
      // All cards start invisible
      gsap.set('.loc-mobile-card', { opacity: 0, y: 30, pointerEvents: 'none' });
      
      // Final summary
      gsap.set('.loc-mobile-final', { opacity: 0, y: 30, pointerEvents: 'none' });

      // ── PRE-ENTRY ──
      gsap.fromTo(titleWrapperRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1, y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.6,
          },
        }
      );

      // ── THE MASTER TIMELINE ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: () => `+=${TOTAL_VH * window.innerHeight}`,
          scrub: 0.7,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      let time = 0;

      // Title floats up slightly and map fades in
      time += PH1_TITLE_DUR;

      tl.fromTo('.loc-mobile-map-box', 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: PH2_LAYOUT_DUR, ease: 'expo.out' },
        time
      );
      time += PH2_LAYOUT_DUR;

      // ── SEQUENTIAL JOURNEY ──
      JOURNEY.forEach((loc, i) => {
        const nextLoc = JOURNEY[i + 1];

        // 1. Show this location's marker
        tl.to(`#m-${loc.id} .solid-dot`, { opacity: 1, duration: 0.3 }, time);
        tl.to(`#m-${loc.id} .pulse-ring`, { display: 'block', opacity: 1, duration: 0.4 }, time);
        if (loc.primary) {
          tl.to(`#m-${loc.id} .pulse-ring-primary`, { display: 'block', opacity: 1, duration: 0.4 }, time);
        }

        // Show this location's card
        tl.to(`#card-${loc.id}`, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5 }, time);

        // Map movement - slightly zoomed out compared to desktop for better mobile context
        tl.to(svgRef.current, {
          attr: { viewBox: viewBoxFor(loc.svgX, loc.svgY, loc.zoom * 0.8) },
          duration: STEP_MAP_DUR,
          ease: 'power2.inOut'
        }, time);

        time += STEP_MAP_DUR;
        time += STEP_HOLD_DUR;

        // 2. Transition to next (hide text, show trail)
        if (nextLoc) {
          tl.to(`#card-${loc.id}`, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.4 }, time - 0.2);
          tl.to(`#trail-${loc.id}`, { opacity: 1, strokeDashoffset: 0, duration: 0.6 }, time - 0.1);
        } else {
          // Hide last card before final zoom out
          tl.to(`#card-${loc.id}`, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.4 }, time - 0.2);
        }
      });

      // ── FINAL ZOOM OUT ──
      tl.to(svgRef.current, {
        attr: { viewBox: FULL_VB },
        duration: PH4_ZOOM_DUR,
        ease: 'expo.inOut'
      }, time);

      tl.to('.marker-group .solid-dot', { opacity: 1, duration: 1 }, time);
      
      // Show summary data
      tl.to('.loc-mobile-final', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' }, time + PH4_ZOOM_DUR * 0.5);

      time += PH4_ZOOM_DUR;
      time += PH5_END_GAP;

    }, outerRef);

    return () => ctx.revert();
  }, [mapContent]);

  return (
    <div
      ref={outerRef}
      id="locations-mobile-pin"
      style={{
        position: 'relative',
        width: '100vw',
        background: 'transparent',
        isolation: 'isolate',
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: '-10%', zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(97, 14, 36, 0.12) 0%, transparent 60%)',
        }} />

        {/* ── TOP: Title ── */}
        <div
          ref={titleWrapperRef}
          style={{
            position: 'relative', zIndex: 10,
            padding: '12vh 24px 4vh',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <span className="section-tag" style={{ letterSpacing: '0.45em', display: 'block', marginBottom: 12 }}>
            Our Empire
          </span>
          <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: 0, lineHeight: 1.1 }}>
            Across the <em>Nation</em>
          </h2>
        </div>

        {/* ── MIDDLE: Map Container ── */}
        <div className="loc-mobile-map-box" style={{ 
          position: 'relative', flex: 1, zIndex: 5,
          margin: '0 24px', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {mapContent && (
            <svg
              ref={svgRef}
              viewBox={FULL_VB}
              style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <style>{`
                  .trail-path {
                    transition: stroke-dashoffset 0.6s ease;
                  }
                  .pulse-ring, .pulse-ring-primary {
                    transform-box: fill-box;
                    transform-origin: center;
                    animation: markerPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  }
                `}</style>
              </defs>

              <g dangerouslySetInnerHTML={{ __html: mapContent }} />

              <g id="trails">
                {JOURNEY.slice(0, -1).map((loc, i) => (
                  <path
                    key={`trail-${loc.id}`} id={`trail-${loc.id}`} className="trail-path"
                    d={trailPath(loc, JOURNEY[i + 1])}
                    fill="none" stroke="rgba(197,164,109,0.7)" strokeWidth="3" strokeLinecap="round"
                  />
                ))}
              </g>

              <g id="markers-mobile">
                {JOURNEY.map((loc, i) => {
                  const sz = loc.primary ? 16 : 10;
                  const headY = loc.svgY - sz * 2.4;
                  const pinColor = loc.primary ? '#C4476A' : 'rgba(197,164,109,1)';
                  const pulseColor = loc.primary ? 'rgba(196,71,106,0.4)' : 'rgba(197,164,109,0.3)';
                  return (
                    <g key={loc.id} id={`m-${loc.id}`} className="marker-group">
                      <circle
                        className={loc.primary ? 'pulse-ring-primary' : 'pulse-ring'}
                        cx={loc.svgX} cy={headY}
                        r={loc.primary ? sz * 2.2 : sz * 1.8}
                        fill={pulseColor}
                        style={{ animationDelay: `${((i * 0.35) % 3).toFixed(2)}s` }}
                      />
                      <g
                        className="solid-dot"
                        transform={`translate(${loc.svgX}, ${loc.svgY})`}
                        style={{ transformBox: 'fill-box', transformOrigin: '50% 29%' }}
                      >
                        <path
                          d={pinPath(sz)}
                          fill={pinColor}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
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

        {/* ── BOTTOM: Cards Container ── */}
        <div style={{ position: 'relative', height: '28vh', minHeight: 220, zIndex: 10, margin: '20px 24px 4vh' }}>
          {JOURNEY.map((loc) => (
            <div 
              key={loc.id} 
              id={`card-${loc.id}`} 
              className="loc-mobile-card" 
              style={{ 
                position: 'absolute', inset: 0,
                background: 'rgba(26,10,19,0.75)', border: '1px solid rgba(230,185,92,0.15)', 
                padding: '24px 20px', borderRadius: 12,
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.6rem', color: 'var(--ivory)', margin: 0 }}>{loc.city}</h3>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '0.15em' }}>{loc.region}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.8, color: 'var(--ivory-dim)', margin: 0 }}>{loc.desc}</p>
            </div>
          ))}

          {/* Final Summary Card */}
          <div 
            className="loc-mobile-final"
            style={{ 
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at center, rgba(142,31,60,0.2) 0%, rgba(26,10,19,0.8) 100%)', 
              border: '1px solid rgba(230,185,92,0.25)', 
              padding: '24px', borderRadius: 12,
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '16vw', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--sand)', marginBottom: 8 }}>Outposts</span>
                <span style={{ fontFamily: 'var(--font-royal)', fontSize: '3.2rem', color: 'var(--gold)', lineHeight: 1 }}>28</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--sand)', marginBottom: 8 }}>States</span>
                <span style={{ fontFamily: 'var(--font-royal)', fontSize: '3.2rem', color: 'var(--gold)', lineHeight: 1 }}>09</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
