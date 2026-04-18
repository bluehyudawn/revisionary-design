// My Exams — polished list view
// based on /my-exam/myPage-list figma frames, elevated with:
//   • stat strip (open / scheduled / closed / graded counts)
//   • segmented status tabs
//   • subject & year filters + sort + search + pager
//   • hover-reveal action menu on each row
//   • empty state when filters return 0

const { useState: mxUseState, useMemo: mxUseMemo, useRef: mxUseRef, useEffect: mxUseEffect } = React;

const MX_ROWS = [
  { subj: "Accounting(U3&4)",    year: "Y11", name: "Mid-year practice exam", qs: 18, marks: 80,  state: "open",      range: "3 Jul ~ 31 Jul",  created: "2024-07-05" },
  { subj: "Accounting(U3&4)",    year: "Y12", name: "Unit 3 — Financial records", qs: 22, marks: 90,  state: "open",      range: "12 Aug ~ 20 Aug", created: "2024-07-08" },
  { subj: "Business Management", year: "Y11", name: "Case study — Ethics & HRM",  qs: 15, marks: 80,  state: "scheduled", range: "3 Aug ~ 31 Aug",  created: "2024-07-12" },
  { subj: "EAL",                 year: "Y11", name: "Comprehension test A",       qs: 12, marks: 60,  state: "scheduled", range: "8 Aug ~ 15 Aug",  created: "2024-07-14" },
  { subj: "EAL",                 year: "Y11", name: "Text response — short answer",qs: 10, marks: 50, state: "closed",    range: "3 Jul ~ 10 Jul",  created: "2024-06-28" },
  { subj: "EAL",                 year: "Y12", name: "Analytical commentary",      qs: 14, marks: 70,  state: "closed",    range: "15 Jun ~ 22 Jun", created: "2024-06-12" },
  { subj: "Geography(U3&4)",     year: "Y11", name: "Land cover change — NEA",    qs: 20, marks: 100, state: "graded",    range: "3 Jul ~ 31 Jul",  created: "2024-05-31" },
  { subj: "Geography(U3&4)",     year: "Y12", name: "Fieldwork investigation",    qs: 16, marks: 80,  state: "graded",    range: "3 Jul ~ 31 Jul",  created: "2024-05-24" },
  { subj: "Psychology",          year: "Y11", name: "Research methods check-in",  qs: 18, marks: 80,  state: "graded",    range: "6 Jun ~ 14 Jun", created: "2024-05-18" },
  { subj: "Psychology",          year: "Y12", name: "Unit 4 — Consciousness",     qs: 24, marks: 100, state: "graded",    range: "2 Jun ~ 10 Jun", created: "2024-05-12" },
  { subj: "Further Mathematics", year: "Y11", name: "Matrices topic test",        qs: 15, marks: 60,  state: "graded",    range: "14 May ~ 20 May", created: "2024-05-04" },
  { subj: "Further Mathematics", year: "Y12", name: "Data analysis — SACs",       qs: 20, marks: 80,  state: "graded",    range: "10 May ~ 17 May", created: "2024-05-01" },
];

const MX_STATUS_TABS = [
  { id: "all",       label: "All",       match: () => true },
  { id: "open",      label: "Open",      match: (r) => r.state === "open" },
  { id: "scheduled", label: "Scheduled", match: (r) => r.state === "scheduled" },
  { id: "closed",    label: "Closed",    match: (r) => r.state === "closed" },
  { id: "graded",    label: "Graded",    match: (r) => r.state === "graded" },
];

