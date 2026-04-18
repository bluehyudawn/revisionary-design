// Marking — full flow from Figma /marking page
//   view: list      → Exam List with filter modal     (/marking/marking, /marking/marking-filter)
//   view: subs      → Submission List per exam        (/marking/submissionList-required, /marking/submissionList-completed)
//   view: detail    → Marking editor for one student  (/marking/marking-detail/*, /marking/{one,free,short,drawing,equation,rubric}-answer-type)

const { useState: mkUseState, useRef: mkUseRef, useEffect: mkUseEffect } = React;

// ─────────────────────────────────────────────────
//  Shared data
// ─────────────────────────────────────────────────
const MK_MY_EXAMS = [
  { id: "e1",  subj: "Accounting(U3&4)",     year: "Y11", name: "Mid-year practice exam",       state: "closed",    created: "Alex Lee", sub: { v: 3, max: 3 },  marked: { v: 3, max: 3 },  progress: 100, action: "generate" },
  { id: "e2",  subj: "Accounting(U3&4)",     year: "Y11", name: "Unit 3 — Financial records",   state: "open",      created: "Alex Lee", sub: { v: 5, max: 10 }, marked: { v: 3, max: 5 },  progress: 60 },
  { id: "e3",  subj: "Chemistry(U3&4)",      year: "Y12", name: "Organic reactions SAC",        state: "scheduled", created: "Alex Lee", sub: { v: 0, max: 12 }, marked: { v: 0, max: 12 }, progress: 0 },
];
const MK_OTHERS = [
  { id: "o1", subj: "Accounting(U3&4)",     year: "Y11", name: "Ethics topic test",            state: "closed",    created: "Suji Kim",  sub: { v: 12, max: 12 }, marked: { v: 6, max: 12 }, progress: 50 },
  { id: "o2", subj: "Accounting(U3&4)",     year: "Y11", name: "Cash flow mini-SAC",           state: "closed",    created: "Min Ahn",   sub: { v: 9, max: 9 },   marked: { v: 0, max: 9 },  progress: 0 },
  { id: "o3", subj: "Accounting(U3&4)",     year: "Y11", name: "Short-response bundle",        state: "closed",    created: "Jake Lee",  sub: { v: 11, max: 11 }, marked: { v: 0, max: 11 }, progress: 0 },
  { id: "o4", subj: "Psychology",           year: "Y11", name: "Research methods check-in",    state: "open",      created: "Won Kim",   sub: { v: 6, max: 18 },  marked: { v: 2, max: 6 },  progress: 33 },
  { id: "o5", subj: "Further Mathematics",  year: "Y11", name: "Matrices topic test",          state: "scheduled", created: "Jae Jung",  sub: { v: 0, max: 15 },  marked: { v: 0, max: 0 },  progress: 0 },
  { id: "o6", subj: "Accounting(U3&4)",     year: "Y11", name: "Ratios diagnostic",            state: "open",      created: "Dami Kim",  sub: { v: 4, max: 20 },  marked: { v: 4, max: 4 },  progress: 100 },
];

const SUBJECT_OPTIONS = [
  "Accounting","Biology","Chemistry","Physics","Business Management",
  "Legal Studies","English","EAL","English Language","General Mathematics 1","General Mathematics 2",
  "Literature","Foundation Mathematics","Geography","Health & Human Development",
  "Physical Education","Psychology",
];

