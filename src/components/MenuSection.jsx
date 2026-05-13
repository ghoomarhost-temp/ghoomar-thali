import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MENU_ITEMS, CATEGORIES } from '../menuData.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTargetRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w  = Math.min(Math.max(vw * 0.70, 360), 1100);
  const h  = Math.min(Math.max(vh * 0.72, 420), 780);
  return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MenuSection() {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const filterRef   = useRef(null);
  const filterBarRef = useRef(null); // the scrollable pill container
  const gridRef     = useRef(null);
  const cardRef     = useRef(null);
  const contentRef  = useRef(null);
  const originRef   = useRef(null);
  const closingRef  = useRef(false);
  const scrollRafRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedDish, setSelectedDish] = useState(null);
  const [gridKey,      setGridKey]      = useState(0);
  const [showLeft,     setShowLeft]     = useState(false);
  const [showRight,    setShowRight]    = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [columns,      setColumns]      = useState(5);

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w <= 400) setColumns(1);
      else if (w <= 640) setColumns(2);
      else if (w <= 900) setColumns(3);
      else if (w <= 1200) setColumns(4);
      else setColumns(5);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const isPaginatingRef = useRef(false);
  const prevCountRef = useRef(0);

  const interleavedAllItems = useMemo(() => {
    const categoryGroups = {};
    CATEGORIES.forEach(cat => { if (cat !== 'ALL') categoryGroups[cat] = []; });
    MENU_ITEMS.forEach(item => {
      if (categoryGroups[item.category]) categoryGroups[item.category].push(item);
    });
    
    const mixed = [];
    let added = true;
    let index = 0;
    while (added) {
      added = false;
      for (const cat of CATEGORIES) {
        if (cat !== 'ALL' && categoryGroups[cat] && index < categoryGroups[cat].length) {
          mixed.push(categoryGroups[cat][index]);
          added = true;
        }
      }
      index++;
    }
    return mixed;
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'ALL') {
      return interleavedAllItems.slice(0, visibleCount);
    }
    return MENU_ITEMS.filter(item => item.category === activeFilter);
  }, [activeFilter, visibleCount, interleavedAllItems]);

  useEffect(() => {
    prevCountRef.current = filteredItems.length;
  }, [filteredItems.length]);

  // ── Arrow visibility ───────────────────────────────────────────────────────
  const updateArrows = useCallback(() => {
    const el = filterBarRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  // ── Smooth scroll on arrow hold ────────────────────────────────────────────
  const startScroll = useCallback((dir) => {
    const el = filterBarRef.current;
    if (!el) return;
    const step = () => {
      el.scrollLeft += dir * 4;
      scrollRafRef.current = requestAnimationFrame(step);
    };
    scrollRafRef.current = requestAnimationFrame(step);
  }, []);

  const stopScroll = useCallback(() => {
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
  }, []);

  // ── Scroll reveals ────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(filterRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: filterRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Grid reveal on scroll ─────────────────────────────────────────────────
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (!items?.length) return;
    const st = ScrollTrigger.create({
      trigger: gridRef.current, start: 'top 85%', once: true,
      onEnter: () => {
        const stagger = Math.min(0.06, 0.8 / items.length);
        gsap.fromTo(items,
          { opacity: 0, scale: 0.82, y: 28 },
          { opacity: 1, scale: 1, y: 0, stagger, duration: 0.55, ease: 'power3.out', overwrite: 'auto',
            onComplete() { gsap.set(items, { clearProps: 'all' }); } }
        );
      },
    });
    return () => st.kill();
  }, []);

  // ── Stagger re-entry on filter change ────────────────────────────────────
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (!items?.length) return;
    const stagger = Math.min(0.055, 0.8 / items.length);
    gsap.fromTo(items,
      { opacity: 0, scale: 0.82, y: 24 },
      { opacity: 1, scale: 1, y: 0, stagger, duration: 0.5, ease: 'power3.out', overwrite: 'auto',
        onComplete() { gsap.set(items, { clearProps: 'all' }); } }
    );
    // NOTE: Do NOT call ScrollTrigger.refresh() here — it forces a full-page
    // layout recalc that repositions the Legacy section's pinned container,
    // causing the overlap glitch and jank on every category filter change.
  }, [gridKey, activeFilter]);

  const mountedRef = useRef(false);

  // ── GSAP ScrollTrigger Refresh on DOM Size Change ─────────────────────────
  // When the menu changes height (filtering or loading more), elements below it
  // must have their ScrollTriggers recalculated. Double requestAnimationFrame
  // ensures the DOM has completely painted the new items before we measure.
  // Skip on initial mount — the full refresh on mount disrupts the Legacy
  // section's pinning context and adds unnecessary startup jank.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [filteredItems.length]);

  // ── ResizeObserver ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // no-op: layout handled by window resize in App.jsx and height effect above
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Collapse card ─────────────────────────────────────────────────────────
  const closeCard = useCallback((silent = false) => {
    if (closingRef.current) return;
    if (silent) { setSelectedDish(null); return; }
    const card    = cardRef.current;
    const content = contentRef.current;
    const origin  = originRef.current;
    if (!card || !origin) { setSelectedDish(null); return; }
    closingRef.current = true;
    gsap.to(content, { opacity: 0, y: 10, duration: 0.20, ease: 'power2.in' });
    gsap.to('.dish-expand-backdrop', { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
    gsap.to(card, { opacity: 0, scale: 0.98, duration: 0.35, ease: 'power2.inOut',
      onComplete: () => { closingRef.current = false; setSelectedDish(null); },
    });
  }, []);

  // ── Filter handler ────────────────────────────────────────────────────────
  const handleFilter = useCallback((cat) => {
    if (cat === activeFilter) return;
    closeCard(true);
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (items?.length) {
      gsap.to(items, {
        opacity: 0, scale: 0.88, duration: 0.22, ease: 'power2.in',
        onComplete: () => { 
          setActiveFilter(cat); 
          setVisibleCount(10);
          setGridKey(k => k + 1); 
        },
      });
    } else {
      setActiveFilter(cat);
      setVisibleCount(10);
      setGridKey(k => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, closeCard]);

  // ── Pagination logic ──────────────────────────────────────────────────────
  const handleShowMore = () => {
    isPaginatingRef.current = true;
    setVisibleCount(c => c + 10);
  };

  useEffect(() => {
    if (isPaginatingRef.current) {
      isPaginatingRef.current = false;
      const items = Array.from(gridRef.current?.querySelectorAll('.menu-circle-item') || []);
      const newItems = items.slice(prevCountRef.current);
      if (newItems.length) {
        const stagger = Math.min(0.055, 0.8 / newItems.length);
        gsap.fromTo(newItems,
          { opacity: 0, scale: 0.82, y: 24 },
          { opacity: 1, scale: 1, y: 0, stagger, duration: 0.5, ease: 'power3.out', overwrite: 'auto',
            onComplete() { gsap.set(newItems, { clearProps: 'all' }); } }
        );
      }
    }
  }, [visibleCount]);

  // ── Expand card ───────────────────────────────────────────────────────────
  const handleDishClick = useCallback((item, e) => {
    if (closingRef.current) return;
    if (selectedDish?.id === item.id) { closeCard(); return; }
    const circleEl = e.currentTarget.querySelector('.menu-circle-img-wrap');
    const rect = circleEl
      ? circleEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    originRef.current = rect;
    setSelectedDish(item);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDish]);

  useEffect(() => {
    if (!selectedDish || !cardRef.current) {
      document.documentElement.classList.remove('no-scroll');
      window.dispatchEvent(new Event('lenis:start'));
      return;
    }
    document.documentElement.classList.add('no-scroll');
    window.dispatchEvent(new Event('lenis:stop'));
    const card    = cardRef.current;
    const content = contentRef.current;
    const origin  = originRef.current;
    const target  = getTargetRect();
    closingRef.current = false;
    gsap.set(card, {
      position: 'fixed', left: origin.left, top: origin.top,
      width: origin.width, height: origin.height,
      borderRadius: '50%', opacity: 1, scale: 1, zIndex: 200,
    });
    gsap.set(content, { opacity: 0, y: 14 });
    gsap.to(card, { left: target.left, top: target.top, width: target.width, height: target.height, borderRadius: '28px', duration: 0.62, ease: 'power3.inOut' });
    gsap.to(content, { opacity: 1, y: 0, duration: 0.42, delay: 0.38, ease: 'power2.out' });
  }, [selectedDish]);



  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeCard(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCard]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={sectionRef} id="menu" className="royal-menu-section">

      {/* Top guard */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--black)', zIndex: 30, pointerEvents: 'none' }} />

      {/* Ambient glows */}
      <div className="menu-bg-glow menu-bg-glow--left"  aria-hidden />
      <div className="menu-bg-glow menu-bg-glow--right" aria-hidden />

      {/* Palace silhouette */}
      <div className="menu-palace-silhouette" aria-hidden>
        <img src="/images/hero_scene_2_mahal_1776800171800.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom' }} />
      </div>

      {/* ── Header ── */}
      <div ref={headerRef} className="menu-header">
        <span className="section-tag" style={{ letterSpacing: '0.5em' }}>Culinary Legacy</span>
        <h2 className="menu-heading">
          The <em className="menu-heading-gold">Royal</em> Menu
        </h2>
        <p className="menu-subtext">
          Timeless recipes from the royal kitchens of Rajasthan, served with reverence.
        </p>
        <div className="ornament-line" style={{ maxWidth: 240, margin: '28px auto 0' }}>
          <div className="diamond" />
        </div>
      </div>

      {/* ── Filter bar with arrow buttons ── */}
      <div ref={filterRef} className="menu-filter-wrapper">
        {/* Left arrow */}
        <button
          className={`menu-filter-arrow menu-filter-arrow--left${showLeft ? ' visible' : ''}`}
          aria-label="Scroll categories left"
          onMouseEnter={() => startScroll(-1)}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll(-1)}
          onTouchEnd={stopScroll}
          onClick={() => { const el = filterBarRef.current; if (el) el.scrollBy({ left: -200, behavior: 'smooth' }); }}
        >
          ‹
        </button>

        {/* Scrollable pill bar */}
        <nav ref={filterBarRef} className="menu-filter-bar" role="tablist" aria-label="Menu category filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeFilter === cat}
              className={`menu-filter-pill${activeFilter === cat ? ' active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Right arrow */}
        <button
          className={`menu-filter-arrow menu-filter-arrow--right${showRight ? ' visible' : ''}`}
          aria-label="Scroll categories right"
          onMouseEnter={() => startScroll(1)}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll(1)}
          onTouchEnd={stopScroll}
          onClick={() => { const el = filterBarRef.current; if (el) el.scrollBy({ left: 200, behavior: 'smooth' }); }}
        >
          ›
        </button>
      </div>

      {/* ── Dish Grid ── */}
      <div ref={gridRef} className="menu-circle-grid" style={{ paddingBottom: (activeFilter === 'ALL' && visibleCount < interleavedAllItems.length) ? '40px' : '80px' }}>
        {filteredItems.map((item, i) => {
          const row      = Math.floor(i / columns);
          const isOddRow = row % 2 === 1;
          const isSelected = selectedDish?.id === item.id;
          return (
            <div
              key={item.id}
              className={`menu-circle-item${isOddRow ? ' row-shifted' : ''}${isSelected ? ' is-selected' : ''}`}
              onClick={e => handleDishClick(item, e)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${item.name}`}
              onKeyDown={e => e.key === 'Enter' && handleDishClick(item, e)}
            >
              <div className="menu-circle-img-wrap">
                <img src={item.image} alt={item.name} loading="lazy" className="menu-circle-img" />
                <div className="menu-circle-glow" aria-hidden />
              </div>
              <p className="menu-circle-name">{item.name}</p>
              <span className="menu-circle-cat">{item.category}</span>
            </div>
          );
        })}
      </div>

      {/* ── Show More Button ── */}
      {activeFilter === 'ALL' && visibleCount < interleavedAllItems.length && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '80px' }}>
          <button className="btn-royal" onClick={handleShowMore}>
            <span>Show More</span>
          </button>
        </div>
      )}

      {/* ── Backdrop + Floating Expand Card ── */}
      {selectedDish && (
        <>
          <div className="dish-expand-backdrop" onClick={() => closeCard()} aria-hidden />

          <div ref={cardRef} className="dish-expand-card" role="dialog" aria-label={selectedDish.name}>

            {/* Full-bleed image */}
            <div className="dec-img-layer">
              <img src={selectedDish.image} alt={selectedDish.name} className="dec-img" />
              <div className="dec-img-mask" aria-hidden />
            </div>

            {/* Content */}
            <div ref={contentRef} className="dec-content">
              <button className="dec-close" onClick={() => closeCard()} aria-label="Close">✕</button>

              <div className="dec-info">
                <span className="dec-category">{selectedDish.category}</span>
                <h3 className="dec-title">{selectedDish.name}</h3>
                <div className="dec-tags">
                  {selectedDish.tags.map(tag => (
                    <span key={tag} className="dec-tag">{tag}</span>
                  ))}
                </div>
                <div className="dec-rule" aria-hidden />
                <p className="dec-desc">{selectedDish.description}</p>
                <a href="#reserve" className="btn-royal dec-cta" onClick={() => closeCard()}>
                  <span>Reserve Your Table</span>
                  <span aria-hidden style={{ marginLeft: 8 }}>→</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
