// Question Bank — standalone page
// Modeled on Figma /Landing/Question-Bank/QBListView and /create-exam/qb-preview-see-all.
// Features:
//   - Exam folders grouped by subject (Accounting, English, Chemistry, Further Maths, etc.)
//   - List / grid view toggle
//   - Subject + Sub-category filters (chip multi-select)
//   - Favorites toggle
//   - Row click → Question Preview modal (full question content + Apply)
//   - Pagination (Show: 24 per page)

const { useState: qbUseState, useMemo: qbUseMemo, useEffect: qbUseEffect } = React;

// ─────────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────────
const QB_SUBJECTS_ALL = [
  "Accounting","Biology","Chemistry","Economics","English","EAL","English Language",
  "Further Mathematics","Mathematical Methods","Specialist Mathematics",
  "Psychology","Physical Education","Physics","Legal Studies","Literature",
  "Geography","Global Politics","Health","Business Management","Revolutions",
  "Music","Art Making and Exhibiting","Chinese Second Language","Foundation Mathematics",
  "Extended Investigation","Health and Human Development","Arabic",
];

const QB_CATEGORIES = {
  "Accounting":              ["Financial records","Cash flow","Ratios","Ethics"],
  "Chemistry":               ["Organic reactions","Stoichiometry","Thermochemistry","Equilibrium"],
  "English":                 ["Section A","Section B","Section C","Close analysis"],
  "Further Mathematics":     ["Matrices","Graphs & relations","Recursion","Data analysis"],
  "Mathematical Methods":    ["Functions","Calculus","Probability","Transformations"],
  "Specialist Mathematics":  ["Complex numbers","Integration","Vectors","Mechanics"],
  "Biology":                 ["Genetics","Evolution","Nervous system","Cell biology"],
  "Physics":                 ["Mechanics","Electricity","Waves","Thermodynamics"],
  "Psychology":              ["Research methods","Memory","Learning","Development"],
  "Business Management":     ["Operations","Marketing","HR","Finance"],
};

// Seed: 24 exam collections across many subjects
const QB_EXAMS_RAW = [
  ["Music",                     "1",  "12 Feb 2022", true,  "Australia/Melbourne"],
  ["Economics",                 "3",  "14 Feb 2022", false, "Australia/Melbourne"],
  ["Arabic",                    "4",  "19 Feb 2022", true,  "Australia/Melbourne"],
  ["Chemistry",                 "1",  "27 Feb 2022", false, "Australia/Melbourne"],
  ["Art Making and Exhibiting", "1",  "13 Mar 2022", false, "Australia/Melbourne"],
  ["Chinese Second Language",   "14", "13 Mar 2022", false, "Australia/Melbourne"],
  ["Business Management",       "13", "06 Apr 2022", false, "Australia/Melbourne"],
  ["Foundation Mathematics",    "8",  "07 May 2022", false, "Australia/Melbourne"],
  ["Extended Investigation",    "9",  "11 Jul 2022", false, "Australia/Melbourne"],
  ["Health and Human Development","11","12 Jul 2022",false, "Australia/Melbourne"],
  ["Accounting",                "22", "04 Aug 2022", true,  "Australia/Melbourne"],
  ["English",                   "17", "11 Aug 2022", true,  "Australia/Melbourne"],
  ["Further Mathematics",       "31", "01 Sep 2022", false, "Australia/Melbourne"],
  ["Mathematical Methods",      "28", "14 Sep 2022", true,  "Australia/Melbourne"],
  ["Specialist Mathematics",    "19", "02 Oct 2022", false, "Australia/Melbourne"],
  ["Biology",                   "24", "18 Oct 2022", false, "Australia/Melbourne"],
  ["Physics",                   "15", "05 Nov 2022", false, "Australia/Melbourne"],
  ["Psychology",                "26", "19 Nov 2022", true,  "Australia/Melbourne"],
  ["Legal Studies",             "13", "06 Dec 2022", false, "Australia/Melbourne"],
  ["Literature",                "9",  "14 Dec 2022", false, "Australia/Melbourne"],
  ["Geography",                 "11", "08 Jan 2023", false, "Australia/Melbourne"],
  ["Global Politics",           "7",  "22 Jan 2023", false, "Australia/Melbourne"],
  ["Health",                    "10", "07 Feb 2023", false, "Australia/Melbourne"],
  ["Physical Education",        "14", "21 Feb 2023", false, "Australia/Melbourne"],
  ["Revolutions",               "8",  "09 Mar 2023", false, "Australia/Melbourne"],
  ["English Language",          "12", "19 Mar 2023", false, "Australia/Melbourne"],
  ["EAL",                       "6",  "02 Apr 2023", false, "Australia/Melbourne"],
];

