// Subject icons — lifted from Figma /Components/components/SubjectIcon*.
// 20 subjects, each rendered as a rounded square tile with inner glyph.

const SUBJ = {
  biology:               { bg: "rgb(43,85,32)",    fg: "rgb(206,244,184)", kind: "img", src: "assets/subject/biology.svg",                iw: 18,     ih: 18.036, ix: 5,     iy: 5 },
  businessManagement:    { bg: "rgb(0,88,120)",    fg: "rgb(161,225,244)", kind: "img", src: "assets/subject/businessManagement.svg",     iw: 15.999, ih: 16,     ix: 6,     iy: 6 },
  chemistry:             { bg: "rgb(237,86,56)",   fg: "rgb(255,190,181)", kind: "img", src: "assets/subject/chemistry.svg",              iw: 15.001, ih: 17.031, ix: 6.499, iy: 5.435 },
  economics:             { bg: "rgb(119,74,33)",   fg: "rgb(250,221,163)", kind: "img", src: "assets/subject/economics.svg",              iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  english:               { bg: "rgb(63,55,146)",   fg: "rgb(199,194,255)", kind: "img", src: "assets/subject/english.svg",                iw: 20.001, ih: 12,     ix: 4,     iy: 8 },
  englishLanguage:       { bg: "rgb(63,55,146)",   fg: "rgb(199,194,255)", kind: "img", src: "assets/subject/englishLanguage.svg",        iw: 18,     ih: 17.891, ix: 5,     iy: 5 },
  furtherMathematics:    { bg: "rgb(175,67,171)",  fg: "rgb(242,186,238)", kind: "img", src: "assets/subject/furtherMathematics.svg",     iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  geography:             { bg: "rgb(0,88,120)",    fg: "rgb(161,225,244)", kind: "img", src: "assets/subject/geography.svg",              iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  globalPolitics:        { bg: "rgb(121,41,41)",   fg: "rgb(242,170,170)", kind: "img", src: "assets/subject/globalPolitics.svg",         iw: 18,     ih: 17.999, ix: 5,     iy: 5 },
  health:                { bg: "rgb(237,86,56)",   fg: "rgb(255,190,181)", kind: "img", src: "assets/subject/health.svg",                 iw: 18.755, ih: 20,     ix: 4.622, iy: 4 },
  legalStudies:          { bg: "rgb(175,67,171)",  fg: "rgb(242,186,238)", kind: "img", src: "assets/subject/legalStudies.svg",           iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  literature:            { bg: "rgb(0,88,120)",    fg: "rgb(161,225,244)", kind: "img", src: "assets/subject/literature.svg",             iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  mathematicalMethods:   { bg: "rgb(175,67,171)",  fg: "rgb(242,186,238)", kind: "img", src: "assets/subject/mathematicalMethods.svg",    iw: 18,     ih: 18,     ix: 5,     iy: 5 },
  physicalEducation:     { bg: "rgb(237,86,56)",   fg: "rgb(255,190,181)", kind: "img", src: "assets/subject/physicalEducation.svg",      iw: 18,     ih: 18,     ix: 5,     iy: 5 },

  accounting:            { bg: "rgb(0,88,120)",    fg: "rgb(161,225,244)", kind: "pie" },
  psychology:            { bg: "rgb(237,86,56)",   fg: "rgb(255,190,181)", kind: "heart" },
  eal:                   { bg: "rgb(63,55,146)",   fg: "rgb(199,194,255)", kind: "eal" },
  specialistMathematics: { bg: "rgb(175,67,171)",  fg: "rgb(242,186,238)", kind: "specialistMath" },
  physics:               { bg: "rgb(43,85,32)",    fg: "rgb(206,244,184)", kind: "physics" },
  revolutions:           { bg: "rgb(119,74,33)",   fg: "rgb(250,221,163)", kind: "revolutions" },
};

// Map common subject names to the icon key
const SUBJECT_KEY = (name) => {
  if (!name) return "accounting";
  const n = name.toLowerCase();
  if (n.includes("account")) return "accounting";
  if (n.includes("psych"))   return "psychology";
  if (n.includes("biolog"))  return "biology";
  if (n.includes("chem"))    return "chemistry";
  if (n.includes("phys") && n.includes("ed")) return "physicalEducation";
  if (n.includes("phys"))    return "physics";
  if (n.includes("legal"))   return "legalStudies";
  if (n.includes("geog"))    return "geography";
  if (n.includes("health"))  return "health";
  if (n.includes("econ"))    return "economics";
  if (n.includes("revol"))   return "revolutions";
  if (n.includes("business"))return "businessManagement";
  if (n.includes("global"))  return "globalPolitics";
  if (n.includes("litera"))  return "literature";
  if (n.includes("eal"))     return "eal";
  if (n.includes("english language")) return "englishLanguage";
  if (n.includes("english")) return "english";
  if (n.includes("specialist")) return "specialistMathematics";
  if (n.includes("further"))    return "furtherMathematics";
  if (n.includes("method") || n.includes("foundation") || n.includes("math")) return "mathematicalMethods";
  return "accounting";
};

/* ── Inline glyphs for icons not backed by a .svg file ── */
function PieGlyph({ fg }) {
  return (
    <>
      <svg viewBox="0 0 16.232 16.223" style={{ position: "absolute", left: 1.768, top: 1.781, width: 16.232, height: 16.223 }}>
        <path d="M 8.27 0.342 L 8.27 7.763 C 8.27 7.95 8.117 8.104 7.929 8.104 L 0.341 8.104 C 0.15 8.104 -0.01 8.26 0 8.451 C 0.191 12.945 4.035 16.496 8.635 16.206 C 12.662 15.954 15.944 12.686 16.213 8.662 C 16.519 4.1 13.051 0.277 8.624 0.001 C 8.43 -0.013 8.27 0.147 8.27 0.342 Z" fill={fg} />
      </svg>
      <svg viewBox="0 0 8.270 8.120" style={{ position: "absolute", left: 0, top: 0, width: 8.27, height: 8.12 }}>
        <path d="M 8.27 0.341 C 8.27 0.154 8.117 -0.007 7.926 0 C 3.643 0.096 0.181 3.51 0 7.769 C -0.007 7.96 0.15 8.12 0.341 8.12 L 7.926 8.12 C 8.113 8.12 8.266 7.967 8.266 7.779 L 8.266 0.341 L 8.27 0.341 Z" fill={fg} />
      </svg>
    </>
  );
}
function HeartGlyph({ fg }) {
  return (
    <svg viewBox="0 0 18 15" style={{ position: "absolute", left: 5, top: 7.032, width: 18, height: 15 }}>
      <path fill={fg} d="M 4.821 0 C 1.76 0 0.042 2.431 0 4.457 C 0 6.765 1.237 8.751 2.956 10.472 C 4.675 12.194 6.896 13.65 8.886 14.97 C 8.948 15.01 9.052 15.01 9.114 14.97 C 11.124 13.674 13.328 12.194 15.044 10.472 C 16.763 8.751 18 6.765 18 4.457 C 17.958 2.431 16.239 0 13.179 0 C 11.357 0 9.742 0.911 8.986 2.086 C 8.251 0.911 6.64 0 4.814 0 L 4.821 0 Z" />
    </svg>
  );
}
function EalGlyph({ fg }) {
  return (
    <svg viewBox="0 0 16 15.996" style={{ position: "absolute", left: 6, top: 6, width: 16, height: 15.996 }}>
      <path fill={fg} d="M 1 0 L 0 4 L 1 4 C 1 2.901 1.901 2 3 2 L 6 2 L 6 13.996 C 6 14.596 5.599 14.996 5 14.996 L 4 14.996 L 4 15.996 L 12 15.996 L 12 14.996 L 11 14.996 C 10.401 14.996 10 14.596 10 13.996 L 10 2 L 13 2 C 14.099 2 15 2.901 15 4 L 16 4 L 15 0 L 1.004 0 L 1 0 Z" />
    </svg>
  );
}
function SpecialistMathGlyph({ fg }) {
  return (
    <svg viewBox="0 0 19.115 16.879" style={{ position: "absolute", left: 4, top: 6, width: 19.115, height: 16.879 }}>
      <path fill={fg} d="M 1.036 8.608 C -0.345 8.608 -0.345 6.496 1.036 6.496 L 3.962 6.496 L 4.286 7.147 L 6.237 11.862 L 9.893 0.731 L 10.217 0 L 18.019 0 C 19.48 0 19.48 2.195 18.019 2.195 L 11.761 2.195 L 6.688 16.648 C 6.585 16.945 6.175 16.959 6.047 16.672 L 2.498 8.615 L 1.036 8.615 L 1.036 8.608 Z" />
    </svg>
  );
}
// Physics: 4 circles (atom electrons); Revolutions: 5 little "flames"
function PhysicsGlyph({ fg }) {
  // Rough atom pattern: nucleus + 3 orbiting electrons
  return (
    <svg viewBox="0 0 20 20" style={{ position: "absolute", left: 4, top: 4.5, width: 20, height: 19.127 }}>
      <circle cx="10" cy="10" r="2.1" fill={fg} />
      <circle cx="2.5" cy="10" r="2.1" fill={fg} />
      <circle cx="17.5" cy="10" r="2.1" fill={fg} />
      <circle cx="10" cy="2.5" r="2.1" fill={fg} />
      <circle cx="10" cy="17.5" r="2.1" fill={fg} />
    </svg>
  );
}
function RevolutionsGlyph({ fg }) {
  // Raised fist approximated with rounded rects (flames)
  return (
    <svg viewBox="0 0 16 19" style={{ position: "absolute", left: 5.657, top: 4.521, width: 15.947, height: 18.818 }}>
      <rect x="0"   y="4.3" width="2.7" height="6.5" rx="1" fill={fg} />
      <rect x="3.3" y="2.8" width="2.7" height="8.0" rx="1" fill={fg} />
      <rect x="6.6" y="3.5" width="2.7" height="7.2" rx="1" fill={fg} />
      <rect x="9.9" y="1.0" width="2.7" height="9.8" rx="1" fill={fg} />
      <rect x="0"   y="11"  width="13.2" height="7.5" rx="3" fill={fg} />
    </svg>
  );
}

/* ── Inline SVG loader (needed so currentColor inherits from the tile's `color`) ── */
const _svgCache = {};
function InlineSVG({ src, fg, style }) {
  const [html, setHtml] = React.useState(_svgCache[src] || null);
  React.useEffect(() => {
    if (_svgCache[src]) { setHtml(_svgCache[src]); return; }
    fetch(src).then(r => r.text()).then(t => {
      // strip XML declaration and outer <svg> attrs we don't want
      _svgCache[src] = t;
      setHtml(t);
    }).catch(() => {});
  }, [src]);
  if (!html) return null;
  return (
    <span
      style={{ display: "block", color: fg, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ── Main component ── */
function SubjectIconTile({ subject = "accounting", size = 28 }) {
  const key = SUBJ[subject] ? subject : SUBJECT_KEY(subject);
  const s = SUBJ[key] || SUBJ.accounting;
  const scale = size / 28;

  let inner = null;
  if (s.kind === "img") {
    inner = (
      <InlineSVG src={s.src} fg={s.fg} style={{
        position: "absolute",
        left: s.ix, top: s.iy, width: s.iw, height: s.ih,
      }}/>
    );
  } else if (s.kind === "pie")           inner = <PieGlyph fg={s.fg} />;
  else if (s.kind === "heart")           inner = <HeartGlyph fg={s.fg} />;
  else if (s.kind === "eal")             inner = <EalGlyph fg={s.fg} />;
  else if (s.kind === "specialistMath")  inner = <SpecialistMathGlyph fg={s.fg} />;
  else if (s.kind === "physics")         inner = <PhysicsGlyph fg={s.fg} />;
  else if (s.kind === "revolutions")     inner = <RevolutionsGlyph fg={s.fg} />;

  // The accounting pie needs a positioned wrapper
  const innerWrap = s.kind === "pie" ? (
    <div style={{ position: "absolute", left: 5, top: 5.103, width: 18, height: 18.004, overflow: "hidden" }}>{inner}</div>
  ) : inner;

  return (
    <div style={{
      position: "relative", width: 28, height: 28,
      transform: `scale(${scale})`, transformOrigin: "top left",
      marginRight: scale !== 1 ? (28 * scale - 28) : 0,
      marginBottom: scale !== 1 ? (28 * scale - 28) : 0,
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 4, backgroundColor: s.bg,
      }} />
      {innerWrap}
    </div>
  );
}

Object.assign(window, { SubjectIconTile, SUBJECT_KEY });
