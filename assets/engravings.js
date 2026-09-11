/* ============================================================
   Steps to Christ — procedural engraving library
   Clean line-art motifs, one per chapter. Drawn in a 320x300
   space. Stroke inherits `currentColor`, so each plate/card
   colours its engraving with the chapter accent.
   ============================================================ */
(function (global) {
  "use strict";

  const F = (n) => Math.round(n * 10) / 10;
  const L = (a, b, c, d, cls) => `<line x1="${F(a)}" y1="${F(b)}" x2="${F(c)}" y2="${F(d)}"${cls ? ` class="${cls}"` : ""}/>`;
  const C = (x, y, r, cls) => `<circle cx="${F(x)}" cy="${F(y)}" r="${F(r)}"${cls ? ` class="${cls}"` : ""}/>`;
  const E = (x, y, rx, ry, cls) => `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(rx)}" ry="${F(ry)}"${cls ? ` class="${cls}"` : ""}/>`;
  const P = (d, cls) => `<path d="${d}"${cls ? ` class="${cls}"` : ""}/>`;
  const R = (x, y, w, h, rx, cls) =>
    `<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}"${rx ? ` rx="${F(rx)}"` : ""}${cls ? ` class="${cls}"` : ""}/>`;

  function rays(cx, cy, r1, r2, count, cls) {
    let s = "";
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 / count) * i - Math.PI / 2;
      s += L(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, cls || "thin");
    }
    return s;
  }
  // fan of rays over an angle range (for sunrise / breaking light)
  function fan(cx, cy, r1, r2, from, to, count, cls) {
    let s = "";
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const a = (from + (to - from) * t) * Math.PI / 180;
      s += L(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, cls || "thin");
    }
    return s;
  }
  function bird(x, y, s) {
    return P(`M${F(x - s)} ${F(y)} Q ${F(x - s * .4)} ${F(y - s * .7)} ${F(x)} ${F(y)} Q ${F(x + s * .4)} ${F(y - s * .7)} ${F(x + s)} ${F(y)}`, "thin");
  }
  function heart(cx, cy, s) {
    return P(`M${F(cx)} ${F(cy + s * .78)} C ${F(cx - s)} ${F(cy - s * .1)} ${F(cx - s * .5)} ${F(cy - s * .92)} ${F(cx)} ${F(cy - s * .3)} C ${F(cx + s * .5)} ${F(cy - s * .92)} ${F(cx + s)} ${F(cy - s * .1)} ${F(cx)} ${F(cy + s * .78)} Z`);
  }
  function star(cx, cy, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * .42 : r;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      d += (i ? "L" : "M") + F(cx + Math.cos(a) * rr) + " " + F(cy + Math.sin(a) * rr) + " ";
    }
    return P(d + "Z", "fillc");
  }
  // small tuft of shading strokes
  function shade(x, y, n, len, gap, ang) {
    let s = ""; const a = (ang || 60) * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const ox = x + i * gap;
      s += L(ox, y, ox + Math.cos(a) * len, y + Math.sin(a) * len, "thin soft");
    }
    return s;
  }
  function traveler(x, y, scale, rotation, reaching) {
    const arm = reaching
      ? P("M-3 14 L-15 27 M4 14 L21 -2")
      : P("M-3 14 L-15 26 M4 14 L16 24");
    return '<g transform="translate(' + F(x) + " " + F(y) + ") rotate(" + F(rotation || 0) + ") scale(" + F(scale || 1) + ')">' +
      C(0, 0, 7) +
      P("M0 7 C-6 14 -7 25 -6 34 M0 8 C7 15 8 25 7 34 M-6 34 L-12 47 M7 34 L13 47") +
      arm + "</g>";
  }
  function home(x, y, scale) {
    return '<g transform="translate(' + F(x) + " " + F(y) + ") scale(" + F(scale || 1) + ')">' +
      P("M0 27 L28 4 L56 27 V66 H0 Z") +
      P("M21 66 V43 H36 V66 M8 34 H18 V45 H8 Z M40 34 H49 V45 H40 Z") +
      P("M28 -8 V-22 M17 -4 L10 -16 M39 -4 L46 -16 M6 5 L-6 -2 M50 5 L62 -2", "thin soft") +
      C(28, 20, 3.5, "fillc") + "</g>";
  }

  const START_ART = {
    "gods-love": {
      label: "A traveler beginning a path toward a radiant home",
      draw() {
        return P("M18 126 C70 126 90 113 118 91 C151 65 173 57 202 54") +
          traveler(43, 78, 1, 0, false) + home(164, 22, .82) +
          P("M26 135 C82 135 108 117 138 93", "thin soft");
      }
    },
    "need-of-christ": {
      label: "A traveler stopped by a chasm while Christ bridges the way home",
      draw() {
        return traveler(45, 72, 1, 0, false) +
          P("M18 122 H77 M77 122 L96 138 M132 138 L151 122 H222") +
          P("M83 108 H143 M113 92 V124") + home(165, 40, .65) +
          P("M88 113 H138", "thin soft");
      }
    },
    "repentance": {
      label: "A traveler turning from a dark fork toward a lit home",
      draw() {
        return traveler(104, 68, 1, 12, false) +
          P("M104 126 C105 110 106 94 108 80 M104 126 C78 103 57 95 26 94 M104 126 C135 96 157 73 185 62") +
          home(178, 24, .62) + P("M27 104 C57 104 78 112 96 127", "thin soft");
      }
    },
    "confession": {
      label: "A traveler bringing a hidden burden into an open doorway",
      draw() {
        return traveler(52, 77, 1, 0, false) +
          P("M108 32 H181 V124 H108 Z M121 43 H166 V124 H121 Z M166 43 L198 56 V124 L166 124 Z") +
          P("M166 52 L219 78 M166 64 L219 101 M166 77 L210 122", "thin soft") +
          R(74, 110, 19, 14, 3) + L(19, 124, 221, 124);
      }
    },
    "consecration": {
      label: "A traveler leaving a heavy pack behind and walking toward home",
      draw() {
        return traveler(98, 69, 1, 8, false) +
          P("M18 126 C70 128 112 112 145 84 C164 68 184 61 213 61") +
          R(46, 103, 29, 23, 5) + P("M52 103 C52 91 69 91 69 103 M45 114 H76") +
          home(178, 30, .58);
      }
    },
    "faith-acceptance": {
      label: "A traveler receiving a lantern for the road home",
      draw() {
        return traveler(79, 74, 1, 0, true) +
          P("M18 126 C85 126 127 109 172 76") +
          P("M113 39 C124 45 130 53 130 63 C130 75 121 84 110 84 C99 84 91 76 91 66 C91 56 100 49 113 39 Z M101 84 H121 V92 H101 Z") +
          C(111, 65, 5, "fillc") + home(178, 27, .58) +
          P("M111 28 V17 M92 36 L84 27 M130 37 L139 28", "thin soft");
      }
    },
    "test-discipleship": {
      label: "A traveler leaving footprints and fruit along the road home",
      draw() {
        return traveler(104, 64, 1, 8, false) +
          P("M18 128 C72 126 113 111 149 84 C171 68 191 62 217 62") +
          E(54, 118, 4, 7) + E(70, 111, 4, 7) +
          P("M136 98 C151 84 153 67 155 50 M152 67 C139 65 132 58 130 48 C144 48 153 55 152 67 Z M154 58 C167 56 175 49 179 39 C165 39 156 47 154 58 Z") +
          C(163, 68, 5) + home(183, 31, .5);
      }
    },
    "growing-up": {
      label: "A living vine keeping a traveler connected to the home ahead",
      draw() {
        return traveler(65, 76, 1, 0, false) + home(166, 35, .67) +
          P("M65 91 C94 79 116 92 133 73 C146 59 149 60 166 66") +
          P("M95 82 C88 70 79 67 70 69 C76 80 84 84 95 82 Z M129 76 C121 64 111 62 103 66 C110 76 119 79 129 76 Z") +
          P("M20 126 C78 126 116 111 166 82", "thin soft");
      }
    },
    "work-and-life": {
      label: "One traveler helping another climb the path home",
      draw() {
        return traveler(132, 53, 1, 8, true) + traveler(83, 82, .82, -8, true) +
          P("M143 66 L113 83 M91 94 L113 83") +
          P("M16 128 H72 V116 H100 V104 H128 V92 H157 V80 H185") +
          home(181, 29, .55);
      }
    },
    "knowledge-of-god": {
      label: "A traveler learning to read the signs that point home",
      draw() {
        return traveler(74, 77, 1, 0, false) +
          P("M108 37 V122 M108 48 H156 L144 61 H108 M108 70 H66 L78 83 H108") +
          P("M22 126 C78 126 117 109 155 84") + home(175, 27, .62) +
          P("M45 52 L54 46 L63 52 M52 46 V62", "thin soft") + C(37, 38, 3, "fillc");
      }
    },
    "prayer": {
      label: "A traveler speaking openly in the welcoming presence of God",
      draw() {
        return traveler(84, 77, 1, 0, false) +
          P("M113 49 C127 35 145 31 160 36 C171 40 177 49 175 58 C172 68 160 73 146 70 L132 80 L136 67 C126 64 117 58 113 49 Z") +
          P("M47 126 C100 126 138 108 177 80", "thin soft") +
          home(181, 37, .53) + C(145, 51, 4, "fillc");
      }
    },
    "doubt": {
      label: "A traveler following a lantern through fog toward home",
      draw() {
        return traveler(74, 78, 1, 8, false) +
          P("M23 125 C79 126 120 110 164 78") +
          P("M28 52 C22 42 34 33 45 39 C51 25 72 27 76 42 C89 37 101 48 96 61 H33 C25 61 23 56 28 52 Z M113 48 C107 38 119 29 130 35 C136 21 157 23 161 38 C174 33 186 44 181 57 H118 C110 57 108 52 113 48 Z", "thin soft") +
          R(99, 78, 17, 18, 0) + P("M102 78 C102 66 113 66 113 78") +
          C(108, 87, 4, "fillc") + home(177, 32, .58);
      }
    },
    "rejoicing": {
      label: "A joyful traveler arriving at a radiant open home",
      draw() {
        return home(142, 28, 1.02) + C(93, 75, 7) +
          P("M93 82 L93 113 M93 91 L73 76 M93 91 L114 73 M93 113 L80 129 M93 113 L108 129") +
          P("M15 130 C70 130 109 113 144 87") +
          P("M61 119 C52 108 45 107 38 111 C45 119 52 121 61 119 Z M122 100 C115 89 106 87 99 91 C106 100 114 103 122 100 Z", "thin soft") +
          C(198, 29, 3, "fillc") + C(220, 54, 2.5, "fillc") + C(126, 35, 2.5, "fillc");
      }
    }
  };

  const ART = {
    /* 1 — God's Love: radiant sun with a heart, hills, birds */
    "gods-love"() {
      return (
        rays(160, 116, 52, 80, 24) +
        C(160, 116, 44) +
        heart(160, 118, 20) +
        bird(96, 84, 15) + bird(232, 74, 13) + bird(210, 104, 10) +
        P("M16 250 Q92 206 168 238 Q240 268 304 232", "thin") +
        P("M16 272 Q110 234 196 262 Q256 282 304 264") +
        shade(120, 252, 5, 12, 7, 68)
      );
    },

    /* 2 — Sinner's Need of Christ: Jacob's ladder rising into light */
    "need-of-christ"() {
      const lx = (t) => 130 + 22 * t, rx = (t) => 168 + 22 * t, yy = (t) => 264 - 200 * t;
      let rungs = "";
      for (let i = 0; i <= 6; i++) { const t = i / 6; rungs += L(lx(t), yy(t), rx(t), yy(t)); }
      return (
        // glow at the top of the ladder
        C(171, 58, 12, "thin") + rays(171, 58, 14, 30, 12, "thin soft") +
        // the two rails (parallel — a ladder, not a tower)
        L(lx(0), yy(0), lx(1), yy(1)) + L(rx(0), yy(0), rx(1), yy(1)) +
        rungs +
        // ground
        P("M36 272 Q120 264 204 272", "thin soft") +
        bird(72, 96, 13)
      );
    },

    /* 3 — Repentance: a road turning back toward the sunrise */
    "repentance"() {
      return (
        // sunrise on the horizon
        fan(160, 150, 22, 78, 190, 350, 11, "thin soft") +
        P("M108 150 A52 52 0 0 1 212 150", "thin") +
        L(52, 150, 104, 150, "thin soft") + L(216, 150, 288, 150, "thin soft") +
        // road in perspective, curving up to the light
        P("M126 268 C 140 212 178 196 160 152") +
        P("M198 268 C 190 212 176 196 160 152") +
        // centre dashes following the bend
        L(160, 250, 166, 250, "thin") + L(166, 216, 172, 215, "thin") +
        L(170, 186, 176, 186, "thin") + L(163, 166, 168, 166, "thin")
      );
    },

    /* 4 — Confession: an open door with light pouring through */
    "confession"() {
      return (
        // outer frame / lintel
        R(104, 74, 112, 178, 6) +
        R(116, 86, 88, 154, 4, "thin") +
        // opened door leaf
        P("M204 92 L 244 108 L 244 254 L 204 240 Z") +
        L(224, 150, 224, 178, "thin") + // handle plate
        // light spilling onto the floor
        fan(190, 150, 6, 120, 6, 60, 6, "thin soft") +
        L(60, 252, 260, 252) +
        star(150, 150, 8)
      );
    },

    /* 5 — Consecration: an altar with a rising flame (surrender) */
    "consecration"() {
      return (
        rays(160, 96, 24, 46, 16, "thin soft") +
        // flame
        P("M160 66 C 178 92 176 116 160 132 C 144 116 142 92 160 66 Z") +
        P("M160 92 C 168 104 167 118 160 128 C 153 118 152 104 160 92 Z", "thin") +
        // altar
        R(112, 138, 96, 20, 3) +
        P("M120 158 L 130 246 L 190 246 L 200 158", "") +
        L(120, 158, 200, 158, "thin") +
        R(96, 246, 128, 16, 3) +
        shade(134, 168, 6, 60, 9, 90)
      );
    },

    /* 6 — Faith & Acceptance: an anchor in the waves, cross on the stock */
    "faith-acceptance"() {
      return (
        // ring
        C(160, 74, 14) +
        // shank
        L(160, 88, 160, 220) +
        // stock (crossbar) — forms a cross
        L(126, 116, 194, 116) +
        // arms / flukes
        P("M160 220 C 128 218 104 196 100 164", "") +
        P("M160 220 C 192 218 216 196 220 164", "") +
        P("M100 164 l -12 -6 l 16 -8", "thin") +
        P("M220 164 l 12 -6 l -16 -8", "thin") +
        // water
        P("M40 246 q 20 -12 40 0 t 40 0 t 40 0 t 40 0 t 40 0", "thin soft") +
        P("M40 264 q 20 -12 40 0 t 40 0 t 40 0 t 40 0 t 40 0", "thin soft")
      );
    },

    /* 7 — Test of Discipleship: a fruit-bearing branch */
    "test-discipleship"() {
      const leaf = (x, y, r, rot) =>
        `<g transform="translate(${x} ${y}) rotate(${rot})">` +
        P(`M0 0 C 14 -10 30 -8 40 0 C 30 8 14 10 0 0 Z`) +
        L(4, 0, 34, 0, "thin") + `</g>`;
      return (
        // main bough
        P("M60 250 C 120 210 150 150 180 96") +
        // secondary limbs
        P("M150 150 C 176 150 196 138 214 120", "thin") +
        P("M120 200 C 150 202 172 192 190 176", "thin") +
        leaf(190, 92, 22, -20) + leaf(214, 116, 20, 10) + leaf(120, 196, 20, -10) +
        // fruit
        C(176, 120, 12) + C(198, 150, 11) + C(150, 176, 11) +
        L(176, 108, 172, 100, "thin") + L(198, 139, 194, 131, "thin") + L(150, 165, 146, 157, "thin")
      );
    },

    /* 8 — Growing Up Into Christ: a sapling reaching to the sun */
    "growing-up"() {
      return (
        rays(160, 74, 20, 40, 16, "thin soft") + C(160, 74, 16, "thin") +
        // stem
        P("M160 250 C 160 210 158 176 160 140") +
        // leaves
        P("M160 150 C 132 146 116 128 112 104 C 140 106 158 124 160 150 Z") +
        P("M160 172 C 188 168 206 150 210 126 C 182 128 162 146 160 172 Z") +
        L(126, 116, 154, 142, "thin") + L(196, 138, 168, 162, "thin") +
        // soil mound + roots
        P("M108 250 Q 160 232 212 250", "") +
        L(160, 250, 160, 274, "thin") + L(160, 262, 146, 276, "thin") + L(160, 262, 174, 276, "thin") +
        shade(120, 254, 6, 12, 8, 66)
      );
    },

    /* 9 — The Work and the Life: a fountain, blessings flowing out */
    "work-and-life"() {
      return (
        // spray at the very top
        L(160, 70, 160, 92) +
        P("M160 80 C 150 84 146 90 148 98", "thin soft") +
        P("M160 80 C 170 84 174 90 172 98", "thin soft") +
        // upper tier bowl
        E(160, 108, 24, 6, "thin") + P("M138 108 Q 160 120 182 108") +
        // water arcing out from the upper bowl down to the basin
        P("M141 110 C 122 128 116 146 120 164", "thin soft") +
        P("M179 110 C 198 128 204 146 200 164", "thin soft") +
        // central stem
        L(160 , 114, 160, 150, "thin") +
        // lower basin (a wide bowl)
        E(160, 164, 66, 10, "thin") + P("M94 164 C 104 206 216 206 226 164") +
        P("M112 176 q 24 -9 48 0 t 48 0", "thin soft") +
        // foot
        R(139, 206, 42, 10, 3, "thin") + R(150, 216, 20, 12, 2, "thin")
      );
    },

    /* 10 — A Knowledge of God: an open book beneath stars */
    "knowledge-of-god"() {
      return (
        // stars
        star(96, 74, 8) + star(224, 66, 7) + star(160, 52, 6) + star(258, 104, 5) + star(64, 108, 5) +
        // book
        P("M160 132 C 128 116 96 116 68 128 L 68 236 C 96 224 128 224 160 240 C 192 224 224 224 252 236 L 252 128 C 224 116 192 116 160 132 Z") +
        L(160, 132, 160, 240) +
        // page lines
        L(86, 150, 146, 146, "thin soft") + L(86, 168, 146, 164, "thin soft") + L(86, 186, 146, 182, "thin soft") +
        L(174, 146, 234, 150, "thin soft") + L(174, 164, 234, 168, "thin soft") + L(174, 182, 234, 186, "thin soft") +
        // rays from the book
        fan(160, 132, 8, 26, 250, 290, 5, "thin soft")
      );
    },

    /* 11 — The Privilege of Prayer: open cupped hands receiving light */
    "prayer"() {
      return (
        // light descending from above
        C(160, 74, 11) +
        rays(160, 74, 13, 26, 12, "thin soft") +
        fan(160, 92, 8, 52, 62, 118, 5, "thin soft") +
        // the bowl of two open palms
        P("M100 176 C 104 202 130 216 160 216 C 190 216 216 202 220 176", "") +
        L(160, 216, 160, 200, "thin soft") +
        // fingers, left hand
        L(100, 176, 96, 148, "thin") + L(112, 180, 110, 150, "thin") +
        L(124, 183, 124, 152, "thin") + L(136, 185, 138, 154, "thin") +
        // fingers, right hand
        L(220, 176, 224, 148, "thin") + L(208, 180, 210, 150, "thin") +
        L(196, 183, 196, 152, "thin") + L(184, 185, 182, 154, "thin") +
        // wrists / cuffs
        P("M118 210 L 108 258", "thin") + P("M202 210 L 212 258", "thin") +
        P("M104 258 Q 122 250 140 258", "thin") + P("M180 258 Q 198 250 216 258", "thin")
      );
    },

    /* 12 — What to Do with Doubt: light breaking through cloud */
    "doubt"() {
      return (
        // sun behind, rays piercing downward
        C(196, 96, 30, "thin") +
        fan(196, 96, 32, 96, 40, 150, 7, "thin soft") +
        // cloud
        P("M84 168 C 70 168 62 156 70 146 C 66 128 88 118 104 128 C 112 110 144 112 150 132 C 172 126 190 142 182 160 C 196 162 196 180 182 182 L 96 182 C 84 182 80 172 84 168 Z") +
        // rain-of-light streaks below the cloud
        L(104, 194, 96, 224, "thin soft") + L(128, 196, 122, 230, "thin soft") +
        L(152, 196, 148, 232, "thin soft") + L(176, 194, 172, 226, "thin soft") +
        star(150, 250, 7)
      );
    },

    /* 13 — Rejoicing in the Lord: full sunburst, birds, blossoms */
    "rejoicing"() {
      return (
        rays(160, 128, 54, 92, 28) +
        rays(160, 128, 50, 70, 28, "thin soft") +
        C(160, 128, 44) +
        // smiling ray-lines inside
        P("M140 124 q 20 22 40 0", "thin") +
        bird(84, 74, 15) + bird(236, 70, 14) + bird(210, 100, 10) +
        // blossoms along the base
        (function () {
          let s = ""; const ys = 256;
          [90, 160, 230].forEach((x) => {
            for (let i = 0; i < 5; i++) {
              const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
              s += E(x + Math.cos(a) * 9, ys + Math.sin(a) * 9, 5, 8, "thin");
            }
            s += C(x, ys, 3, "fillc");
            s += L(x, ys + 9, x, ys + 26, "thin");
          });
          return s;
        })() +
        L(40, 282, 280, 282, "thin soft")
      );
    },

    /* Cover signature: a person reaching toward a hand from above */
    "emblem"() {
      return (
        // an open palm slanting down from the upper right
        `<g transform="rotate(34 202 74)">` +
          P("M180 8 L180 54 C180 61 176 66 170 70 L151 88 C144 95 145 104 151 107 C156 110 161 106 166 101 L176 91 L174 118 C173 128 178 134 184 132 C189 131 191 126 191 118 L192 91 L193 130 C193 139 198 144 204 142 C209 140 210 135 210 128 L209 91 L212 122 C213 131 218 135 224 132 C229 129 228 123 227 116 L224 88 L229 106 C231 114 237 117 242 113 C246 109 243 101 241 95 L232 69 C230 63 226 58 221 54 L221 8 Z") +
          P("M177 73 C187 67 198 65 209 68 C218 70 225 76 229 84", "thin") +
          P("M183 83 C191 78 202 77 212 81", "thin soft") +
          // nail wound in the center of the visible palm
          C(202, 74, 5) + C(202, 74, 2, "fillc") +
        `</g>` +
        // a more natural figure standing at the first step
        C(68, 229, 12) +
        P("M60 242 C52 248 48 258 47 270 M76 242 C83 251 86 260 87 270") +
        P("M58 248 C66 253 74 253 81 248", "thin") +
        P("M58 245 C49 248 41 255 34 264") +
        P("M77 244 C83 235 88 227 94 220 C99 214 104 209 109 205") +
        P("M109 205 C111 203 113 201 114 198", "thin") +
        // a longer staircase bridges earth and the light
        P("M28 270 L96 270 L96 257 L112 257 L112 244 L128 244 L128 231 L144 231 L144 218 L160 218 L160 205 L176 205 L176 192 L192 192 L192 179 L208 179 L208 166 L224 166 L224 153 L240 153") +
        P("M22 278 L248 278", "thin soft")
      );
    }
  };

  /* ---- small section-header glyphs (48x48) ---- */
  const GLYPH = {
    picture() {
      return C(24, 19, 9) +
        P("M19.5 27 L 20.5 33 L 27.5 33 L 28.5 27", "thin") +
        L(21, 36, 27, 36, "thin") +
        P("M21 19 L 24 23 L 27 19", "thin");
    },
    idea() { return C(24, 25, 7) + rays(24, 25, 10, 16, 8, "thin"); },
    quote() {
      return L(24, 14, 24, 35) +
        P("M24 14 C 18 11 12 11 8 13 L 8 32 C 12 30 18 30 24 33 Z") +
        P("M24 14 C 30 11 36 11 40 13 L 40 32 C 36 30 30 30 24 33 Z");
    },
    reallife() { return C(24, 24, 13) + P("M24 13 L 27 24 L 24 35 L 21 24 Z", "fillc") + C(24, 24, 1.6, "fillc"); },
    reflect() { return C(24, 17, 2.2, "fillc") + P("M12 26 Q 24 32 36 26", "thin") + P("M9 31 Q 24 39 39 31", "thin"); },
    prayer() {
      return P("M24 12 C 31 20 30 30 24 36 C 18 30 17 20 24 12 Z") +
        P("M24 20 C 27 24 27 30 24 34 C 21 30 21 24 24 20 Z", "thin");
    }
  };
  function glyphSvg(name) {
    return `<svg viewBox="0 0 48 48" class="art" role="img" aria-hidden="true">${GLYPH[name]()}</svg>`;
  }
  function glyphFor(text) {
    const t = (text || "").toLowerCase();
    if (t.includes("start here")) return "picture";
    if (t.includes("big idea") || t.includes("what this chapter")) return "idea";
    if (t.includes("ellen white")) return "quote";
    if (t.includes("real life") || t.includes("put it into practice")) return "reallife";
    if (t.includes("reflect") || t.includes("think it through")) return "reflect";
    if (t.includes("prayer")) return "prayer";
    return null;
  }
  function decorate() {
    document.querySelectorAll(".content .section .kicker").forEach((k) => {
      if (k.dataset.glyphed) return;
      const name = glyphFor(k.textContent);
      if (!name) return;
      k.dataset.glyphed = "1";
      const span = document.createElement("span");
      span.className = "glyph";
      span.innerHTML = glyphSvg(name);
      k.parentNode.insertBefore(span, k);
    });
  }

  function svg(slug, aria) {
    const concept = START_ART[slug];
    const art = concept ? concept.draw() : (ART[slug] ? ART[slug]() : star(160, 150, 40));
    const viewBox = concept ? "0 0 240 150" : "0 0 320 300";
    const label = concept ? concept.label : aria;
    return '<svg viewBox="' + viewBox + '" class="art plate-svg" role="img" aria-label="' +
      (label || "") + '">' + art + "</svg>";
  }

  function mountAll() {
    document.querySelectorAll("[data-engraving]").forEach((el) => {
      const slug = el.getAttribute("data-engraving");
      const aria = el.getAttribute("data-label") || "";
      el.innerHTML = svg(slug, aria);
    });
    decorate();
  }

  global.Engravings = { svg, mountAll, ART };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }
})(window);
