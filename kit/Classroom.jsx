// Classroom — matches Figma /classroom/* frames

/* ═════════════════════════════════════════════════════
   Card — grid view (matches Figma Property1Default31 / Property1User)
   ═════════════════════════════════════════════════════ */
function ClassCard({ title = "2025 accounting test_test", by = "Alex Lee",
                    hasAvatar = true, subject = "Accounting(U3&4)", year = "11", students = "4",
                    canDelete = true, onOpen, onDelete }) {
  useLucide();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);
  return (
    <div className="class-card" onClick={onOpen}>
      <div className="head">
        <div className="av">
          {hasAvatar
            ? <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&q=80" alt="" />
            : <Icon name="user" size={18} />}
        </div>
        {canDelete && (
          <div className="more-wrap" ref={ref}>
            <button
              className={`more-btn ${menuOpen ? "is-open" : ""}`}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              aria-label="More"
            >
              <Icon name="more-horizontal" size={20} />
            </button>
            {menuOpen && (
              <div className="card-menu" onClick={(e) => e.stopPropagation()}>
                <button className="card-menu-item is-danger" onClick={() => { setMenuOpen(false); onDelete?.(); }}>
                  <Icon name="trash-2" size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="title-block">
        <h3>{title}</h3>
        <div className="by">Created By: {by}</div>
      </div>
      <div className="subj">
        <SubjectIconTile subject={subject} size={20} />
        {subject}
      </div>
      <div className="meta-row">
        <span className="meta-pill is-narrow">Year: {year}</span>
        <span className="meta-pill">Student Number: {students}</span>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Row — list view (designed to match grid-card tokens)
   ═════════════════════════════════════════════════════ */
function ClassRow({ title = "2025 accounting test_test", by = "Alex Lee",
                   hasAvatar = true, subject = "Accounting(U3&4)", year = "11", students = "4",
                   onOpen }) {
  useLucide();
  return (
    <div className="class-row" onClick={onOpen}>
      <div className="av">
        {hasAvatar
          ? <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&q=80" alt="" />
          : <Icon name="user" size={18} />}
      </div>
      <div className="title-cell">
        <div className="title">{title}</div>
        <div className="by">Created By: {by}</div>
      </div>
      <div className="subj-cell">
        <SubjectIconTile subject={subject} size={20} />
        {subject}
      </div>
      <div className="meta-cell">Year: <b>{year}</b></div>
      <div className="meta-cell">Students: <b>{students}</b></div>
      <button className="more-btn" onClick={(e) => { e.stopPropagation(); }}>
        <Icon name="more-horizontal" size={20} />
      </button>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Student List (bottom table — class management page)
   ═════════════════════════════════════════════════════ */
function StudentListCard({ onAddStudent, onToast }) {
  useLucide();
  const initialRows = Array.from({ length: 12 }).map((_, i) => ({
    id: 224 + i, email: `sakrast${String(i + 1).padStart(2, "0")}@revisiononline.com.au`,
    status: i < 3 ? "Not yet" : "Done",
  }));
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState(new Set([0, 1, 2]));
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null); // null | 'delete' | 'invite'

  const filtered = rows
    .map((r, idx) => ({ r, idx }))
    .filter(({ r }) => r.email.toLowerCase().includes(search.toLowerCase()));

  const allChecked = filtered.length > 0 && filtered.every(({ idx }) => selected.has(idx));
  const someChecked = filtered.some(({ idx }) => selected.has(idx));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) filtered.forEach(({ idx }) => next.delete(idx));
    else filtered.forEach(({ idx }) => next.add(idx));
    setSelected(next);
  };
  const toggle = (i) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const doDelete = () => {
    const count = selected.size;
    setRows(rows.filter((_, i) => !selected.has(i)));
    setSelected(new Set());
    setConfirm(null);
    onToast?.(`${count} student${count > 1 ? "s" : ""} deleted`);
  };
  const doInvite = () => {
    const count = selected.size;
    setRows(rows.map((r, i) => selected.has(i) ? { ...r, status: "Done" } : r));
    setSelected(new Set());
    setConfirm(null);
    onToast?.(`Invites sent to ${count} student${count > 1 ? "s" : ""}`);
  };

  return (
    <div className="student-card">
      <div className="student-toolbar">
        <div className="search-inline-input">
          <Icon name="search" size={14} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <Icon name="x" size={12} />
            </button>
          )}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-stone-600)" }}>
          <button className="more-btn"><Icon name="chevron-left" size={16} /></button>
          1 / 20
          <button className="more-btn"><Icon name="chevron-right" size={16} /></button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <table className="table-clean">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <div
                    className={`check-box ${allChecked ? "is-checked" : someChecked ? "is-indeterminate" : ""}`}
                    onClick={toggleAll}
                    title={allChecked ? "Deselect all" : "Select all"}
                  >
                    {allChecked ? "✓" : someChecked ? "−" : ""}
                  </div>
                </th>
                <th style={{ width: 80 }}>ID</th>
                <th>E-mail</th>
                <th style={{ width: 120 }}>Register</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "40px 0", textAlign: "center", color: "var(--color-stone-500)", fontSize: 14 }}>
                  {rows.length === 0 ? "No students — add students to get started" : "No students match your search"}
                </td></tr>
              ) : filtered.map(({ r, idx: i }) => (
                <tr key={i} className={selected.has(i) ? "is-selected" : ""}>
                  <td>
                    <div
                      className={`check-box ${selected.has(i) ? "is-checked" : ""}`}
                      onClick={() => toggle(i)}
                    >{selected.has(i) ? "✓" : ""}</div>
                  </td>
                  <td>{r.id}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {r.email}
                      {r.status === "Not yet" && <Icon name="edit-2" size={12} style={{ color: "var(--color-stone-400)" }}/>}
                    </span>
                  </td>
                  <td style={{ color: r.status === "Done" ? "var(--color-stone-900)" : "var(--color-stone-500)" }}>
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ width: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 }}>
          <div style={{ alignSelf: "center", marginBottom: 20 }}>
            <img src="assets/mail-subscribe.png" alt="" style={{ width: 180, height: "auto", display: "block" }} />
          </div>
          <Button
            variant="dark" size="md" iconLeft="mail" block
            disabled={selected.size === 0}
            onClick={() => setConfirm("invite")}
          >
            Invite{selected.size > 0 ? ` (${selected.size})` : ""}
          </Button>
          <Button
            variant="secondary" size="md" iconLeft="trash-2" block
            disabled={selected.size === 0}
            onClick={() => setConfirm("delete")}
          >
            Delete{selected.size > 0 ? ` (${selected.size})` : ""}
          </Button>
        </div>
      </div>

      {confirm === "delete" && (
        <ConfirmDialog
          title={`Delete ${selected.size} student${selected.size > 1 ? "s" : ""}?`}
          message="The selected students will be removed from this list. This cannot be undone."
          confirmText="Delete"
          danger
          onConfirm={doDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === "invite" && (
        <ConfirmDialog
          title={`Send invites to ${selected.size} student${selected.size > 1 ? "s" : ""}?`}
          message="They'll receive an email with a sign-up link to join RevisionOnline."
          confirmText="Send invites"
          onConfirm={doInvite}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Student row (inside class-detail panel)
   ═════════════════════════════════════════════════════ */
function StudentRow({ year = "Y11", email = "alex02@revisiononline.com.au",
                     status = null, action = null, onClick }) {
  const yr = year?.toLowerCase() === "y11" ? "y11" : year?.toLowerCase() === "y12" ? "y12" : "na";
  return (
    <div className="student-row">
      <span className={`year-chip ${yr}`}>{year}</span>
      <span className="email">{email}</span>
      {status && <span className="status-text">{status}</span>}
      {action === "plus" && <button className="plus-btn" onClick={onClick}><Icon name="plus" size={14} /></button>}
      {action === "x" && <button className="x-btn" onClick={onClick}><Icon name="x" size={14} /></button>}
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Class Detail Modal (Add / My Class / Read-only class)
   ═════════════════════════════════════════════════════ */
function ClassDetailModal({ mode = "edit", onClose, onAddEmail, onDone }) {
  // mode: "add" | "edit" (My Class) | "readonly" (other teacher's)
  const readonly = mode === "readonly";
  const isAdd = mode === "add";
  useLucide();

  const initialAvailable = [
    { id: "a0", email: "alex02@revisiononline.com.au", year: "Y11", status: null },
    { id: "a1", email: "bella03@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "a2", email: "chris05@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "a3", email: "daniel07@revisiononline.com.au", year: "N/A", status: "Pending..." },
    { id: "a4", email: "emma09@revisiononline.com.au", year: "N/A", status: "Pending..." },
    { id: "a5", email: "finn11@revisiononline.com.au", year: "Y11", status: null },
    { id: "a6", email: "grace13@revisiononline.com.au", year: "Y12", status: null },
    { id: "a7", email: "henry15@revisiononline.com.au", year: "Y11", status: null },
    { id: "a8", email: "ivy17@revisiononline.com.au", year: "Y12", status: null },
    { id: "a9", email: "jack19@revisiononline.com.au", year: "Y11", status: null },
    { id: "a10", email: "kate21@revisiononline.com.au", year: "Y11", status: null },
    { id: "a11", email: "leo23@revisiononline.com.au", year: "Y11", status: null },
  ];
  const initialRegisteredReadonly = [
    { id: "r0", email: "maya01@revisiononline.com.au", year: "Y12", status: null },
    { id: "r1", email: "noah02@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "r2", email: "olivia03@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "r3", email: "peter04@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "r4", email: "quinn05@revisiononline.com.au", year: "N/A", status: "Invite" },
    { id: "r5", email: "ruth06@revisiononline.com.au", year: "N/A", status: "Pending..." },
    { id: "r6", email: "sam07@revisiononline.com.au", year: "N/A", status: "Pending..." },
    { id: "r7", email: "tina08@revisiononline.com.au", year: "Y12", status: null },
    { id: "r8", email: "ulysses09@revisiononline.com.au", year: "Y12", status: null },
    { id: "r9", email: "vera10@revisiononline.com.au", year: "Y11", status: null },
    { id: "r10", email: "will11@revisiononline.com.au", year: "Y11", status: null },
    { id: "r11", email: "xena12@revisiononline.com.au", year: "Y11", status: null },
  ];
  const [available, setAvailable] = useState(initialAvailable);
  const [registered, setRegistered] = useState(readonly ? initialRegisteredReadonly : []);
  const [searchReg, setSearchReg] = useState("");
  const [searchAvail, setSearchAvail] = useState("");
  const [className, setClassName] = useState(isAdd ? "" : "2025_English");
  const [yearSel, setYearSel] = useState("Year 11");
  const [subjectSel, setSubjectSel] = useState("Foundation Mathematics U3&4");

  const moveToRegistered = (id) => {
    const s = available.find((x) => x.id === id);
    if (!s) return;
    setAvailable(available.filter((x) => x.id !== id));
    setRegistered([s, ...registered]);
  };
  const moveToAvailable = (id) => {
    const s = registered.find((x) => x.id === id);
    if (!s) return;
    setRegistered(registered.filter((x) => x.id !== id));
    setAvailable([s, ...available]);
  };

  const filteredReg = registered.filter((s) => s.email.toLowerCase().includes(searchReg.toLowerCase()));
  const filteredAvail = available.filter((s) => s.email.toLowerCase().includes(searchAvail.toLowerCase()));

  const title = isAdd ? "Add New Class" : readonly ? "Chris kim's Class" : "My Class";
  const saveLabel = isAdd ? "Create Class" : "Save Changes";

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>

        <div className="modal-title-row">
          <div className="av">
            {isAdd
              ? <Icon name="plus" size={24} />
              : readonly
                ? <Icon name="user" size={24} />
                : <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&q=80" alt="" />}
          </div>
          <h2>{title}</h2>
        </div>

        <div className="field-triple">
          <div className="fld">
            <label>Year</label>
            {readonly
              ? <div className="fake-input select is-readonly">{yearSel} <Icon name="chevron-down" size={16} style={{ color: "var(--color-stone-400)" }} /></div>
              : <div className="fake-input select">{yearSel} <Icon name="chevron-down" size={16} style={{ color: "var(--color-stone-400)" }} /></div>
            }
          </div>
          <div className="fld">
            <label>Subject</label>
            {readonly
              ? <div className="fake-input select is-readonly">{subjectSel} <Icon name="chevron-down" size={16} style={{ color: "var(--color-stone-400)" }} /></div>
              : <div className="fake-input select">{subjectSel} <Icon name="chevron-down" size={16} style={{ color: "var(--color-stone-400)" }} /></div>
            }
          </div>
          <div className="fld">
            <label>Class Name</label>
            <div className="fake-input">
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={isAdd ? "e.g. 2025_Physics" : ""}
                readOnly={readonly}
              />
            </div>
          </div>
        </div>

        <div className="student-split">
          {/* Registered */}
          <div className="student-panel">
            <div className="student-panel-head">
              <h3>Registered Students {registered.length > 0 && <span className="count-badge">{registered.length}</span>}</h3>
            </div>
            <div className="search-inline-lg">
              <Icon name="search" size={16} />
              <input
                placeholder="Search students..."
                value={searchReg}
                onChange={(e) => setSearchReg(e.target.value)}
              />
              {searchReg && (
                <button className="search-clear" onClick={() => setSearchReg("")}>
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
            <div className="student-list">
              {filteredReg.length === 0
                ? <div className="student-row is-empty">
                    {registered.length === 0
                      ? (isAdd ? "No students yet — add from the right →" : "No students registered")
                      : "No students match your search"}
                  </div>
                : filteredReg.map((s) => (
                    <StudentRow
                      key={s.id}
                      email={s.email}
                      year={s.year}
                      status={s.status}
                      action={readonly ? null : "x"}
                      onClick={() => moveToAvailable(s.id)}
                    />
                  ))}
            </div>
            <div className="panel-pager">
              <button disabled><Icon name="chevron-left" size={12} /> Previous</button>
              <button className="is-active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>Next <Icon name="chevron-right" size={12} /></button>
            </div>
          </div>

          {/* Available */}
          <div className="student-panel">
            <div className="student-panel-head">
              <h3>Available Students {available.length > 0 && <span className="count-badge">{available.length}</span>}</h3>
              {!readonly && <Button variant="dark" size="sm" iconLeft="plus" onClick={onAddEmail}>Add Email</Button>}
            </div>
            <div className="search-inline-lg">
              <Icon name="search" size={16} />
              <input
                placeholder="Search students..."
                value={searchAvail}
                onChange={(e) => setSearchAvail(e.target.value)}
              />
              {searchAvail && (
                <button className="search-clear" onClick={() => setSearchAvail("")}>
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
            <div className="student-list">
              {filteredAvail.length === 0
                ? <div className="student-row is-empty">No students match your search</div>
                : filteredAvail.map((s) => (
                    <StudentRow
                      key={s.id}
                      email={s.email}
                      year={s.year}
                      status={s.status}
                      action={readonly ? null : "plus"}
                      onClick={() => moveToRegistered(s.id)}
                    />
                  ))}
            </div>
            <div className="panel-pager">
              <button disabled><Icon name="chevron-left" size={12} /> Previous</button>
              <button className="is-active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>Next <Icon name="chevron-right" size={12} /></button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="legend">
            <span className="legend-item"><span className="year-chip y11">Y11</span><span className="year-chip y12">Y12</span>Fully registered</span>
            <span className="legend-item"><span className="year-chip na">N/A</span>Registration not yet completed</span>
          </div>
          {readonly
            ? <div style={{ color: "var(--color-stone-600)", fontSize: 14, fontWeight: 500 }}>You can only edit classes you created</div>
            : <Button
                variant="primary" size="lg"
                disabled={isAdd && className.trim() === ""}
                onClick={() => onDone?.(isAdd ? `"${className}" created with ${registered.length} student${registered.length !== 1 ? "s" : ""}` : "Changes saved")}
              >{saveLabel}</Button>
          }
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Add Student Modal
   ═════════════════════════════════════════════════════ */
function AddStudentModal({ onClose }) {
  useLucide();
  const [mode, setMode] = useState("typing"); // "typing" | "csv"
  const [emails, setEmails] = useState(
    Array.from({ length: 12 }).map(() => "alex02@revisiononline.com.au")
  );
  const [draft, setDraft] = useState("");

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-sheet is-narrow" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--color-stone-900)", margin: "0 0 22px" }}>
          Add Student E-mail
        </h2>

        <div className="radio-group">
          <label className="radio-item" onClick={() => setMode("typing")}>
            <span className={`radio-dot ${mode === "typing" ? "is-checked" : ""}`}></span>
            Typing
          </label>
          <label className="radio-item" onClick={() => setMode("csv")}>
            <span className={`radio-dot ${mode === "csv" ? "is-checked" : ""}`}></span>
            CSV Upload <b style={{ marginLeft: 6, color: "var(--color-stone-900)", fontWeight: 700 }}>( sample.csv )</b>
          </label>
        </div>

        {mode === "typing" ? (
          <>
            <div className="email-add-row">
              <input
                placeholder="E-mail"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button
                variant="dark"
                size="md"
                iconLeft="plus"
                onClick={() => { if (draft.trim()) { setEmails([draft, ...emails]); setDraft(""); }}}
              >Add Email</Button>
            </div>

            <div className="email-list">
              {emails.map((e, i) => (
                <div className="row" key={i}>
                  <span>{e}</span>
                  <button
                    className="x-btn"
                    onClick={() => setEmails(emails.filter((_, idx) => idx !== i))}
                    style={{ background: "var(--color-stone-400)", color: "#fff",
                             border: "none", width: 26, height: 26, borderRadius: 99,
                             display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="upload-label">Upload CSV</div>
            <div className="upload-zone">
              <div className="icon-wrap"><Icon name="download" size={44} /></div>
              Drag and drop your file here, or <b>browse</b>
            </div>
          </>
        )}

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" size="lg" block>Submit All</Button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   Classroom main page
   ═════════════════════════════════════════════════════ */
function Classroom() {
  useLucide();
  const [year, setYear] = useState("11");
  const [view, setView] = useState("grid"); // grid | list
  const [modal, setModal] = useState(null);
  // modal: null | "edit" | "readonly" | "add" | "addStudent"
  const [deleteTarget, setDeleteTarget] = useState(null); // index in current classes
  const [toast, setToast] = useState(null);

  const classesY11 = [
    { by: "Alex Lee",   hasAvatar: true,  mode: "edit",     subject: "Accounting(U3&4)",     title: "2025 accounting test_test" },
    { by: "Jennie Kim", hasAvatar: false, mode: "readonly", subject: "Biology",              title: "Biology unit 2 mock" },
    { by: "Alex Lee",   hasAvatar: true,  mode: "edit",     subject: "Chemistry",            title: "Chem redox practice" },
    { by: "Jennie Kim", hasAvatar: false, mode: "readonly", subject: "Psychology",           title: "Psych research methods" },
    { by: "Jennie Kim", hasAvatar: false, mode: "readonly", subject: "Mathematical Methods", title: "Methods calculus trial" },
    { by: "Jennie Kim", hasAvatar: false, mode: "readonly", subject: "English",              title: "English essay mock" },
  ];
  const classesY12 = [
    { by: "Alex Lee",   hasAvatar: true,  mode: "edit",     subject: "Physics",              title: "2025 VCE Physics U3&4" },
    { by: "Alex Lee",   hasAvatar: true,  mode: "edit",     subject: "Specialist Mathematics", title: "Specialist exam 1 trial" },
    { by: "Sarah Choi", hasAvatar: false, mode: "readonly", subject: "Literature",           title: "Lit close reading" },
    { by: "Alex Lee",   hasAvatar: true,  mode: "edit",     subject: "Economics",            title: "Econ macro unit 4" },
    { by: "Sarah Choi", hasAvatar: false, mode: "readonly", subject: "Legal Studies",        title: "Legal Studies SAC 2" },
    { by: "Sarah Choi", hasAvatar: false, mode: "readonly", subject: "Business Management", title: "Biz Management exam prep" },
  ];
  const classes = year === "11" ? classesY11 : classesY12;

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="page">
      <div className="page-head page-head-classroom">
        <h1>Class Management</h1>
        <Button variant="primary" size="md" iconLeft="plus" onClick={() => setModal("add")}>Add Class</Button>
      </div>

      <div className="classroom-filterbar">
        <div className="tabs-underline">
          <button className={year === "11" ? "is-active" : ""} onClick={() => setYear("11")}>Year 11</button>
          <button className={year === "12" ? "is-active" : ""} onClick={() => setYear("12")}>Year 12</button>
        </div>
        <div className="classroom-filterbar-right">
          <button className="more-btn"><Icon name="chevron-left" size={16} /></button>
          <span style={{ fontSize: 13, color: "var(--color-stone-600)" }}>1 / 20</span>
          <button className="more-btn"><Icon name="chevron-right" size={16} /></button>
          <div className="view-toggle" style={{ marginLeft: 8 }}>
            <button
              className={view === "grid" ? "is-active" : ""}
              onClick={() => setView("grid")}
              title="Grid view"
            ><Icon name="layout-grid" size={14} /></button>
            <button
              className={view === "list" ? "is-active" : ""}
              onClick={() => setView("list")}
              title="List view"
            ><Icon name="list" size={14} /></button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="class-grid" style={{ marginTop: 24 }}>
          {classes.map((c, i) => (
            <ClassCard
              key={`${year}-${i}`}
              {...c}
              canDelete={c.mode === "edit"}
              onOpen={() => setModal(c.mode)}
              onDelete={() => setDeleteTarget(i)}
            />
          ))}
        </div>
      ) : (
        <div className="class-list" style={{ marginTop: 24 }}>
          {classes.map((c, i) => (
            <ClassRow
              key={`${year}-${i}`}
              {...c}
              canDelete={c.mode === "edit"}
              onOpen={() => setModal(c.mode)}
              onDelete={() => setDeleteTarget(i)}
            />
          ))}
        </div>
      )}

      <div className="section-head-row" style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>Student List</h2>
        <Button variant="primary" size="md" iconLeft="plus" onClick={() => setModal("addStudent")}>Add Student</Button>
      </div>
      <StudentListCard onAddStudent={() => setModal("addStudent")} onToast={flashToast} />

      {modal === "add" && <ClassDetailModal mode="add" onClose={() => setModal(null)} onAddEmail={() => setModal("addStudent")} onDone={(msg) => { setModal(null); flashToast(msg); }} />}
      {modal === "edit" && <ClassDetailModal mode="edit" onClose={() => setModal(null)} onAddEmail={() => setModal("addStudent")} onDone={(msg) => { setModal(null); flashToast(msg); }} />}
      {modal === "readonly" && <ClassDetailModal mode="readonly" onClose={() => setModal(null)} onAddEmail={() => setModal("addStudent")} />}
      {modal === "addStudent" && <AddStudentModal onClose={() => setModal(null)} onDone={(msg) => { setModal(null); flashToast(msg); }} />}

      {deleteTarget !== null && (
        <ConfirmDialog
          title="Delete class?"
          message={`"${classes[deleteTarget].title}" will be permanently removed. This cannot be undone.`}
          confirmText="Delete"
          danger
          onConfirm={() => { flashToast(`"${classes[deleteTarget].title}" deleted`); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   ConfirmDialog — small centered confirm
   ═════════════════════════════════════════════════════ */
function ConfirmDialog({ title, message, confirmText = "Confirm", danger = false, onConfirm, onCancel }) {
  useLucide();
  return (
    <div className="modal-scrim" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon ${danger ? "is-danger" : ""}`}>
          <Icon name={danger ? "trash-2" : "help-circle"} size={22} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} size="md" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Classroom });
