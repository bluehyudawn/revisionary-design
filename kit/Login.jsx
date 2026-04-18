// Sign-in — matches Figma /Sign-In-Up/Sign_in frame

function PublicNav({ onLogin, onSignup }) {
  useLucide();
  return (
    <div className="public-nav">
      <div className="logo">
        <BrandLockup size={28} />
      </div>
      <nav>
        <a href="#">Score Calculator</a>
        <a href="#">VCE Schedule</a>
        <a href="#">Features</a>
        <a href="#">Contact</a>
      </nav>
      <div className="right">
        <button className="login-link" onClick={onLogin}>Login</button>
        <Button variant="primary" size="md" onClick={onSignup}>Sign Up - It's free</Button>
      </div>
    </div>
  );
}

function Login({ onSignIn }) {
  useLucide();
  const [remember, setRemember] = useState(false);
  return (
    <div>
      <PublicNav onLogin={onSignIn} onSignup={onSignIn} />
      <div className="signin-shell">
        <div className="signin-photo" aria-hidden="true"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="signin-form">
            <BrandMark size={60} />
            <h1 style={{ marginTop: 16 }}>Access Your Revision.</h1>

            <div className="field">
              <label>User Email</label>
              <input className="input-plain" placeholder="me@myemail.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input-plain" type="password" placeholder="Password" />
            </div>

            <div className="row">
              <div
                className={`check-box ${remember ? "is-checked" : ""}`}
                onClick={() => setRemember(!remember)}
              >{remember ? "✓" : ""}</div>
              Remember me
            </div>

            <Button variant="primary" size="lg" block onClick={onSignIn}>Sign in</Button>

            <div className="footnote">
              <div>Don't have an account? <b>Sign Up</b></div>
              <a href="#">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Login, PublicNav });
