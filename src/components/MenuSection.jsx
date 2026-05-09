import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── Menu Data ─────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 1, name: 'Dal Bati Churma', category: 'VEG',
    description: 'Lentils simmered over firewood, baked wheat balls, and jaggery-sweetened churma, generously drizzled with pure desi ghee. The defining soul of Rajasthani cuisine.',
    image: '/images/dal_bati_churma_1776795837213.png',
    tags: ['Signature Dish', 'Traditional Rajasthani', 'Vegetarian'],
  },
  {
    id: 2, name: 'Laal Maas', category: 'NON-VEG',
    description: 'Slow-cooked mutton in fiery mathania chilies, saffron, and whole spices. Born in the royal hunt camps of Mewar — a dish of legend and fire.',
    image: '/images/laal_maas_1776795854730.png',
    tags: ['Royal Hunt Origins', 'Slow Cooked', 'Served Hot'],
  },
  {
    id: 3, name: 'Gatte Ki Sabzi', category: 'VEG',
    description: 'Handcrafted gram flour dumplings simmered in tangy yogurt gravy — humble perfection refined by generations of ancestral spice mastery.',
    image: '/images/gatte_ki_sabzi_1776795870396.png',
    tags: ['Traditional Rajasthani', 'Vegetarian', 'Ancestral Recipe'],
  },
  {
    id: 4, name: 'Ker Sangri', category: 'VEG',
    description: 'Wild caper berries and desert beans preserved in aromatic spices — once nomad survival food, now a celebrated delicacy of the royal table.',
    image: '/images/ker_sangri_1776795894403.png',
    tags: ['Desert Origins', 'Traditional Rajasthani', 'Vegetarian'],
  },
  {
    id: 5, name: 'Ghevar', category: 'DESSERTS',
    description: 'Crisp honey-colored lattice drenched in rose syrup and crowned with edible silver leaf. The crown jewel of Rajasthani sweets since the Mughal era.',
    image: '/images/ghevar_1776795911649.png',
    tags: ['Royal Sweet', 'Festival Special', 'Served Chilled'],
  },
  {
    id: 6, name: 'The Royal Thali', category: 'THALI SPECIALS',
    description: 'A curated ensemble of 18 dishes — an entire landscape of Rajasthan on a gleaming silver platter. The ultimate expression of royal hospitality.',
    image: '/images/royal_thali_masked_1776802746109.png',
    tags: ['18 Dishes', 'Signature Experience', "Chef's Selection"],
  },
  {
    id: 7, name: 'Safed Maas', category: 'NON-VEG',
    description: 'Tender mutton in a delicate white gravy of yogurt, cream, and cashews — the refined counterpart to Laal Maas, born in the royal zenanas of Rajputana.',
    image: '/images/safed_maas.png',
    tags: ['Royal Kitchen', 'Slow Cooked', 'Served Hot'],
  },
  {
    id: 8, name: 'Bajre Ki Roti', category: 'BREADS',
    description: 'Rustic dark millet flatbread, stone-ground and hand-pressed, served warm with white butter and jaggery. The bread of warriors, shepherds, and kings alike.',
    image: '/images/bajre_ki_roti.png',
    tags: ['Ancient Grain', 'Traditional Rajasthani', 'Vegetarian'],
  },
  {
    id: 9, name: 'Mawa Kachori', category: 'DESSERTS',
    description: 'Golden fried pastry shells filled with fragrant mawa, dry fruits, and cardamom, glazed in rose sugar syrup and crowned with crushed pistachios.',
    image: '/images/mawa_kachori.png',
    tags: ['Royal Sweet', 'Jodhpur Special', 'Served Fresh'],
  },
  {
    id: 10, name: 'Churma Ladoo', category: 'DESSERTS',
    description: 'Wheat coarsely ground and roasted in ghee, sweetened with jaggery and shaped into golden spheres. An offering of abundance, made for celebrations and warriors.',
    image: '/images/churma_ladoo.png',
    tags: ['Traditional Sweet', 'Vegetarian', 'Festive Special'],
  },
  {
    id: 11, name: 'Dal Makhani', category: 'VEG',
    description: 'Black lentils slow-cooked overnight on dying embers, enriched with cream and butter. A dish that demands patience — and rewards it with velvet depth.',
    image: '/images/daal_makhani.png',
    tags: ['Slow Cooked', 'Vegetarian', "Chef's Favourite"],
  },
  {
    id: 12, name: 'Missi Roti', category: 'BREADS',
    description: 'Spiced gram flour flatbread with fenugreek, carom seeds, and green chilies, lightly charred on iron tawa. Bold, aromatic, and unmistakably Rajasthani.',
    image: '/images/missi_roti.png',
    tags: ['Spiced Bread', 'Traditional Rajasthani', 'Vegetarian'],
  },
  {
    id: 13, name: 'Rabri', category: 'DESSERTS',
    description: 'Milk reduced for hours over low flame until thick with natural sweetness, layered with saffron, cardamom, and rose water. The patience of royalty in a bowl.',
    image: '/images/rabri.png',
    tags: ['Royal Dessert', 'Saffron Infused', 'Served Chilled'],
  },
  {
    id: 14, name: 'Masala Chaach', category: 'BEVERAGES',
    description: 'Hand-churned yogurt blended with roasted cumin, black salt, fresh mint, and green chilies. The ancient desert cooler that sustained caravans and armies.',
    image: '/images/masala_chaach.png',
    tags: ['Traditional Drink', 'Served Chilled', 'Digestive'],
  },
  {
    id: 15, name: 'Royal Kesar Lassi', category: 'BEVERAGES',
    description: 'Thick sweet yogurt infused with Kashmiri saffron, crowned with fresh cream, rose petals, and crushed pistachios. A drink fit for maharajas.',
    image: '/images/royal_lassi.png',
    tags: ['Saffron Infused', 'Royal Beverage', 'Signature Drink'],
  },
];

