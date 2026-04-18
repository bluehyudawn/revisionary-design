# Design System Audit — RevisionOnline 2026-04-19

**배경**: 2.0 방향 옵션 A(Design System First) 착수. 처음부터 만드는 게 아니라 **현재 이 폴더(👾Revisionary👾)에 이미 존재하는 디자인 시스템 자산을 감사**하고, DEV 앱 QA 에서 발견한 시각 이슈와 대조해 gap 을 정리합니다.

**용도**: Phase 1 (0~8주) 실행 계획 수립 근거

---

## 0. 이 폴더의 정체

QA 당시 DEV Next.js 앱 코드베이스인 줄 알았으나, 실제로는 **"디자인 토큰 브리지 + 마케팅 사이트 + 정적 스타일 레퍼런스"** 를 담은 디자인·마케팅 워크스페이스.

| 파일 | 역할 | 라인 |
|---|---|---|
| `RevisionOnline.fig` | Figma 소스(137MB, 디자인 원본) | — |
| `theme.js` | 토큰 raw 값 (색/타이포/fontStyle 26종) | 440 |
| `tailwind.config.js` | Tailwind → CSS custom property 브리지 | 239 |
| `scripts/sync-tokens.js` | Figma node 75:408 → theme.js 감사 스크립트 (dry-run) | 241 |
| `design-system.html` | React/Babel 인터랙티브 컴포넌트 갤러리 | 837 |
| `style-guide.html` | 정적 HTML 스타일 레퍼런스(구버전) | 543 |
| `index.html` / `blog.html` / `blog-detail.html` / `atar-calculator-redesign.html` | 마케팅 사이트 (토큰 사용) | — |

**결론**: 디자인 시스템의 "**토큰 레이어**"는 이미 확립됨. 부족한 건 **(1) 컴포넌트 커버리지** 와 **(2) DEV Next.js 앱에의 실제 적용**.

---

## 1. 토큰 레이어 — 양호

