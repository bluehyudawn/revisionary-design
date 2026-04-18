// App shell — sidebar nav (matches Figma dashboard frame)

const NAV = [
  { group: "Home", items: [
    { id: "dashboard", icon: "layout-grid", label: "Dashboard" },
  ]},
  { group: "School", items: [
    { id: "classroom", icon: "school", label: "Classroom" },
  ]},
  { group: "Exam", items: [
    { id: "creation", icon: "file-text", label: "Creation" },
    { id: "bank",     icon: "library",   label: "Question Bank" },
    { id: "marking",  icon: "check-square", label: "Marking" },
    { id: "myexams",  icon: "folder",    label: "My Exams" },
  ]},
  { group: "Account", items: [
    { id: "profile",  icon: "user",      label: "Profile" },
    { id: "instr",    icon: "info",      label: "Instructions" },
    { id: "settings", icon: "settings",  label: "Settings" },
  ]},
];

function Sidebar({ active = "dashboard", onNav }) {
  useLucide();
  return (
    <aside className="sidebar">
      <div className="brand-row"><BrandLockup size={32} /></div>

      {NAV.map(sec => (
        <div className="nav-section" key={sec.group}>
          <div className="nav-section-label">{sec.group}</div>
          {sec.items.map(it => (
            <div
              key={it.id}
              className={`nav-item ${active === it.id ? "is-active" : ""}`}
              onClick={() => onNav?.(it.id)}
            >
              <Icon name={it.icon} size={18} className="ic" />
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      ))}

      <div className="side-signout" onClick={() => onNav?.("login")}>
        <span>Sign Out</span>
        <Icon name="log-out" size={16} />
      </div>
    </aside>
  );
}

function TopBar({ onNav }) {
  useLucide();
  const { useState } = React;
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifs = [
    { id: 1, icon: "check-square", title: "3 submissions ready to mark",      meta: "2025 accounting test_test · 5m ago",   unread: true  },
    { id: 2, icon: "user-plus",    title: "Sakrast03 joined 2025_English",    meta: "Invitation accepted · 1h ago",        unread: true  },
    { id: 3, icon: "alert-circle", title: "Chem redox practice closes in 2h", meta: "Year 11 · Today 17:00",                unread: true  },
    { id: 4, icon: "mail",         title: "New message from Jennie Kim",      meta: "Re: Marking rubric · Yesterday",       unread: false },
    { id: 5, icon: "star",         title: "Biology unit 2 mock graded",       meta: "Average: 74% · Yesterday",             unread: false },
  ];
  return (
    <div className="topbar-app">
      <div className="notif-wrap">
        <button
          className={`icon-btn ${notifOpen ? "is-open" : ""}`}
          onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }}
        >
          <Icon name="bell" size={20} />
          <span className="notif-dot" />
        </button>
        {notifOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => setNotifOpen(false)} />
            <div className="notif-panel">
              <div className="notif-panel-head">
                <h3>Notifications</h3>
                <button className="notif-mark-all">Mark all read</button>
              </div>
              <div className="notif-list">
                {notifs.map((n) => (
                  <div key={n.id} className={`notif-item ${n.unread ? "is-unread" : ""}`}>
                    <div className="notif-ic"><Icon name={n.icon} size={16} /></div>
                    <div className="notif-body">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-meta">{n.meta}</div>
                    </div>
                    {n.unread && <span className="unread-dot" />}
                  </div>
                ))}
              </div>
              <div className="notif-panel-foot">
                <button onClick={() => { setNotifOpen(false); onNav?.("notif"); }}>View all notifications</button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="notif-wrap">
        <button
          className={`avatar-btn ${menuOpen ? "is-open" : ""}`}
          onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
        >
          <Icon name="user" size={20} />
        </button>
        {menuOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="user-menu">
              <div className="user-menu-head">
                <div className="user-menu-av"><Icon name="user" size={22} /></div>
                <div>
                  <div className="user-menu-name">Alex Lee</div>
                  <div className="user-menu-email">alex01@revisiononline.com.au</div>
                </div>
              </div>
              <div className="user-menu-list">
                <button onClick={() => { setMenuOpen(false); onNav?.("profile"); }}>
                  <Icon name="user" size={16} /> Profile
                </button>
                <button onClick={() => { setMenuOpen(false); onNav?.("settings"); }}>
                  <Icon name="settings" size={16} /> Settings
                </button>
                <button onClick={() => { setMenuOpen(false); onNav?.("instr"); }}>
                  <Icon name="info" size={16} /> Instructions
                </button>
                <div className="user-menu-divider" />
                <button onClick={() => { setMenuOpen(false); onNav?.("login"); }}>
                  <Icon name="log-out" size={16} /> Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar });
