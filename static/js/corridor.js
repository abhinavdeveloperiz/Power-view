/**
 * corridor.js — Vanilla JS port of the ImageStreamHero corridor animation.
 *
 * Geometry math is identical to the React original. All lengths are in `cqw`
 * (container-query width units) so the shape scales to any container size.
 *
 * Usage: add [data-corridor] to a container div and set these data attributes:
 *   data-images   JSON array of image URLs  (required)
 *   data-cards    cards per rail            (default 9)
 *   data-speed    seconds per full pass     (default 18)
 *   data-axis     vanishing-point Y %       (default 55)
 */
(function () {
  'use strict';

  /* ── default geometry ──────────────────────────────────────── */
  const DEFAULTS = {
    perspective: 32,   // balanced perspective angle
    cardWidth:   16.5, // world-unit card width
    cardHeight:  23,   // world-unit card height
    cardRadius:  0.5,  // corner radius (cqw)
    birthHeight: 2.8,  // apparent height at the waist (cqw)
    exitHeight:  36,   // apparent height at the frame edge (cqw) — fits cleanly in container
    railBirth:  -10,   // lateral offset at birth (negative = across axis)
    railExit:    45,   // lateral offset at exit
    fan:         3.2,  // front-loads the rail opening
    turnBirth:   6,    // y-rotation at birth (deg)
    turnExit:    26,   // y-rotation at exit (deg)
    stops:       24,   // keyframe resolution
  };

  /* ── keyframe generator ────────────────────────────────────── */
  function buildKeyframes(dir, name, p) {
    const frames = [];
    for (let s = 0; s <= p.stops; s++) {
      const u     = s / p.stops;
      // Geometric in apparent size → ribbon stays solid at both ends
      const scale = (p.birthHeight / p.cardHeight) *
                    Math.pow(p.exitHeight / p.birthHeight, u);
      const z     = p.perspective * (1 - 1 / scale);
      const rail  = p.railExit -
                    (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
      const turn  = p.turnBirth + (p.turnExit - p.turnBirth) * u;
      frames.push(
        (u * 100).toFixed(2) + '%' +
        '{transform:translate3d(' +
          (dir * rail).toFixed(2) + 'cqw,0,' +
          z.toFixed(2) + 'cqw' +
        ') rotateY(' + (-dir * turn).toFixed(2) + 'deg)}'
      );
    }
    return '@keyframes ' + name + '{' + frames.join('') + '}';
  }

  /* ── build one corridor inside `el` ───────────────────────── */
  function initCorridor(el) {
    let images;
    try { images = JSON.parse(el.dataset.images || '[]'); }
    catch (e) { images = []; }

    const cards = parseInt(el.dataset.cards  || '9',  10);
    const speed = parseFloat(el.dataset.speed || '18');
    const axis  = parseFloat(el.dataset.axis  || '55');
    const p     = Object.assign({}, DEFAULTS);

    // Unique animation names so multiple corridors never clash
    const uid   = Math.random().toString(36).slice(2, 10);
    const rName = 'pvc-r-' + uid;
    const lName = 'pvc-l-' + uid;
    const cCls  = 'pvc-c-' + uid;

    // Inject keyframe CSS + reduced-motion pause
    const style = document.createElement('style');
    style.textContent =
      buildKeyframes( 1, rName, p) +
      buildKeyframes(-1, lName, p) +
      '@media(prefers-reduced-motion:reduce){.' + cCls +
        '{animation-play-state:paused}}';
    document.head.appendChild(style);

    // container-type:inline-size makes cqw resolve against this element
    el.style.containerType = 'inline-size';

    // Perspective wrapper (aria-hidden — purely decorative)
    const pw = document.createElement('div');
    pw.setAttribute('aria-hidden', 'true');
    Object.assign(pw.style, {
      pointerEvents:     'none',
      position:          'absolute',
      inset:             '0',
      perspective:       p.perspective + 'cqw',
      perspectiveOrigin: '50% ' + axis + '%',
    });

    // 3-D scene preserves children's transforms
    const scene = document.createElement('div');
    Object.assign(scene.style, {
      position:       'absolute',
      inset:          '0',
      transformStyle: 'preserve-3d',
    });

    // Build left and right rails
    [[rName, 1], [lName, -1]].forEach(function (pair) {
      const name = pair[0];
      const dir  = pair[1];
      for (let i = 0; i < cards; i++) {
        const src  = images[i % Math.max(images.length, 1)];
        const card = document.createElement('div');
        card.className = cCls;
        Object.assign(card.style, {
          position:           'absolute',
          overflow:           'hidden',
          left:               '50%',
          top:                axis + '%',
          width:              p.cardWidth  + 'cqw',
          height:             p.cardHeight + 'cqw',
          marginLeft:         (-p.cardWidth  / 2) + 'cqw',
          marginTop:          (-p.cardHeight / 2) + 'cqw',
          borderRadius:       p.cardRadius + 'cqw',
          animation:          name + ' ' + speed + 's linear infinite',
          // Negative delay drops each card mid-flight so the corridor is
          // full on the very first frame with no ramp-up.
          animationDelay:     (-(i * speed) / cards) + 's',
          backfaceVisibility: 'hidden',
          willChange:         'transform',
        });

        if (src) {
          const img    = document.createElement('img');
          img.src      = src;
          img.alt      = '';
          img.loading  = 'lazy';
          img.decoding = 'async';
          img.draggable = false;
          img.style.cssText =
            'display:block;width:100%;height:100%;object-fit:cover;';
          card.appendChild(img);
        }
        scene.appendChild(card);
      }
    });

    pw.appendChild(scene);
    el.appendChild(pw);
  }

  /* ── auto-init every [data-corridor] on the page ──────────── */
  function init() {
    document.querySelectorAll('[data-corridor]').forEach(initCorridor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