### 컬러
- 12개 팔레트 × 11단계 = **132개 컬러 토큰** + 시맨틱 2개(`label-normal`, `fill-strong`) + `white`/`black`
  - `revision` (보라 brand · 500=#783CF0), `stone`, `neutral`, `blue-violet`, `emerald`, `orange`, `red`, `grass`, `pink`, `yellow`, `sky`
- Figma node 75:408 과 sync-tokens.js 로 감사 가능 (마지막 sync 2026-03-28)
- **Stone/700 Figma 쌍값 버그** 메모 보존 (주석에 기록됨)

### 타이포그래피
- 3개 폰트 패밀리: Inter(sans) · Nunito(heading) · Inter Tight(tight)
- 사이즈: 10 · 12 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 48 · 64 px
- line-height 4종(none 1 / snug 1.34 / normal 1.44 / tight 1.24)
- weight 5종(400/500/600/700/800)
- **fontStyle 컴포지트 26종** (h1~h6-bold, section, subtitle1/2, body1/2 × {bold,semibold,medium,regular,reading,bold-h}, caption1/2)

### 브리지
- `tailwind.config.js` 가 CSS 커스텀 프로퍼티로 참조 (`var(--color-revision-500)`)
- Tailwind 커버리지: 색 / 폰트 패밀리 / 폰트 사이즈 / 폰트 웨이트 / line-height / letter-spacing

### 미흡 영역 (Gap)
| 토큰 카테고리 | 상태 |
|---|---|
| **Spacing** | ❌ 누락 — `padding: 14px 16px` 같은 값이 컴포넌트에 하드코딩 |
| **Border radius** | ❌ 누락 — `60px pill`, `8px input`, `12px dialog`, `20px card` 모두 하드코딩 |
| **Shadow / elevation** | ❌ 누락 — `0px 6px 2px -4px rgba(14,14,44,0.1)` 등 리터럴 |
| **Focus ring** | ❌ 누락 — 컴포넌트마다 다른 색(revision-50 / blue-violet-600 / #fff / stone-700) |
| **Z-index scale** | ❌ 누락 |
| **Motion (duration/easing)** | ❌ 누락 — `transition: 0.2s` 등 리터럴 |
| **Dark mode 시맨틱** | ⚠️ `design-system.html` 내 쉘 변수로만 존재, 토큰화 안됨 |

---

## 2. 컴포넌트 레이어 — 부분적

`design-system.html` 에 문서화된 컴포넌트:

| 섹션 | 항목 | 상태 | 비고 |
|---|---|---|---|
| Figma | 디자인 파일 링크/변경 로그 | ✅ | 메타 배지 |
| Colors | 12 팔레트 스와치 | ✅ | 복사 기능 포함 |
| Typography | 13종 샘플 + CSS | ✅ | fontStyle 일부 표시 |
| Buttons | Primary · Secondary · Tertiary (5 상태) | ✅ | Pill shape 고정 |
| Textfields | default / focus / valid / error / disabled | ✅ | focus=blue-violet-600 (⚠️) |
| Form Controls | Toggle · Checkbox · Progress bar | ✅ | 토글 ON=emerald 하드코딩 |
| Badges | completed / cancelled / progress / pending | ✅ | legacy 컬러(#def7ec 등) — 토큰 미사용 |
| Feedback | Toast · Tooltip · Popover | ⚠️ | 배경 `#0e0e2c` 하드코딩(토큰 밖) |
| Dialog | Confirmation modal | ✅ | |

### DEV 앱에 존재하지만 디자인 시스템엔 없는 컴포넌트

| 누락 컴포넌트 | 어디서 관찰됨 | 중요도 |
|---|---|---|
| **App Shell / Sidebar** | 4개 역할 모두 사용(writer/teacher/student/manager) | P0 — 4-UI 분리 해결의 핵심 |
| **Top Bar (로고 + 알림 + 프로필)** | 모든 내부 페이지 | P0 |
| **Nav item (collapsed / expanded)** | 사이드바 내부 | P0 |
| **Card (Dashboard card with status badge)** | Student/Manager Practice Exams | P1 |
| **Empty state** | Writer Dashboard (빈 상태) | P1 |
| **Tabs** | Score Calculator 등 | P1 |
| **Select / Dropdown** | Create Exam 폼 | P1 |
| **Rich text editor container** | Teacher/Manager Create Exam | P2 |
| **Pagination** | Manager dashboard | P1 |
| **Wizard / Stepper (multi-step modal)** | Teacher Welcome Modal (Step 1/2/3) | P0 — T-06 버그 대상 |
| **Password visibility toggle** | Sign In | P1 — P-1 이슈 |
| **Avatar / Profile chip** | Top Bar | P2 |
| **Subject badge (과목 컬러 코드)** | Dashboard cards | P1 — M-3 이슈 |
| **Placeholder / "개발 중" 가드** | Payment Management | P0 — S-11 이슈 |

---

## 3. 토큰 vs DEV 앱 불일치 (QA 결과와 교차 검증)

### 🔴 Focus color 혼재
- **디자인 시스템**:
  - Primary button focus → `revision-50` (#F5F2FF) 글로우
  - Secondary button focus → `#fff` 글로우
  - Tertiary button focus → `stone-700` (#44403B) 테두리
  - Input focus → **`blue-violet-600`** (#4B4DED) 테두리
- **DEV 앱**:
  - Teacher/Manager Create Exam Reading/Writing Time input → **시안/틸** (~#14B8A6) ← T-11 / M-7
- **원인**: 디자인 시스템 자체가 focus 에 4종 색을 섞어 씀. **단일 focus ring 토큰(`--ring-brand`) 부재**. DEV 앱이 또 다른 5번째 색을 쓰는 중.
- **조치**: `--ring-brand: var(--color-revision-500)` 시맨틱 토큰 신설, 모든 포커스 스테이트 이것으로 통일.

### 🔴 Save 버튼 컬러 일탈
- **디자인 시스템**: Primary 는 `revision-500` 보라 pill (일관됨)
- **DEV 앱**: Student Subjects 의 Save Changes → **`emerald`** 초록 ← S-03
- **원인**: 디자인 시스템 Toggle ON = emerald-400(#31d0aa) 이 "성공/저장 = 초록" 인상을 남겼을 가능성. 사실상 DEV 구현 과실.
- **조치**: Primary 는 무조건 보라. 초록은 **Toggle ON / success toast** 한정.

### 🔴 Badge 컬러가 토큰 밖
- 디자인 시스템 badges CSS 는 레거시 컬러(`#def7ec`, `#fde8e8`, `#edebfe`, `#fef8eb`)를 직접 씀. 토큰 팔레트(emerald/red/pink 또는 revision/orange)와 hex 가 다름.
- **조치**: Badge 를 토큰(`emerald-100 + emerald-700` 등)으로 리빌드.

### 🔴 Brand 표기 3종 + 로고 컬러 규칙 부재
- Landing 은 "Revisionary Online" 검정, Sign In 은 "Revisionary Online" 보라, 도메인은 `revisiononline.com.au`, 소스엔 `RevisionaryOnline` 붙여쓰기 — QA qa_common.md 지적
- 디자인 시스템엔 **로고/워드마크 컴포넌트 섹션 자체가 없음** (폴더 최상위에 `wordmark.png` / `symbol.svg` 는 존재하나 문서화 안됨)
- **조치**: Phase 1 첫 주에 브랜드 결정 → `design-system.html` 에 Brand 섹션 추가.

### 🟡 style-guide.html 과 design-system.html 사이즈 불일치
- style-guide.html: h1 40px, h2 30px, body 12px — **축소된 프린트용 레퍼런스로 추정**
- design-system.html: h1 64px, h2 48px, body 16px — **Figma 실제 값**
- **판단**: `style-guide.html` 은 정적 프레젠테이션용 레거시. 새 시스템의 source of truth 는 `design-system.html` + `theme.js`.
- **조치**: style-guide.html 은 archive 폴더로 이동 or deprecate 표기.

### 🟡 Sync 스크립트의 dry-run 한계
- `sync-tokens.js` 는 `--write` 미구현. 감사만 가능.
- Figma 에서 값이 바뀌면 수동으로 `theme.js` + `design-system.html` 내부 하드코딩된 팔레트 배열 + `style-guide.html` CSS 3군데 동기화 필요
- **조치**: `--write` 구현 + `design-system.html` 내부 `palettes` 배열을 `theme.js` 에서 생성하도록 통합.

---

## 4. DEV Next.js 앱과의 관계

**현 상태(추정)**: DEV 앱은 `web.dev.revision.internal` 에 배포된 별개 Next.js 저장소. 이 디자인 시스템 폴더의 토큰을 **미적용** 상태로 보이며, 결과적으로:
- Create Exam 이 시안 포커스 → 로컬 Tailwind 기본값 사용 중일 가능성
- Save Changes 가 emerald → tailwind 기본 `bg-green-*` 직접 사용 가능성
- 사이드바·버튼·배지가 각 페이지에서 재구현됨 → 4-UI 분리의 원인

**확인 필요 (사용자에게 질의할 항목)**:
1. DEV 앱 저장소 경로가 어디인가? (별도 git repo? 별도 폴더?)
2. 해당 저장소가 `theme.js` / `tailwind.config.js` 를 import 하는가, 자체 설정이 있는가?
3. 모노레포 / npm 패키지화 계획이 있는가, 아니면 복붙 동기화인가?

---

## 5. Phase 1 (0~8주) 실행 계획 제안

### Week 1 — Foundation 보강
- [ ] **Spacing / Radius / Shadow / Motion / Z-index 토큰 추가** — `theme.js` + CSS vars + Tailwind
- [ ] **시맨틱 토큰 추가**: `--ring-brand`, `--bg-success`, `--bg-danger`, `--bg-warning`, `--bg-info` (기존 팔레트에 이름만 부여)
- [ ] **Brand 결정**: "RevisionaryOnline" / "Revisionary Online" / "Revision Online" 중 택일
- [ ] **로고 컬러 규칙**: 라이트 배경=보라 / 다크 배경=흰색 — 표준화
- [ ] `sync-tokens.js --write` 구현

### Week 2 — 컴포넌트 일관화
- [ ] **Focus ring 일괄 교체**: Button/Input/Checkbox 모두 `--ring-brand`
- [ ] **Badge 재빌드**: 토큰 팔레트(emerald/red/revision/orange) 기반
- [ ] **Password visibility toggle** 컴포넌트 추가
- [ ] **Placeholder/"개발 중" 가드** 컴포넌트 추가 (Payment 용)

### Week 3~4 — App Shell 문서화
- [ ] **Sidebar** 컴포넌트 (collapsed/expanded, role-agnostic)
- [ ] **Top Bar** 컴포넌트 (로고 + 알림 + 프로필 + Sign Out)
- [ ] **Nav item** (active/hover/group header)
- [ ] Figma 에 대응하는 4개 역할 변주 매핑 문서

### Week 5~6 — Data 컴포넌트
- [ ] **Card (dashboard tile)** — subject badge 슬롯 / status badge / progress
- [ ] **Empty state**
- [ ] **Tabs**
- [ ] **Select / Dropdown**
- [ ] **Pagination**
- [ ] **Wizard / Stepper** (Teacher Welcome Modal T-06 수정 기반)

### Week 7~8 — 적용 & 롤아웃
- [ ] DEV 앱 저장소 위치 확정 후, `@revisionary/tokens` npm 패키지화 or 직접 파일 복사
- [ ] P0 Hotfix 7개 DEV 앱 반영 (qa_common.md / 2.0_direction.md 참고):
  1. 브랜드 표기 통일
  2. Teacher Welcome Modal 영속화 + Step 2 Loading 버그
  3. Writer Create Exam eager validation / Exam Specifications
  4. Save Changes 초록→보라
  5. Payment placeholder 정리
  6. Manager focus 시안→보라
  7. `/teacher/exam/create` 라우트 분리
- [ ] DEV 앱에 Tailwind preset 로 본 `tailwind.config.js` 적용 → 로컬 하드코딩 컬러 단계적 제거
- [ ] 회귀 QA: `qa/scripts/run_all.sh` 재실행 후 diff 비교

---

## 6. 리스크 & 결정 필요 항목

**Alex 확인 요청**:
1. **DEV 앱 저장소 위치?** → 이게 확정되어야 Week 7 적용 작업 범위가 정해짐
2. **`style-guide.html` 폐기 여부?** → 둘 사이 값이 다른데 둘 다 유지하면 혼란
3. **토큰 배포 전략**: 모노레포 이관 / npm 패키지 / 단순 복사 중 선택
4. **Figma 와 동기화 주기**: 주간 자동? 수동 on-demand?

**감수 가능한 트레이드오프**:
- Spacing/Radius 토큰을 뒤늦게 도입 → 기존 CSS 리터럴 마이그레이션 부담. Phase 1 중 neue 컴포넌트부터 적용, 레거시는 기회주의적 교체.
- `design-system.html` 의 badge/toast 하드코딩 컬러 → 시각 변화 수반. 유저 노출 전이면 OK.

---

## 7. 다음 액션

Alex 답변 주시면 바로 진행:
- Q1 DEV 앱 경로 → 확인 후 Week 7 작업 범위 확정
- Q2 브랜드 표기 택일 → 즉시 라인 변경 PR 개시
- Q3 style-guide.html 처리 → archive vs 갱신 결정

답변 없이도 착수 가능한 작업 (요청 시 즉시 시작):
- Spacing/Radius/Shadow/Motion 토큰 설계 → `theme.js` + `tailwind.config.js` 패치 초안
- P0 Hotfix 6번 (Focus color) 토큰 신설 → 디자인 시스템 먼저 수정

원하시는 범위 말씀해 주세요.