function MxKebab({ onView, onDuplicate, onExport, onDelete }) {
  const [open, setOpen] = mxUseState(false);
  const ref = mxUseRef(null);
  mxUseEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="mx-kebab" ref={ref}>
      <button className="mx-row-btn" onClick={() => setOpen(o => !o)} title="More"><Icon name="more-horizontal" size={16} /></button>
      {open && (
        <div className="mx-kebab-menu">
          <button onClick={() => { setOpen(false); onView?.(); }}><Icon name="eye" size={14} /> View</button>
          <button onClick={() => { setOpen(false); onDuplicate?.(); }}><Icon name="copy" size={14} /> Duplicate</button>
          <button onClick={() => { setOpen(false); onExport?.(); }}><Icon name="download" size={14} /> Export PDF</button>
          <div className="mx-kebab-sep" />
          <button className="is-danger" onClick={() => { setOpen(false); onDelete?.(); }}><Icon name="trash-2" size={14} /> Delete</button>
        </div>
      )}
    </div>
  );
}

function MyExams({ onNav }) {
  useLucide();
  const [q, setQ] = mxUseState("");
  const [status, setStatus] = mxUseState("all");
  const [subj, setSubj] = mxUseState("all");
  const [year, setYear] = mxUseState("all");
  const [sort, setSort] = mxUseState("created-desc");
  const [page, setPage] = mxUseState(1);

  const PAGE_SIZE = 8;

  const subjects = mxUseMemo(() => ["all", ...Array.from(new Set(MX_ROWS.map(r => r.subj)))], []);
  const years = ["all", "Y11", "Y12"];

  const counts = mxUseMemo(() => {
    const c = { all: MX_ROWS.length, open: 0, scheduled: 0, closed: 0, graded: 0 };
    MX_ROWS.forEach(r => { c[r.state]++; });
    return c;
  }, []);

  const filtered = mxUseMemo(() => {
    const s = q.trim().toLowerCase();
    let out = MX_ROWS.filter(r => {
      if (status !== "all" && r.state !== status) return false;
      if (subj !== "all" && r.subj !== subj) return false;
      if (year !== "all" && r.year !== year) return false;
      if (s && !(r.subj + " " + r.name).toLowerCase().includes(s)) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "created-desc") return b.created.localeCompare(a.created);
      if (sort === "created-asc")  return a.created.localeCompare(b.created);
      if (sort === "name-asc")     return a.name.localeCompare(b.name);
      if (sort === "name-desc")    return b.name.localeCompare(a.name);
      return 0;
    });
    return out;
  }, [q, status, subj, year, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  mxUseEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setQ(""); setStatus("all"); setSubj("all"); setYear("all"); };
  const hasFilters = q || status !== "all" || subj !== "all" || year !== "all";

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="page mx-page">
      {/* ── Heading + primary action ─────────────── */}
      <div className="mx-head">
        <div>
          <div className="mx-eyebrow">Exam</div>
          <h1 className="mx-title">My Exams<span className="mx-count">({MX_ROWS.length})</span></h1>
          <p className="mx-sub">Every exam you've authored — review, re-open, duplicate, or export.</p>
        </div>
        <button className="mx-new" onClick={() => onNav?.("creation")}>
          <Icon name="plus" size={14} /> Create Exam
        </button>
      </div>

      {/* ── Segmented status filter ──────────────── */}
      <div className="mx-seg">
        {MX_STATUS_TABS.map(t => (
          <button
            key={t.id}
            className={`mx-seg-btn ${status === t.id ? "is-active" : ""}`}
            onClick={() => { setStatus(t.id); setPage(1); }}
          >
            {t.label}
            <span className="mx-seg-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* ── Tool row ─────────────────────────────── */}
      <div className="mx-toolbar2">
        <div className="search-inline-input mx-search">
          <Icon name="search" size={16} />
          <input placeholder="Search exam name or subject..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          {q && <button className="mx-clear" onClick={() => setQ("")} aria-label="Clear"><Icon name="x" size={14} /></button>}
        </div>

        <div className="mx-tool-group">
          <MxSelect value={subj} onChange={(v) => { setSubj(v); setPage(1); }}
            options={subjects.map(s => ({ value: s, label: s === "all" ? "All Subjects" : s }))} icon="book-open" />
          <MxSelect value={year} onChange={(v) => { setYear(v); setPage(1); }}
            options={years.map(y => ({ value: y, label: y === "all" ? "All Years" : y }))} icon="calendar" />
          <MxSelect value={sort} onChange={setSort}
            options={[
              { value: "created-desc", label: "Newest first" },
              { value: "created-asc",  label: "Oldest first" },
              { value: "name-asc",     label: "Name A → Z" },
              { value: "name-desc",    label: "Name Z → A" },
            ]} icon="arrow-up-down" />
          {hasFilters && <button className="mx-clear-all" onClick={clearFilters}><Icon name="x" size={13} /> Clear</button>}
        </div>
      </div>

      {/* ── Table / empty state ──────────────────── */}
      <div className="mx-card">
        {pageRows.length === 0 ? (
          <div className="mx-empty">
            <div className="mx-empty-ic"><Icon name="inbox" size={28} /></div>
            <h3>No exams match your filters</h3>
            <p>Try a different status, search term, or clear the filters.</p>
            {hasFilters && <button className="mx-empty-btn" onClick={clearFilters}>Clear filters</button>}
          </div>
        ) : (
          <table className="mx-table">
            <thead>
              <tr>
                <th className="mx-th-subj">Subject</th>
                <th>Year</th>
                <th>Exam Name</th>
                <th className="mx-num">Qs</th>
                <th className="mx-num">Marks</th>
                <th>Status</th>
                <th>Date Range</th>
                <th>
                  <button className="mx-sort-th" onClick={() => setSort(sort === "created-desc" ? "created-asc" : "created-desc")}>
                    Created <Icon name={sort === "created-asc" ? "arrow-up" : "arrow-down"} size={12} />
                  </button>
                </th>
                <th className="mx-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="mx-subj-cell">
                      <SubjectIconTile subject={r.subj} size={32} />
                      <b>{r.subj}</b>
                    </span>
                  </td>
                  <td><span className="mx-year-pill">{r.year}</span></td>
                  <td className="mx-name-cell">{r.name}</td>
                  <td className="mx-num">{r.qs}</td>
                  <td className="mx-num"><b>{r.marks}</b></td>
                  <td><StatusChip status={r.state} /></td>
                  <td className="mx-range">{r.range}</td>
                  <td className="mx-created">{fmtDate(r.created)}</td>
                  <td>
                    <div className="mx-actions">
                      <button className="mx-row-btn" title="View"><Icon name="eye" size={16} /></button>
                      <button className="mx-row-btn" title="Edit"><Icon name="pencil" size={15} /></button>
                      <MxKebab
                        onView={() => alert("View " + r.name)}
                        onDuplicate={() => alert("Duplicate " + r.name)}
                        onExport={() => alert("Export " + r.name)}
                        onDelete={() => alert("Delete " + r.name)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Footer pager ──────────────────────── */}
        {pageRows.length > 0 && (
          <div className="mx-foot">
            <div className="mx-foot-count">
              Showing <b>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</b> of <b>{filtered.length}</b>
            </div>
            <div className="mx-foot-pager">
              <button className="mx-pg" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <Icon name="chevron-left" size={14} /> Previous
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  className={`mx-pg-num ${page === i + 1 ? "is-active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button className="mx-pg" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                Next <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MxSelect({ value, onChange, options, icon }) {
  const [open, setOpen] = mxUseState(false);
  const ref = mxUseRef(null);
  mxUseEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const current = options.find(o => o.value === value) || options[0];
  return (
    <div className="mx-mselect" ref={ref}>
      <button className={`mx-mselect-btn ${open ? "is-open" : ""} ${value !== "all" && value !== "created-desc" ? "is-set" : ""}`} onClick={() => setOpen(o => !o)}>
        {icon && <Icon name={icon} size={14} />}
        <span>{current.label}</span>
        <Icon name="chevron-down" size={13} />
      </button>
      {open && (
        <div className="mx-mselect-menu">
          {options.map(o => (
            <button
              key={o.value}
              className={`mx-mselect-opt ${o.value === value ? "is-selected" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
              {o.value === value && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MyExams });
