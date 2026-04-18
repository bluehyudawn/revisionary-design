/* ═════════════════════════════════════════════════════
   Create Exam — 2-step flow
   Step 1: Add Exam Information  (figma /create-exam/default3)
   Step 2: Question Builder       (figma /create-exam/exam-default)
   ═════════════════════════════════════════════════════ */
const { useState: ceUseState } = React;

// ── Step 1 ───────────────────────────────────────────
function AddExamInformation({ onNext, onBack }) {
  const [form, setForm] = ceUseState({
    subject: "Not selected",
    klass: "Not selected",
    name: "",
    readingTime: "15",
    writingTime: "20",
    examType: "Written",
    bookType: "Question Book",
    instructions: "",
    about: "",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="ce-step">
      <div className="ce-step-head">
        <h1>Add Exam Information</h1>
        <span className="ce-step-sub">Fill in the exam details below.</span>
      </div>

      <div className="ce-folder-art" aria-hidden>
        <div className="ce-folder-dots"><span/><span/><span/></div>
        <div className="ce-folder"/>
      </div>

      <div className="ce-grid">
        {/* LEFT column */}
        <div className="ce-col">
          <ProfileSelect
            label="Subject" value={form.subject} onChange={set("subject")}
            options={["Not selected", "Accounting (U3&4)", "Business Management", "EAL", "Geography (U3&4)", "Psychology", "Further Mathematics"]}
          />
          <ProfileSelect
            label="Class (optional)" value={form.klass} onChange={set("klass")}
            options={["Not selected", "Year 11 · Period 1", "Year 11 · Period 3", "Year 12 · Period 2"]}
          />
          <ProfileField
            label="Exam Name" placeholder="Exam Name"
            value={form.name} onChange={set("name")}
          />
          <div className="ce-row-2">
            <ProfileSelect
              label="Reading Time (mins)" value={form.readingTime} onChange={set("readingTime")}
              options={["0", "5", "10", "15", "20", "30"]}
            />
            <ProfileField
              label="Writing Time (mins)" placeholder="20"
              value={form.writingTime} onChange={set("writingTime")}
            />
          </div>
          <div className="ce-row-2">
            <ProfileSelect
              label="Exam Type" value={form.examType} onChange={set("examType")}
              options={["Written", "Oral", "Performance"]}
            />
            <ProfileSelect
              label="Book Type" value={form.bookType} onChange={set("bookType")}
              options={["Question Book", "Answer Book", "Formula Sheet"]}
            />
          </div>

          <div className="ce-datasheet">
            <div className="ce-datasheet-head">
              <span className="pf-label">Datasheets (optional)</span>
              <button className="ce-upload-btn">
                <Icon name="plus" size={14} /> Upload
              </button>
            </div>
            <div className="ce-datasheet-empty">
              No official or exam-specific datasheets available.<br/>
              Please upload a datasheet or select a different subject.
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="ce-col">
          <div className="ce-editor-field">
            <label className="ce-editor-label">Instructions<span className="ce-optional">(optional)</span></label>
            <RichTextArea
              value={form.instructions}
              onChange={set("instructions")}
              minHeight={260}
              placeholder=""
            />
          </div>
          <div className="ce-editor-field">
            <label className="ce-editor-label">About<span className="ce-optional">(optional)</span></label>
            <RichTextArea
              value={form.about}
              onChange={set("about")}
              minHeight={180}
              placeholder=""
            />
          </div>
        </div>
      </div>

      <div className="ce-footer">
        <div className="ce-progress"><div className="ce-progress-fill" style={{ width: "50%" }}/></div>
        <button className="ce-next" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

// ── Shared: rich-text editor ─────────────────────────
function RichTextArea({ value, onChange, placeholder, minHeight = 180 }) {
  return (
    <div className="ce-rich">
      <div className="ce-rich-toolbar">
        <button className="ce-tbtn ce-tbtn-text"><span>16px</span><Icon name="chevron-down" size={11} /></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn" title="Font"><Icon name="a-large-small" size={14} /></button>
        <button className="ce-tbtn" title="Text"><Icon name="type" size={14} /></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn" title="Bold"><b>B</b></button>
        <button className="ce-tbtn" title="Italic"><i>I</i></button>
        <button className="ce-tbtn" title="Underline"><u>U</u></button>
        <button className="ce-tbtn" title="Strike"><s>S</s></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn" title="H1">H<sub>1</sub></button>
        <button className="ce-tbtn" title="H2">H<sub>2</sub></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn"><Icon name="list" size={14} /></button>
        <button className="ce-tbtn"><Icon name="list-ordered" size={14} /></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn"><Icon name="align-left" size={14} /></button>
        <button className="ce-tbtn"><Icon name="align-center" size={14} /></button>
        <button className="ce-tbtn"><Icon name="align-right" size={14} /></button>
        <button className="ce-tbtn"><Icon name="align-justify" size={14} /></button>
        <div className="ce-tdiv"/>
        <button className="ce-tbtn"><Icon name="table" size={14} /></button>
      </div>
      <textarea
        className="ce-rich-area"
        style={{ minHeight }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ── Step 2 ───────────────────────────────────────────
function QuestionBuilder({ onBack, onPreview }) {
  const [tab, setTab] = ceUseState("qbank");   // qbank | datasheet | history
  const [group, setGroup] = ceUseState("Group"); // Group | Practice Exam | Favorites
  const items = Array.from({ length: 11 }).map((_, i) => ({
    code: "AC34",
    name: i === 2 ? "All Exam collenction test namingExam collenction test naming" : "All Exam collenction test naming",
  }));

  return (
    <div className="qb-wrap">
      <div className="qb-topbar">
        <span className="qb-lang">English</span>
        <span className="qb-questions-count">Questions(0)</span>
      </div>

      <div className="qb-grid">
        {/* LEFT — Question Bank */}
        <div className="qb-left">
          <div className="qb-tabs">
            <button className={`qb-tab ${tab === "qbank" ? "is-active" : ""}`} onClick={() => setTab("qbank")}>
              <Icon name="monitor" size={16} /> Question Bank
            </button>
            <button className={`qb-tab ${tab === "datasheet" ? "is-active" : ""}`} onClick={() => setTab("datasheet")}>
              <Icon name="database" size={16} /> Data Sheet
            </button>
            <button className={`qb-tab ${tab === "history" ? "is-active" : ""}`} onClick={() => setTab("history")}>
              <Icon name="history" size={16} /> History
            </button>
            <button className="qb-layout-btn" title="Layout"><Icon name="layout-panel-left" size={16} /></button>
          </div>

          <div className="qb-subtabs">
            {["Group", "Practice Exam", "Favorites"].map((g) => (
              <button key={g} className={`qb-subtab ${group === g ? "is-active" : ""}`} onClick={() => setGroup(g)}>
                {g}
              </button>
            ))}
          </div>

          <div className="qb-list">
            {items.map((it, i) => (
              <div className="qb-item" key={i}>
                <div className="qb-item-ic"><Icon name="folder" size={16} /></div>
                <div className="qb-item-code">{it.code}</div>
                <div className="qb-item-name">{it.name}</div>
                <button className="qb-apply">Apply</button>
              </div>
            ))}
          </div>

          <div className="qb-pagination">
            <button><Icon name="chevron-left" size={13}/> Previous</button>
            <button className="is-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>Next <Icon name="chevron-right" size={13}/></button>
          </div>
        </div>

        {/* MID — Question list rail */}
        <div className="qb-mid">
          <div className="qb-q-row is-active">
            <Icon name="grip-vertical" size={14} />
            <span>Question 1</span>
            <span className="qb-q-dot" aria-hidden/>
          </div>
          <button className="qb-add-q"><Icon name="plus" size={14}/> Add Question</button>
        </div>

        {/* RIGHT — Editor */}
        <div className="qb-right">
          <div className="qb-section">
            <div className="qb-section-title">Section</div>
            <div className="qb-section-sub">Instructions</div>
          </div>

          <div className="qb-question-card">
            <div className="qb-qc-head">
              <div className="qb-qc-title">Question 1</div>
              <div className="qb-qc-marks">
                <span>Marks :</span>
                <input className="qb-marks-input" />
              </div>
              <button className="qb-qc-del" aria-label="Delete"><Icon name="trash-2" size={14}/></button>
            </div>

            <textarea className="qb-textarea" placeholder="Type question..." rows={3}/>

            <button className="qb-add-sub"><Icon name="plus" size={13}/> Add Sub-question</button>

            <div className="qb-answer-row">
              <div className="qb-select">
                <span>Answer Type</span>
                <Icon name="chevron-down" size={14}/>
              </div>
              <div className="qb-select">
                <span>Question Category (optional)</span>
                <Icon name="chevron-down" size={14}/>
              </div>
            </div>

            <div className="qb-mini-toolbar">
              <button className="ce-tbtn ce-tbtn-text"><span>16px</span><Icon name="chevron-down" size={11}/></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn"><Icon name="a-large-small" size={14}/></button>
              <button className="ce-tbtn"><Icon name="type" size={14}/></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn"><b>B</b></button>
              <button className="ce-tbtn"><i>I</i></button>
              <button className="ce-tbtn"><u>U</u></button>
              <button className="ce-tbtn"><s>S</s></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn">H<sub>1</sub></button>
              <button className="ce-tbtn">H<sub>2</sub></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn"><Icon name="list" size={14}/></button>
              <button className="ce-tbtn"><Icon name="list-ordered" size={14}/></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn"><Icon name="align-left" size={14}/></button>
              <button className="ce-tbtn"><Icon name="align-center" size={14}/></button>
              <button className="ce-tbtn"><Icon name="align-right" size={14}/></button>
              <button className="ce-tbtn"><Icon name="align-justify" size={14}/></button>
              <div className="ce-tdiv"/>
              <button className="ce-tbtn"><Icon name="image" size={14}/></button>
              <button className="ce-tbtn"><Icon name="table" size={14}/></button>
              <button className="ce-tbtn"><span style={{fontFamily:"serif", fontWeight: 700}}>Σ</span></button>
            </div>

            <div className="qb-solution">
              <label className="qb-solution-label"><Icon name="lightbulb" size={13}/> Solution Explanation <span className="ce-optional">(optional)</span></label>
              <input className="qb-solution-input" placeholder="Type solution explanation..."/>
            </div>
          </div>

          <div className="qb-actions">
            <button className="qb-action">Add Section</button>
            <button className="qb-action">Add Question</button>
          </div>
        </div>
      </div>

      <div className="qb-footer">
        <button className="qb-back" onClick={onBack}>
          <span className="qb-back-circle"><Icon name="chevron-left" size={16}/></span>
          Back to Add Exam Information
        </button>
        <button className="qb-preview" onClick={onPreview}>
          <Icon name="eye" size={14}/> Preview
        </button>
      </div>
    </div>
  );
}

// ── Entry wrapper ────────────────────────────────────
function CreateExam() {
  useLucide();
  const [step, setStep] = ceUseState(1);
  return step === 1
    ? <AddExamInformation onNext={() => setStep(2)} />
    : <QuestionBuilder onBack={() => setStep(1)} onPreview={() => alert("Preview")} />;
}

Object.assign(window, { CreateExam, AddExamInformation, QuestionBuilder, RichTextArea });