const CATEGORIES = ['ALL', 'VEG', 'NON-VEG', 'THALI SPECIALS', 'BREADS', 'DESSERTS', 'BEVERAGES'];

// ── Helpers ───────────────────────────────────────────────────────────────────
/**
 * Returns the CSS target geometry for the expanded card:
 * centred, 70vw × 72vh, clamped to nice min/max.
 */
function getTargetRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w  = Math.min(Math.max(vw * 0.70, 360), 1100);
  const h  = Math.min(Math.max(vh * 0.72, 420), 780);
  return {
    left:   (vw - w) / 2,
    top:    (vh - h) / 2,
    width:  w,
    height: h,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MenuSection() {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const filterRef   = useRef(null);
  const gridRef     = useRef(null);
  const cardRef     = useRef(null);      // the floating expand card
  const contentRef  = useRef(null);     // card content (fades in after expand)
  const originRef   = useRef(null);     // stores origin DOMRect for close anim
  const closingRef  = useRef(false);    // prevents double-close

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedDish, setSelectedDish] = useState(null);
  const [gridKey,      setGridKey]      = useState(0);

  const filteredItems =
    activeFilter === 'ALL'
      ? MENU_ITEMS
      : MENU_ITEMS.filter(item => item.category === activeFilter);

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

  // ── First grid reveal on scroll ───────────────────────────────────────────
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (!items?.length) return;
    const st = ScrollTrigger.create({
      trigger: gridRef.current, start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo(items,
        { opacity: 0, scale: 0.82, y: 28 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
      ),
    });
    return () => st.kill();
  }, []);

  // ── Stagger re-entry on filter change ────────────────────────────────────
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (!items?.length) return;
    gsap.fromTo(items,
      { opacity: 0, scale: 0.82, y: 24 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.055, duration: 0.55, ease: 'power3.out', clearProps: 'all' }
    );
    // After grid remounts the layout height changes — force ScrollTrigger to
    // remeasure pin-spacers and trigger positions for all subsequent sections.
    // Double-rAF: first frame = React commit, second frame = browser reflow complete.
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
    };
  }, [gridKey, activeFilter]);

  // ── ResizeObserver: sync ScrollTrigger on any section height change ───────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let rafId;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Filter handler ────────────────────────────────────────────────────────
  const handleFilter = useCallback((cat) => {
    if (cat === activeFilter) return;
    closeCard(true); // close any open card silently
    const items = gridRef.current?.querySelectorAll('.menu-circle-item');
    if (items?.length) {
      gsap.to(items, {
        opacity: 0, scale: 0.88, duration: 0.22, ease: 'power2.in',
        onComplete: () => { 
          setActiveFilter(cat); 
          setGridKey(k => k + 1); 
        },
      });
    } else {
      setActiveFilter(cat);
      setGridKey(k => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // ── HERO EXPAND: open ─────────────────────────────────────────────────────
  const handleDishClick = useCallback((item, e) => {
    if (closingRef.current) return;

    // Clicking same dish → close
    if (selectedDish?.id === item.id) { closeCard(); return; }

    // Grab the circle element's screen position
    const circleEl = e.currentTarget.querySelector('.menu-circle-img-wrap');
    const rect = circleEl
      ? circleEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

    originRef.current = rect;
    setSelectedDish(item);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDish]);

  // Fire GSAP after the card mounts in the DOM
  useEffect(() => {
    if (!selectedDish || !cardRef.current) return;
    const card    = cardRef.current;
    const content = contentRef.current;
    const origin  = originRef.current;
    const target  = getTargetRect();

    closingRef.current = false;

    // 1. Snap to origin circle
    gsap.set(card, {
      position:     'fixed',
      left:         origin.left,
      top:          origin.top,
      width:        origin.width,
      height:       origin.height,
      borderRadius: '50%',
      opacity:      1,
      scale:        1,
      zIndex:       200,
    });
    gsap.set(content, { opacity: 0, y: 14 });

    // 2. Expand to centre squircle
    gsap.to(card, {
      left:         target.left,
      top:          target.top,
      width:        target.width,
      height:       target.height,
      borderRadius: '28px',
      duration:     0.62,
      ease:         'power3.inOut',
    });

    // 3. Fade content in after shape is mostly formed
    gsap.to(content, {
      opacity: 1, y: 0,
      duration: 0.42, delay: 0.38, ease: 'power2.out',
    });
  }, [selectedDish]);

  // ── HERO COLLAPSE: close ──────────────────────────────────────────────────
  const closeCard = useCallback((silent = false) => {
    if (closingRef.current) return;
    if (silent) { setSelectedDish(null); return; }

    const card    = cardRef.current;
    const content = contentRef.current;
    const origin  = originRef.current;
    if (!card || !origin) { setSelectedDish(null); return; }

    closingRef.current = true;

    // 1. Fade out content
    gsap.to(content, { opacity: 0, y: 10, duration: 0.20, ease: 'power2.in' });

    // 2. Simple fade out transition for both card and backdrop
    gsap.to('.dish-expand-backdrop', { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
    gsap.to(card, {
      opacity:      0,
      scale:        0.98,
      duration:     0.35,
      ease:         'power2.inOut',
      onComplete:   () => {
        closingRef.current = false;
        setSelectedDish(null);
      },
    });
  }, []);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeCard(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCard]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={sectionRef} id="menu" className="royal-menu-section">

      {/* ── Top guard: blocks LegacySection card overflow bleed ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '4px',
          background: 'var(--black)',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      />

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

      {/* ── Filter bar ── */}
      <nav ref={filterRef} className="menu-filter-bar" role="tablist" aria-label="Menu category filters">
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

      {/* ── Dish Grid ── */}
      <div 
        ref={gridRef} 
        className="menu-circle-grid" 
        key={activeFilter}
      >
        {filteredItems.map((item, i) => {
          const row       = Math.floor(i / 5);
          const isOddRow  = row % 2 === 1;
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

      {/* ── Backdrop + Floating Expand Card ── */}
      {selectedDish && (
        <>
          {/* Dim backdrop */}
          <div
            className="dish-expand-backdrop"
            onClick={() => closeCard()}
            aria-hidden
          />

          {/* The squircle card — position/size driven entirely by GSAP */}
          <div ref={cardRef} className="dish-expand-card" role="dialog" aria-label={selectedDish.name}>

            {/* Full-bleed image layer */}
            <div className="dec-img-layer">
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="dec-img"
              />
              {/* Gradient mask so text stays legible */}
              <div className="dec-img-mask" aria-hidden />
            </div>

            {/* Content — fades in after expansion */}
            <div ref={contentRef} className="dec-content">

              {/* Close button */}
              <button
                className="dec-close"
                onClick={() => closeCard()}
                aria-label="Close"
              >
                ✕
              </button>

              {/* Right-side info */}
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