// ─────────────────────────────────────────────────
//  Exam List — filter modal
// ─────────────────────────────────────────────────
function MkFilterModal({ open, filters, onApply, onClose }) {
  const [local, setLocal] = mkUseState(filters);
  mkUseEffect(() => { if (open) setLocal(filters); }, [open, filters]);
  if (!open) return null;
  const toggleSet = (key, v) => setLocal(l => {
    const s = new Set(l[key]);
    s.has(v) ? s.delete(v) : s.add(v);
    return { ...l, [key]: Array.from(s) };
  });
  return (
    <div className="mk-modal-backdrop" onClick={onClose}>
      <div className="mk-modal" onClick={e => e.stopPropagation()}>
        <div className="mk-modal-row">
          <span className="mk-modal-label">Year</span>
          <div className="mk-modal-opts">
            {["Y11","Y12"].map(v => (
              <label key={v} className="mk-check">
                <input type="checkbox" checked={local.year.includes(v)} onChange={() => toggleSet("year", v)} />
                <span>{v === "Y11" ? "Year 11" : "Year 12"}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mk-modal-row">
          <span className="mk-modal-label">Subject</span>
          <div className="mk-modal-opts mk-modal-opts-grid">
            {SUBJECT_OPTIONS.map(v => (
              <label key={v} className="mk-check">
                <input type="checkbox" checked={local.subject.includes(v)} onChange={() => toggleSet("subject", v)} />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mk-modal-row">
          <span className="mk-modal-label">State</span>
          <div className="mk-modal-opts">
            {[["expired","Expired"],["in-progress","In Progress"],["upcoming","Upcoming"]].map(([v,l]) => (
              <label key={v} className="mk-check">
                <input type="checkbox" checked={local.state.includes(v)} onChange={() => toggleSet("state", v)} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mk-modal-foot">
          <button className="mk-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="mk-modal-apply" onClick={() => { onApply(local); onClose(); }}>Search</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Exam List view
// ─────────────────────────────────────────────────
function MkExamList({ onOpenExam }) {
  const [q, setQ] = mkUseState("");
  const [filterOpen, setFilterOpen] = mkUseState(false);
  const [filters, setFilters] = mkUseState({ year: [], subject: [], state: [] });

  const activeChips = [
    ...filters.year.map(v => ({ key: "year", v, label: v === "Y11" ? "Year 11" : "Year 12" })),
    ...filters.subject.map(v => ({ key: "subject", v, label: v })),
    ...filters.state.map(v => ({ key: "state", v, label: v[0].toUpperCase() + v.slice(1).replace("-"," ") })),
  ];
  const removeChip = (c) => setFilters(f => ({ ...f, [c.key]: f[c.key].filter(x => x !== c.v) }));

  return (
    <div className="page">
      <div className="page-head">
        <h1>Exam List</h1>
      </div>

      <div className="myexams-card">
        <div className="myexams-toolbar">
          <div className="search-inline-input" style={{ width: 320 }}>
            <Icon name="search" size={16} />
            <input placeholder="Search exam name, creator..." value={q} onChange={e => setQ(e.target.value)} />
            {q && <button className="search-clear" onClick={() => setQ("")}><Icon name="x" size={12} /></button>}
          </div>
          <button className={`filter-pill ${activeChips.length ? "is-active" : ""}`} onClick={() => setFilterOpen(true)}>
            {activeChips.length > 0 && <span className="filter-pill-dot" />}
            <Icon name="filter" size={14} /> Filter
            {activeChips.length > 0 && <span className="filter-pill-count">{activeChips.length}</span>}
          </button>
          {activeChips.map(c => (
            <span key={c.key + c.v} className="filter-chip">
              {c.label}
              <button onClick={() => removeChip(c)}><Icon name="x" size={12} /></button>
            </span>
          ))}
          <div className="myexams-toolbar-right">
            <button className="more-btn"><Icon name="chevron-left" size={16} /></button>
            <span style={{ fontSize: 13, color: "var(--color-stone-600)" }}>1 / 20</span>
            <button className="more-btn"><Icon name="chevron-right" size={16} /></button>
          </div>
        </div>

        <MkTable title="My Exam"   rows={MK_MY_EXAMS} q={q} onRowClick={onOpenExam} />
        <div style={{ height: 28 }} />
        <MkTable title="Other's"   rows={MK_OTHERS}   q={q} onRowClick={onOpenExam} />
      </div>

      <MkFilterModal open={filterOpen} filters={filters} onApply={setFilters} onClose={() => setFilterOpen(false)} />
    </div>
  );
}

function MkTable({ title, rows, q, onRowClick }) {
  const filtered = rows.filter(r => !q || (r.name + r.subj + r.created).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mk-table-wrap">
      <div className="mk-table-title">{title}<span className="mk-table-count">({filtered.length})</span></div>
      <table className="mk-table">
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Subject</th>
            <th style={{ width: 60 }}>Year</th>
            <th>Exam Name</th>
            <th style={{ width: 190 }}>Start/End Date</th>
            <th style={{ width: 100 }}>State</th>
            <th style={{ width: 120 }}>Created By</th>
            <th style={{ width: 90,  textAlign: "center" }}>Submitted</th>
            <th style={{ width: 190 }}>Marked</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id} onClick={() => onRowClick(r)}>
              <td>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <SubjectIconTile subject={r.subj} size={26} />
                  <b>{r.subj}</b>
                </span>
              </td>
              <td><b>{r.year}</b></td>
              <td style={{ color: "var(--color-stone-600)" }}>{r.name}</td>
              <td style={{ color: "var(--color-stone-600)", fontSize: 12 }}>
                03/Jul/25 21:00 ~ 03/Jul/25 21:00<br/>
                <span style={{ color: "var(--color-stone-400)" }}>AEST (UTC+10)</span>
              </td>
              <td><StatusChip status={r.state} /></td>
              <td>{r.created}</td>
              <td style={{ textAlign: "center" }}><b>{r.sub.v}/{r.sub.max}</b></td>
              <td>
                {r.action === "generate" ? (
                  <button className="mk-generate" onClick={(e) => { e.stopPropagation(); alert("Generating score…"); }}>
                    Generate Score
                  </button>
                ) : (
                  <div className="mk-progress">
                    <span className="mk-progress-pct">{r.progress}%</span>
                    <div className="mk-progress-bar"><div style={{ width: `${r.progress}%` }} /></div>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--color-stone-500)" }}>No exams match your search.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Submission List view
// ─────────────────────────────────────────────────
const MK_SUBMISSIONS = [
  { id: "s1", name: "Stefan Park",     examStatus: "Manual", start: "03/Jul/25, 05:25 PM", submit: "03/Jul/25, 06:25 PM", complete: "03/Jul/25, 09:25 PM" },
  { id: "s2", name: "Emily Chen",      examStatus: "Not",    start: "03/Jul/25, 05:25 PM", submit: "03/Jul/25, 06:25 PM", complete: "03/Jul/25, 09:25 PM" },
  { id: "s3", name: "Daniel Kim",      examStatus: "Auto",   start: "03/Jul/25, 05:25 PM", submit: "03/Jul/25, 06:25 PM", complete: "03/Jul/25, 09:25 PM" },
  { id: "s4", name: "Priya Sharma",    examStatus: "Manual", start: "03/Jul/25, 05:25 PM", submit: "03/Jul/25, 06:25 PM", complete: "03/Jul/25, 09:25 PM" },
  { id: "s5", name: "Marcus O'Neil",   examStatus: "Auto",   start: "03/Jul/25, 05:25 PM", submit: "03/Jul/25, 06:25 PM", complete: "03/Jul/25, 09:25 PM" },
];

function MkSubmissions({ exam, onBack, onOpenDetail }) {
  const [states, setStates] = mkUseState(MK_SUBMISSIONS.map((_, i) => i < 2 ? "required" : "required"));
  const allDone = states.every(s => s === "completed");

  const markingComplete = (i) => setStates(s => s.map((v, j) => j === i ? (v === "required" ? "completed" : "required") : v));

  return (
    <div className="page">
      <div className="page-head" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="mk-backlink" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <h1 style={{ margin: 0 }}>Submission List</h1>
        <span className="mk-sub-tag">{exam?.subj || "Accounting(U3&4)"} · {exam?.name || "Exam Name is Here"}</span>
      </div>

      <div className="mk-sub-card">
        <table className="mk-sub-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Exam Status</th>
              <th>Exam Start Time</th>
              <th>Exam Submit Time</th>
              <th>Marking Status</th>
              <th>Marking Complete Time</th>
              <th style={{ textAlign: "right" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {MK_SUBMISSIONS.map((s, i) => (
              <tr key={s.id} onClick={() => onOpenDetail(s)}>
                <td>
                  <span className="mk-sub-name">
                    <span className="mk-avatar"><Icon name="user" size={14} /></span>
                    <b>{s.name}</b>
                  </span>
                </td>
                <td>{s.examStatus}</td>
                <td className="mk-sub-time">{s.start}<br/><span>AEST (UTC+10)</span></td>
                <td className="mk-sub-time">{s.submit}<br/><span>AEST (UTC+10)</span></td>
                <td>
                  <button
                    className={`mk-marking-chip ${states[i] === "completed" ? "is-done" : "is-required"}`}
                    onClick={(e) => { e.stopPropagation(); markingComplete(i); }}
                  >
                    {states[i] === "completed" ? <Icon name="check-circle-2" size={13} /> : null}
                    {states[i] === "completed" ? "Completed" : "Required"}
                  </button>
                </td>
                <td className="mk-sub-time">{states[i] === "completed" ? s.complete : "—"}<br/>{states[i] === "completed" && <span>AEST (UTC+10)</span>}</td>
                <td style={{ textAlign: "right", color: "var(--color-stone-500)" }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={`mk-sub-foot ${allDone ? "is-done" : ""}`}>
          <span className="mk-sub-foot-msg">
            {allDone ? "Marking Completed. Click to generate the score and send the report." : "Complete all student marking before generating the score."}
          </span>
          <button className="mk-sub-generate" disabled={!allDone} onClick={() => alert("Generate score & send report")}>
            Generate Score
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Marking Detail — multi-answer-type editor
// ─────────────────────────────────────────────────
const MK_DETAIL_QUESTIONS = [
  {
    id: "q1", marks: 1, type: "multi",
    prompt: "Which two statements about carpet area percentage error are correct?",
    options: ["Rounding increases error margin", "Total area grows by ~14%", "Student measured to the nearest 0.1 m", "Area expressed as 3.57 × 3.32"],
    correctIdx: [0, 1],
    studentIdx: [0, 1],
    solution: "The dimensions of the floor of a rectangular room are length 3.57 m and width 3.32 m. A carpet layer rounds the dimensions to the nearest whole number to estimate the area of floor. The percentage error of the carpet layer's estimate for the area of floor compared to the actual area of floor is closest to 14%.",
    correct: true,
  },
  {
    id: "q2", marks: 1, type: "one",
    prompt: "Which option best describes the role of interruption in Maus?",
    options: ["It weakens narrative coherence", "It emphasises subjective recollection", "It hides Vladek's perspective", "It replaces testimony with fiction"],
    correctIdx: [1],
    studentIdx: [1],
    correct: true,
  },
  {
    id: "q3", marks: 2, type: "short",
    prompt: "In one short sentence, define 'stationary point'.",
    studentText: "A point on a curve where the derivative is zero.",
    modelAnswer: "A stationary point is where f'(x)=0.",
    correct: true,
  },
  {
    id: "q4", marks: 2, type: "free",
    prompt: "Explain the structural interplay between past and present in Maus.",
    studentText: "The shifts between temporal settings emphasise the subjective nature of recollection. Vladek's Holocaust narrative is not presented as a seamless historical account but as something filtered through memory, interruption, and reconstruction. In the present-day scenes, Vladek frequently digresses, forgets details, or imposes his own biases onto events.",
    correct: null,
  },
  {
    id: "q5", marks: 2, type: "equation",
    prompt: "Solve 3x + 5 = 17.",
    studentText: "3x + 5 = 17\n3x = 12\nx = 4",
    correct: true,
  },
  {
    id: "q6", marks: 3, type: "drawing",
    prompt: "Sketch the triangle described and annotate the angle of elevation.",
    teacherSvg: "teacher",
    studentSvg: "student",
    correct: null,
  },
  {
    id: "q7", marks: 1, type: "multi",
    prompt: "Select the pair that best illustrates inheritance.",
    options: ["Dog and wolf share phenotype", "Mendel's pea trait ratios", "Chromosomal crossover", "Mitochondrial DNA transfer"],
    correctIdx: [1, 3],
    studentIdx: [0],
    correct: false,
  },
];

function MkDetailQuestion({ q, idx, state, onChange }) {
  const correct = state.judgment === "correct";
  const incorrect = state.judgment === "incorrect";
  const unjudged = state.judgment === null;

  return (
    <div className={`mkd-q ${unjudged ? "is-unjudged" : ""}`}>
      <div className="mkd-q-head">
        <span className={`mkd-q-icon ${correct ? "is-correct" : incorrect ? "is-incorrect" : "is-unset"}`}>
          {correct ? "✓" : incorrect ? "✗" : "•"}
        </span>
        <div className="mkd-q-title">
          Question {idx + 1} <span className="mkd-q-marks">({q.marks} {q.marks === 1 ? "mark" : "marks"})</span>
        </div>
        <div className={`mkd-q-score ${incorrect ? "is-bad" : ""}`}>
          <b>{state.score}</b>/{q.marks}
        </div>
        <div className="mkd-judge">
          <button className="mkd-set-point" title="Align to the question's set point"><Icon name="check" size={12} /> Set Point</button>
          <label><input type="radio" checked={correct}   onChange={() => onChange({ judgment: "correct",   score: q.marks })} /> Correct</label>
          <label><input type="radio" checked={incorrect} onChange={() => onChange({ judgment: "incorrect", score: 0 })} /> Incorrect</label>
          <div className="mkd-setpt">
            <input type="radio" checked={state.judgment === "custom"} onChange={() => onChange({ judgment: "custom", score: state.score || 0 })} /> Set Point
            <input type="number" className="mkd-setpt-input" value={state.score} min={0} max={q.marks}
              onChange={e => onChange({ judgment: "custom", score: Math.max(0, Math.min(q.marks, +e.target.value || 0)) })} />
            / {q.marks} mark
          </div>
          <button className="mkd-unset" onClick={() => onChange({ judgment: null, score: 0 })}>Unset</button>
        </div>
      </div>

      <div className="mkd-tools">
        <button title="Annotate"><Icon name="pencil" size={14} /></button>
        <button title="Text"><Icon name="type" size={14} /></button>
        <div className="mkd-tdiv"/>
        <button title="Undo"><Icon name="arrow-left" size={14} /></button>
        <button title="Redo"><Icon name="arrow-right" size={14} /></button>
        <div className="mkd-tdiv"/>
        <button title="Image"><Icon name="image" size={14} /></button>
        <button title="Color" className="mkd-color" style={{ background: "#E03131" }} />
        <button className="mkd-reset"><Icon name="rotate-ccw" size={13} /> reset</button>
      </div>

      <div className="mkd-prompt">{q.prompt}</div>

      {/* per-type rendering */}
      {q.type === "multi" && (
        <div className="mkd-answers">
          {q.options.map((opt, i) => {
            const wasPicked = q.studentIdx.includes(i);
            const shouldHave = q.correctIdx.includes(i);
            const marker = wasPicked ? (shouldHave ? "✓" : "✗") : (shouldHave ? "✓" : "");
            const cls = wasPicked
              ? (shouldHave ? "mkd-ans-correct" : "mkd-ans-wrong")
              : (shouldHave ? "mkd-ans-missed" : "");
            return (
              <div className={`mkd-ans ${cls}`} key={i}>
                <span className="mkd-ans-box">{wasPicked && <span className="mkd-ans-dot" />}</span>
                <span className="mkd-ans-label">Answer {i + 1}</span>
                <span className="mkd-ans-txt">— {opt}</span>
                {marker && <span className="mkd-ans-mark">{marker}</span>}
              </div>
            );
          })}
          {q.solution && <div className="mkd-solution"><Icon name="lightbulb" size={13}/><b>Solution Explanation</b><p>{q.solution}</p></div>}
        </div>
      )}
      {q.type === "one" && (
        <div className="mkd-answers">
          {q.options.map((opt, i) => {
            const wasPicked = q.studentIdx.includes(i);
            const shouldHave = q.correctIdx.includes(i);
            const cls = wasPicked ? (shouldHave ? "mkd-ans-correct" : "mkd-ans-wrong") : (shouldHave ? "mkd-ans-missed" : "");
            return (
              <div className={`mkd-ans ${cls}`} key={i}>
                <span className="mkd-ans-radio">{wasPicked && <span className="mkd-ans-radio-dot"/>}</span>
                <span className="mkd-ans-label">Answer {i + 1}</span>
                <span className="mkd-ans-txt">— {opt}</span>
              </div>
            );
          })}
        </div>
      )}
      {q.type === "short" && (
        <div className="mkd-short">
          <div className="mkd-short-ans">{q.studentText}</div>
          <div className="mkd-short-meta">1 mark · <span>Model: {q.modelAnswer}</span></div>
        </div>
      )}
      {q.type === "free" && (
        <div className="mkd-free">{q.studentText}</div>
      )}
      {q.type === "equation" && (
        <div className="mkd-equation">
          <pre>{q.studentText}</pre>
        </div>
      )}
      {q.type === "drawing" && (
        <div className="mkd-drawing">
          <div className="mkd-drawing-box">
            <div className="mkd-drawing-lbl">Teacher's sketch</div>
            <div className="mkd-drawing-pane" style={{ fontFamily: "'Patrick Hand', cursive", fontSize: 42, color: "#1a1a1a" }}>Teacher's</div>
          </div>
          <div className="mkd-drawing-box">
            <div className="mkd-drawing-lbl">Student's sketch</div>
            <div className="mkd-drawing-pane" style={{ fontFamily: "'Patrick Hand', cursive", fontSize: 42, color: "var(--color-revision-500)" }}>Student's</div>
          </div>
        </div>
      )}

      <div className="mkd-feedback">
        <label>Feedback <span>(optional)</span></label>
        <input placeholder="Type your comments here..." value={state.feedback}
               onChange={e => onChange({ feedback: e.target.value })} />
      </div>

      {state.judgment === null && (
        <div className="mkd-warn"><Icon name="alert-triangle" size={13}/> No point assigned. Please mark this item.</div>
      )}
    </div>
  );
}

function MkDetail({ exam, student, onBack }) {
  const [editor, setEditor] = mkUseState(true);
  const [states, setStates] = mkUseState(() => MK_DETAIL_QUESTIONS.map(q => ({
    judgment: q.correct === null ? null : q.correct ? "correct" : "incorrect",
    score: q.correct === null ? 0 : q.correct ? q.marks : 0,
    feedback: "",
  })));

  const total = MK_DETAIL_QUESTIONS.reduce((s, q) => s + q.marks, 0);
  const achieved = states.reduce((s, v) => s + (v.score || 0), 0);
  const unmarked = states.filter(s => s.judgment === null).length;

  const updateState = (i, patch) => setStates(arr => arr.map((v, j) => j === i ? { ...v, ...patch } : v));

  return (
    <div className="page mkd-page">
      <div className="mkd-top">
        <button className="mk-backlink" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <h1 className="mkd-top-title">{exam?.name || "Exam Name is Here"} / {student?.name || "Stefan Park"}</h1>
        <button className="mkd-hide-editor" onClick={() => setEditor(e => !e)}>
          <Icon name={editor ? "eye-off" : "eye"} size={14} /> {editor ? "Hide Editor" : "Show Editor"}
        </button>
      </div>

      <div className="mkd-sheet">
        <div className="mkd-score-banner">
          <span>Score {achieved}/{total}</span>
          {unmarked > 0 && <span className="mkd-unmarked-pill">{unmarked} item{unmarked === 1 ? "" : "s"} unmarked</span>}
        </div>

        {MK_DETAIL_QUESTIONS.map((q, i) => editor || states[i].judgment !== null ? (
          <MkDetailQuestion key={q.id} q={q} idx={i} state={states[i]} onChange={(p) => updateState(i, p)} />
        ) : null)}
      </div>

      <button className="mkd-save">
        <Icon name="save" size={14}/> Save Marking
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  Entry wrapper
// ─────────────────────────────────────────────────
function Marking({ onNav }) {
  useLucide();
  const [view, setView] = mkUseState("list");
  const [exam, setExam] = mkUseState(null);
  const [student, setStudent] = mkUseState(null);

  mkUseEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  if (view === "detail") return <MkDetail exam={exam} student={student} onBack={() => setView("subs")} />;
  if (view === "subs")   return <MkSubmissions exam={exam} onBack={() => setView("list")} onOpenDetail={(s) => { setStudent(s); setView("detail"); }} />;
  return <MkExamList onOpenExam={(r) => { setExam(r); setView("subs"); }} />;
}

Object.assign(window, { Marking });
