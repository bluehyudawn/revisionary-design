/* ═════════════════════════════════════════════════════
   Profile — account details + Change Password modal
   Based on Figma /profile/profile and /profile/changePassword
   ═════════════════════════════════════════════════════ */
const { useState: pfUseState } = React;

function ProfileField({ label, placeholder, value, onChange, type = "text", suffix }) {
  return (
    <label className="pf-field">
      <span className="pf-label">{label}</span>
      <div className="pf-input-wrap">
        <input
          className="pf-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {suffix && <div className="pf-input-suffix">{suffix}</div>}
      </div>
    </label>
  );
}

function ProfileSelect({ label, value, onChange, options }) {
  return (
    <label className="pf-field">
      <span className="pf-label">{label}</span>
      <div className="pf-input-wrap">
        <select
          className="pf-input pf-select"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="pf-input-suffix"><Icon name="chevron-down" size={16} /></div>
      </div>
    </label>
  );
}

function ChangePasswordModal({ onClose }) {
  const [show, setShow] = pfUseState({ cur: false, neu: false, conf: false });

  return (
    <div className="pf-modal-scrim" onClick={onClose}>
      <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pf-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} />
        </button>
        <div className="pf-modal-head">
          <div className="pf-modal-ic"><Icon name="rectangle-ellipsis" size={20} /></div>
          <h2>Change Password</h2>
        </div>
        <p className="pf-modal-sub">
          Use a password at least 15 letters long, or at least<br/>
          8 characters long with both letters and numbers.
        </p>

        <div className="pf-modal-fields">
          {[
            { k: "neu",  label: "New Password" },
            { k: "cur",  label: "Current Password" },
            { k: "conf", label: "Confirm New Password" },
          ].map(({ k, label }) => (
            <div className="pf-input-wrap pf-pw" key={k}>
              <input
                className="pf-input"
                type={show[k] ? "text" : "password"}
                placeholder={label}
              />
              <button
                className="pf-eye"
                onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))}
                aria-label="Toggle visibility"
              >
                <Icon name={show[k] ? "eye-off" : "eye"} size={16} />
              </button>
            </div>
          ))}
        </div>

        <button className="pf-btn-primary">Change Password</button>
        <button className="pf-btn-ghost">Delete</button>
      </div>
    </div>
  );
}

function Profile() {
  const [form, setForm] = pfUseState({
    first: "", middle: "", last: "",
    phone: "",
    address: "", postcode: "",
    state: "VIC",
    tz: "Australia/Melbourne (UTC+10:00)",
    school: "Revisiononline",
    klass: "", vcaa: "",
  });
  const [showPw, setShowPw] = pfUseState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="page pf-page">
      <div className="pf-card">
        <div className="pf-head">
          <div>
            <h1 className="pf-title">Profile</h1>
            <div className="pf-meta">
              <div className="pf-meta-block">
                <span className="pf-label">E-mail</span>
                <b>alex01@revisiononline.com.au</b>
              </div>
              <div className="pf-meta-block">
                <span className="pf-label">Role</span>
                <b>Teacher</b>
              </div>
            </div>
            <button className="pf-change-pw" onClick={() => setShowPw(true)}>Change Password</button>
          </div>

          <div className="pf-avatar">
            <div className="pf-avatar-circle">
              <Icon name="user" size={48} />
            </div>
            <button className="pf-avatar-edit" aria-label="Change picture">
              <Icon name="pencil" size={12} />
            </button>
          </div>
        </div>

        <div className="pf-grid pf-grid-3">
          <ProfileField label="First Name"            placeholder="First Name"  value={form.first}  onChange={set("first")} />
          <ProfileField label="Middle Name (Optional)" placeholder="Middle Name" value={form.middle} onChange={set("middle")} />
          <ProfileField label="Last Name"             placeholder="Last Name"   value={form.last}   onChange={set("last")} />
        </div>

        <div className="pf-grid pf-grid-1">
          <ProfileField label="Phone" placeholder="Phone Number" value={form.phone} onChange={set("phone")} />
        </div>

        <div className="pf-grid pf-grid-2-1">
          <ProfileField label="Address"  placeholder="Address"  value={form.address}  onChange={set("address")} />
          <ProfileField label="Postcode" placeholder="Postcode" value={form.postcode} onChange={set("postcode")} />
        </div>

        <div className="pf-grid pf-grid-2">
          <ProfileSelect
            label="State"
            value={form.state}
            onChange={set("state")}
            options={["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"]}
          />
          <ProfileSelect
            label="Local time Zone"
            value={form.tz}
            onChange={set("tz")}
            options={[
              "Australia/Melbourne (UTC+10:00)",
              "Australia/Sydney (UTC+10:00)",
              "Australia/Brisbane (UTC+10:00)",
              "Australia/Perth (UTC+08:00)",
              "Australia/Adelaide (UTC+09:30)",
            ]}
          />
        </div>

        <div className="pf-grid pf-grid-1">
          <ProfileSelect
            label="School"
            value={form.school}
            onChange={set("school")}
            options={["Revisiononline", "Melbourne High School", "Scotch College", "MLC"]}
          />
        </div>

        <div className="pf-grid pf-grid-2">
          <ProfileField label="Class"       placeholder="Class"       value={form.klass} onChange={set("klass")} />
          <ProfileField label="VCAA Number" placeholder="VCAA Number" value={form.vcaa}  onChange={set("vcaa")} />
        </div>

        <div className="pf-save-row">
          <button className="pf-save">Save Changes</button>
        </div>
      </div>

      {showPw && <ChangePasswordModal onClose={() => setShowPw(false)} />}
    </div>
  );
}

Object.assign(window, { Profile, ChangePasswordModal });