const subjCode = (s) => {
  const m = { "Accounting":"AC","English":"EG","Chemistry":"CH","Biology":"BIO","Physics":"PHY","Further Mathematics":"FM","Mathematical Methods":"MM","Specialist Mathematics":"SM","Psychology":"PSY","Legal Studies":"LG","Literature":"LIT","Geography":"GEO","Global Politics":"GP","Health":"HLT","Business Management":"BM","Revolutions":"REV","Music":"MUS","Art Making and Exhibiting":"ART","Chinese Second Language":"CHN","Foundation Mathematics":"FDM","Extended Investigation":"EXI","Health and Human Development":"HHD","Economics":"EC","Arabic":"ARA","Physical Education":"PE","English Language":"EL","EAL":"EAL" };
  return (m[s] || s.slice(0, 3).toUpperCase()) + "34";
};

const QB_EXAMS = QB_EXAMS_RAW.map((r, i) => ({
  id: "qb" + i, subject: r[0], count: r[1], created: r[2], favorite: r[3], region: r[4],
  code: subjCode(r[0]),
  title: "All Exam collection test naming",
}));

// Rich preview content for the selected folder
const QB_PREVIEW_SECTIONS = [
  {
    code: "EG34", subtitle: "All Exam collection test naming",
    sections: [
      {
        heading: "Pride and Prejudice (Jane Austen) —",
        items: [
          ["“Pride is both a vice and a virtue in Austen's world.”", "Discuss how pride and prejudice interplay in the novel's exploration of social values."],
          ["Austen's narrative suggests that first impressions are often misleading. To what extent do you agree?", "(Consider how attitudes and perceptions evolve throughout the text.)"],
        ],
      },
      {
        heading: "Things Fall Apart (Chinua Achebe) —",
        items: [
          ["“Why should a man suffer so grievously for an offence he had committed inadvertently?”", "In Things Fall Apart, the consequences of actions are rarely. Do you agree?"],
          ["Achebe portrays tradition as both a source of strength and a source of conflict.", "Discuss how cultural traditions shape fate and personal identity in the novel."],
        ],
      },
      {
        heading: "My Brilliant Career (Miles Franklin) —",
        items: [
          ["“It is worth being poor once or twice in a lifetime…”", "Discuss the interplay between wealth and poverty in My Brilliant. How do economic circumstances influence the characters' choices and values?"],
          ["Franklin's novel explores a young woman's struggle for independence.", "To what extent does Sybylla achieve freedom on her own terms, and what does this suggest about gender expectations?"],
        ],
      },
      {
        heading: "Born a Crime (Trevor Noah) —",
        items: [
          ["Noah asserts that humor is a weapon for survival in an unjust society.", "How does Born a Crime demonstrate the power of humor and resilience in the face of adversity?"],
          ["“Understanding begins where fear ends.”", "Discuss how overcoming fear and prejudice is central to Noah's experiences in apartheid and post-apartheid South Africa."],
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────
//  Preview modal
// ─────────────────────────────────────────────────
function QbPreviewModal({ exam, onClose, onApply }) {
  if (!exam) return null;
  const payload = QB_PREVIEW_SECTIONS[0];
  const stop = (e) => e.stopPropagation();

  return (
    <div className="qbank-modal-backdrop" onClick={onClose}>
      <div className="qbank-modal" onClick={stop}>
        <div className="qbank-modal-head">
          <div>
            <h2>Question Preview</h2>
            <div className="qbank-modal-meta">
              <span className="qbank-code">{exam.code}</span>
              <span style={{ color: "var(--color-stone-500)" }}>{exam.title}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="qbank-apply-btn" onClick={() => onApply(exam)}>Apply</button>
            <button className="qbank-close-btn" onClick={onClose} aria-label="Close">
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        <div className="qbank-modal-body">
          <div className="qbank-q-heading">
            <b>Question 1</b>
            <span className="qbank-q-marks">1 marks</span>
          </div>

          {payload.sections.map((sec, si) => (
            <div key={si} className="qbank-q-section">
              <b>{sec.heading}</b>
              <ol>
                {sec.items.map(([lead, rest], ii) => (
                  <li key={ii}>
                    <em>{lead}</em> {rest}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Filter bar
// ─────────────────────────────────────────────────
function QbFilters({ subjects, onSubjects, category, onCategory, onlyFav, onFav, view, onView, count }) {
  const subjChoices = QB_SUBJECTS_ALL;
  const cats = subjects.length === 1 ? (QB_CATEGORIES[subjects[0]] || []) : [];

  return (
    <div className="qbank-filters">
      <div className="qbank-tabs">
        <button className="qbank-tab is-active">Exams</button>
        <button className="qbank-tab">Favorites <span className="qbank-count">{QB_EXAMS.filter(e => e.favorite).length}</span></button>
      </div>

      <div style={{ flex: 1 }} />

      <div className="qbank-field">
        <label>Subjects</label>
        <div className="qbank-multi">
          {subjects.length === 0
            ? <span className="qbank-muted">All</span>
            : subjects.map(s => (
              <span key={s} className="qbank-chip">{s}<button onClick={() => onSubjects(subjects.filter(x => x !== s))}><Icon name="x" size={10}/></button></span>
            ))
          }
          <select value="" onChange={(e) => { const v = e.target.value; if (v && !subjects.includes(v)) onSubjects([...subjects, v]); }}>
            <option value="">+ Add…</option>
            {subjChoices.filter(s => !subjects.includes(s)).map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="qbank-field">
        <label>Sub Categories</label>
        <select value={category} onChange={e => onCategory(e.target.value)} disabled={cats.length === 0}>
          <option value="">All</option>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Views
// ─────────────────────────────────────────────────
function QbListTable({ rows, onRowClick, onToggleFav, menuOpenId, onMenuToggle, onPreview }) {
  return (
    <div className="qbank-table-wrap">
      <table className="qbank-table">
        <thead>
          <tr>
            <th style={{ width: "36%" }}>Subject</th>
            <th style={{ width: 90 }}>No.</th>
            <th style={{ width: 140 }}>Created</th>
            <th style={{ width: 100 }}>Favorite</th>
            <th style={{ width: 220 }}>Region</th>
            <th style={{ width: 50 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} onClick={() => onRowClick(r)}>
              <td>
                <span className="qbank-subj-cell">
                  <SubjectIconTile subject={r.subject} size={34} />
                  <b>{r.subject}</b>
                </span>
              </td>
              <td>{r.count}</td>
              <td style={{ color: "var(--color-stone-700)" }}>{r.created}</td>
              <td>
                <button
                  className={`qbank-star ${r.favorite ? "is-on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); onToggleFav(r.id); }}
                  aria-label={r.favorite ? "Unfavorite" : "Favorite"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={r.favorite ? "#F4B400" : "none"} stroke={r.favorite ? "#F4B400" : "var(--color-stone-300)"} strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              </td>
              <td style={{ color: "var(--color-stone-700)" }}>{r.region}</td>
              <td style={{ textAlign: "right", position: "relative" }}>
                <button
                  className={`more-btn ${menuOpenId === r.id ? "is-open" : ""}`}
                  onClick={(e) => { e.stopPropagation(); onMenuToggle(r.id); }}
                  aria-label="More"
                >
                  <Icon name="more-vertical" size={16} />
                </button>
                {menuOpenId === r.id && (
                  <div className="qbank-menu" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { onPreview(r); onMenuToggle(null); }}>
                      <Icon name="eye" size={14}/> Preview
                    </button>
                    <button>
                      <Icon name="plus" size={14}/> Use in exam
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} style={{ padding: 56, textAlign: "center", color: "var(--color-stone-500)" }}>No exams match your filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function QbGrid({ rows, onRowClick, onToggleFav }) {
  return (
    <div className="qbank-grid">
      {rows.map(r => (
        <div className="qbank-card" key={r.id} onClick={() => onRowClick(r)}>
          <div className="qbank-card-head">
            <SubjectIconTile subject={r.subject} size={40} />
            <button
              className={`qbank-star ${r.favorite ? "is-on" : ""}`}
              onClick={(e) => { e.stopPropagation(); onToggleFav(r.id); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={r.favorite ? "#F4B400" : "none"} stroke={r.favorite ? "#F4B400" : "var(--color-stone-300)"} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          </div>
          <div className="qbank-card-title">{r.subject}</div>
          <div className="qbank-card-meta"><b>{r.count}</b> exams · {r.created.split(" ").slice(1).join(" ")}</div>
          <div className="qbank-card-foot">
            <span className="qbank-code">{r.code}</span>
            <span className="qbank-card-region">{r.region.split("/")[1]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────
function QuestionBank() {
  useLucide();
  const [subjects, setSubjects] = qbUseState([]);
  const [category, setCategory] = qbUseState("");
  const [onlyFav, setOnlyFav]   = qbUseState(false);
  const [view, setView]         = qbUseState("list");  // "list" | "grid"
  const [page, setPage]         = qbUseState(1);
  const [pageSize]              = qbUseState(24);
  const [preview, setPreview]   = qbUseState(null);
  const [menuOpen, setMenuOpen] = qbUseState(null);
  const [favMap, setFavMap]     = qbUseState(() => Object.fromEntries(QB_EXAMS.map(e => [e.id, e.favorite])));

  qbUseEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  qbUseEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const rows = qbUseMemo(() => {
    let r = QB_EXAMS.map(e => ({ ...e, favorite: favMap[e.id] || false }));
    if (subjects.length) r = r.filter(e => subjects.includes(e.subject));
    if (onlyFav)        r = r.filter(e => e.favorite);
    return r;
  }, [subjects, onlyFav, favMap]);

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const toggleFav = (id) => setFavMap(m => ({ ...m, [id]: !m[id] }));

  return (
    <div className="page">
      <div className="page-head">
        <h1>Question Bank</h1>
        <p>Browse collections of past-paper questions by subject. Star favorites or preview a bundle before applying to an exam.</p>
      </div>

      <div className="qbank-card-wrap">
        <QbFilters
          subjects={subjects} onSubjects={(s) => { setSubjects(s); setCategory(""); setPage(1); }}
          category={category} onCategory={(c) => { setCategory(c); setPage(1); }}
          onlyFav={onlyFav} onFav={setOnlyFav}
          view={view} onView={setView}
        />

        <div className="qbank-toolbar">
          <div className="qbank-view-toggle" role="tablist">
            <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view">
              <Icon name="list" size={14} />
            </button>
            <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Grid view">
              <Icon name="layout-grid" size={14} />
            </button>
          </div>

          <button className={`qbank-fav-toggle ${onlyFav ? "is-on" : ""}`} onClick={() => { setOnlyFav(o => !o); setPage(1); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={onlyFav ? "#F4B400" : "none"} stroke={onlyFav ? "#F4B400" : "currentColor"} strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Favorites only
          </button>

          <div style={{ flex: 1 }} />

          <div className="qbank-page-ctrl">
            <span>Show:</span>
            <select value={pageSize} disabled><option>24</option></select>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><Icon name="chevron-left" size={14}/></button>
            <span className="qbank-page-pos">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><Icon name="chevron-right" size={14}/></button>
          </div>
        </div>

        {view === "list"
          ? <QbListTable rows={paged} onRowClick={setPreview} onToggleFav={toggleFav} menuOpenId={menuOpen} onMenuToggle={setMenuOpen} onPreview={setPreview} />
          : <QbGrid rows={paged} onRowClick={setPreview} onToggleFav={toggleFav} />
        }
      </div>

      <QbPreviewModal
        exam={preview}
        onClose={() => setPreview(null)}
        onApply={(e) => { setPreview(null); window.alert(`Applied ${e.code} to your exam draft.`); }}
      />
    </div>
  );
}

Object.assign(window, { QuestionBank });
