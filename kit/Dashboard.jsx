// Dashboard — matches Figma /dashboard/dashboard frame

function HeroBanner() {
  useLucide();
  return (
    <div className="hero-banner">
      <h2>
        New to RevisionaryOnline?<br/>
        Watch the quick tutorial – it only takes a few seconds! ✨
      </h2>
      <button className="hero-btn" onClick={() => alert("Playing tutorial…")}>See Tutorial</button>
    </div>
  );
}

function StatusRow({ onNav }) {
  useLucide();
  const cells = [
    { key: "marking",    label: "Marking Required Exam", val: 3,  badge: "New", tone: "violet",  action: () => onNav?.("marking") },
    { key: "inProgress", label: "In Progress",           val: 3,  tone: "blue",   action: () => onNav?.("myexams", { filter: "in-progress" }) },
    { key: "opens",      label: "Opens in Start",        val: 1,  tone: "amber",  action: () => onNav?.("myexams", { filter: "upcoming" }) },
    { key: "expired",    label: "No Longer Available",   val: 12, tone: "stone",  action: () => onNav?.("myexams", { filter: "expired" }) },
    { key: "all",        label: "All",                   val: 16, tone: "dark",   action: () => onNav?.("myexams") },
  ];
  return (
    <div className="status-row">
      {cells.map(c => (
        <button
          key={c.key}
          className={`status-cell is-clickable tone-${c.tone}`}
          onClick={c.action}
        >
          <div className="lbl">
            {c.label}
            <Icon name="arrow-up-right" size={14} />
          </div>
          <div className="val">
            {c.val}
            {c.badge && <span className="new">{c.badge}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

function ExamCard({ subject = "Accounting(U3&4) | Y11", note = "Test_naming lorem ipsum",
                   status = "open",
                   days = "18D", dates = "03/Jul/25 21:00 ~ 03/Jul/25 21:00",
                   reading = "1m", writing = "20m",
                   submitted = { v: 0, max: 1 }, marked = { v: 0, max: 0 },
                   email = "alex01@revisiononline.com.au",
                   progress = 0 }) {
  useLucide();
  return (
    <div className="exam-card">
      <div className="row">
        <SubjectIconTile subject={subject} size={36} />
        <StatusChip status={status} />
      </div>
      <div>
        <h3 className="exam-title">{subject}</h3>
        <p className="exam-sub">{note}</p>
      </div>
      <div className="exam-meta-days"><Icon name="clock" size={14} /> {days}</div>
      <div className="exam-dates">
        {dates}
        <div className="tz">AEST (UTC+10)</div>
      </div>
      <div className="exam-durations">
        <span><Icon name="hourglass" size={12} /> Reading <b>{reading}</b></span>
        <span><Icon name="pencil" size={12} /> Writing <b>{writing}</b></span>
      </div>
      <div className="exam-counts">
        <div>
          <Icon name="users" size={14} /> Submitted
          <b>{submitted.v}/{submitted.max}</b>
        </div>
        <div>
          <Icon name="check-circle" size={14} /> Marked
          <b>{marked.v}/{marked.max}</b>
        </div>
      </div>
      {progress > 0 && (
        <div className="progress-bar" style={{ height: 3, background: "var(--color-stone-100)", borderRadius: 99, overflow: "hidden", marginTop: -4 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--color-revision-500)" }} />
        </div>
      )}
      <div className="exam-email">{email}</div>
    </div>
  );
}

function Dashboard({ onNav }) {
  useLucide();
  return (
    <div className="page">
      <HeroBanner />

      <div className="page-head">
        <div>
          <div className="eyebrow">My Practice Exams</div>
          <h1>Good Afternoon, {"{name}"}</h1>
        </div>
        <Button variant="primary" size="md" iconLeft="plus" onClick={() => onNav?.("creation")}>Create Exam</Button>
      </div>

      <StatusRow onNav={onNav} />

      <div className="exam-grid" style={{ marginTop: 20 }}>
        <ExamCard status="open"      subject="Accounting(U3&4) | Y11" />
        <ExamCard status="closed"    subject="Psychology | Y11" note="Test_naming lorem ipsum" submitted={{v:1,max:1}} progress={100} />
        <ExamCard status="scheduled" subject="Further Mathematics | Y12" />
      </div>

      <button className="view-all" onClick={() => onNav?.("myexams")}>
        View All <Icon name="chevron-right" size={14} />
      </button>

      <div className="section-head-row" style={{ marginTop: 80 }}>
        <h2>All Practice Exams</h2>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--color-stone-200)", borderRadius: 8, fontSize: 13, color: "var(--color-stone-700)", background: "#fff" }}>
          All <Icon name="chevron-down" size={14} />
        </div>
      </div>
      <div className="exam-grid">
        <ExamCard status="open"      subject="Biology | Y11" />
        <ExamCard status="scheduled" subject="Chemistry | Y12" />
        <ExamCard status="open"      subject="Physics | Y12" />
        <ExamCard status="open"      subject="English | Y11" />
        <ExamCard status="open"      subject="Legal Studies | Y12" />
        <ExamCard status="scheduled" subject="Further Mathematics | Y12" />
      </div>

      <div className="pagination">
        <button><Icon name="chevron-left" size={14} /> Previous</button>
        <button className="is-active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>Next <Icon name="chevron-right" size={14} /></button>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, ExamCard, HeroBanner, StatusRow });
