# DEV Probe Findings — 2026-04-19 (v2 capture)

> **TL;DR** — 4계정(teacher.1 / manager.1 / student.1 / writer.1)으로 DEV 서버 직접 URL 진입 테스트를 수행한 결과, **사이드바가 홍보하는 10개 경로가 HTTP 404 로 존재하지 않음**. 나머지 대부분의 role 내부 경로는 HTTP 200 을 받지만 **deep-link 가 차단되어 `/dashboard` 로 강제 리다이렉트** 됨. Teacher 는 서버가 `?onboarding=true` 쿼리를 강제로 붙여 모달이 지속되는 구조. 성능은 양호(TTFB <200ms, FCP <660ms) — **로딩이슈 아닌 라우팅·IA 이슈가 최우선**.

## Metadata

| | |
|---|---|
| Product | RevisionOnline (DEV web.dev.revision.internal) |
| Author | Claude (Alex 자동 QA 런 v2) |
| Date | 2026-04-19 |
| Capture script | `qa/scripts/capture_v2.js` (신규) |
| Accounts | teacher.1, manager.1, student.1, writer.1 |
| Output | `qa/screenshots_v2/<role>_<user>/` (raw PNG + `_manifest.json`) |
| Status | 🔬 Observed — 아래 P0 항목은 `ux_roadmap.md` Week 2 로 승격 |

## Non-goals

- 전체 10계정 재캡처 (본 run 은 role-당 1계정 대표 probe)
- 실제 UI 픽셀 diff (본 run 은 라우팅/HTTP 상태/콘솔 에러/성능 지표 중심)
- 픽셀 스펙 측정 (Week 2 재캡처에서 수행)

---

## 1. 사이드바가 광고하지만 HTTP 404 인 경로 — **10개**

`_manifest.json` 의 `httpStatus: 404` 항목을 역할별로 집계.

| 역할 | 경로 | HTTP | 콘솔 에러 |
|---|---|---|---|
| Teacher | `/teacher/question-bank` | 404 | ✅ `Failed to load resource... 404` |
| Teacher | `/teacher/marking` | 404 | ✅ |
| Teacher | `/teacher/my-exams` | 404 | ✅ |
| Writer | `/writer/question-bank` | 404 | ✅ |
| Manager | `/manager/question-bank` | 404 | ✅ |
| Manager | `/manager/my-exams` | 404 | ✅ |
| Manager | `/manager/mock-exam-sequence` | 404 | ✅ |
| Manager | `/manager/mock-exam-list` | 404 | ✅ |
| Manager | `/manager/practice-exam-list` | 404 | ✅ |
| Manager | `/manager/writer-question-list` | 404 | ✅ |

**증거**
- Manager 한 계정만으로 **6개 사이드바 항목이 실제로는 빌드에 존재하지 않음**. 사이드바 = 거짓말.
- Teacher 의 핵심 기능 3개 (Question Bank / Marking / My Exams) 전부 404. 특히 **Marking 이 없으면 Teacher 역할의 주용도(채점) 가 서비스 불가** — 기능 자체가 없다는 뜻이거나, 다른 경로에 존재하지만 사이드바 link 가 잘못된 것.
- Writer 의 Question Bank 도 404 → Writer 의 primary workflow 가 끊김. `/writer/my-exams` 는 200 이지만 /dashboard 로 리다이렉트 되므로 **deep link 불가**.

**영향도**: 🔴 P0 — Information Architecture 근본 실패. 기능 구현 전이라면 사이드바에서 **미노출** 해야 함. 구현돼 있지만 경로가 다르다면 사이드바 href 교정 필요.

---

## 2. Deep-link 차단 — 대부분의 role 내부 경로가 `/dashboard` 로 리다이렉트

`httpStatus: 200` + `redirected: true` + `landedUrl: .../dashboard` 조합 집계.

| 역할 | 의도한 경로 → 착지 |
|---|---|
| Teacher | `/teacher/class`, `/teacher/exam/create`, `/profile`, `/notification`, `/instructions` → 모두 `/dashboard?onboarding=true` |
| Writer | `/writer/exam/create-exam`, `/writer/my-exams`, `/profile`, `/notification`, `/instructions` → 모두 `/dashboard` |
| Student | `/student/subjects`, `/score-report`, `/student/score-calculator`, `/payment-management`, `/profile`, `/notification`, `/instructions` → **8/8 전부** `/dashboard` |
| Manager | `/teacher/exam/create`, `/manager/user`, `/manager/school`, `/manager/inquiry`, `/manager/question-category`, `/manager/subjects`, `/profile`, `/notification`, `/instructions` → 모두 `/dashboard` |

**해석**
- 이 경로들은 **페이지가 존재**함 (사이드바 클릭 시 정상 동작, capture.js v1 실측). 하지만 `location.href = '/...'` 같은 **직접 URL 진입은 client-side guard 가 리다이렉트**.
- Student 의 경우 **8개 전 경로가 deep-link 불가** → 탭 보존, 북마크, 공유 링크, 새 창에서 열기 모두 부서짐.

**영향도**: 🔴 P0 (UX/SEO/공유성). 실제 사용자가 score-report 링크를 공유해도 받은 사람이 dashboard 로 떨어짐.

**추정 원인**: 
- Next.js App Router + client 측 role guard 가 hydration 전 `router.replace('/dashboard')` 수행
- 혹은 `middleware.ts` 에서 세션 동기화 타이밍 문제
- Week 2 에 개발자 브리핑 필요

---

## 3. Teacher `?onboarding=true` 서버 강제 쿼리 — 모달 persistence 근본 원인

- teacher.1 로그인 직후 `/dashboard` 로 이동하면 응답이 **`/dashboard?onboarding=true`** 로 착지. 9개 경로 모두 `?onboarding=true` 가 따라붙음.
- 즉, 기존 QA T-01 "Welcome Modal 이 재방문마다 표시" 는 localStorage 누락이 아니라 **URL 쿼리로 모달 상태를 강제로 재켜는 서버 리다이렉트 로직** 이 원인.

**영향도**: 🔴 P0 — 기존 가설 수정 필요. Fix 방향:
1. 서버에서 첫 로그인 후 `?onboarding=true` 제거
2. 또는 모달 쿨다운을 쿼리 대신 user 속성 `hasCompletedOnboarding` 으로 대체
3. client 에서 쿼리 읽은 후 `router.replace('/dashboard')` 로 URL 정리

`ux_roadmap.md` L-01 Loading 무한 대기와 별도 이슈임 — 두 개 모두 수정 대상.

---

## 4. 404 페이지 off-brand

- 10개 404 스크린샷 (`12_manager_question_bank_raw.png` 등) 모두 동일한 34,942 B PNG.
- 화면: "Page Not Found" 텍스트 + **파란색 "Go to Home" 버튼** + 사이드바/헤더 없음.
- 브랜드 색(revision-purple) 아닌 기본 blue → 디자인 시스템에서 분리된 fallback.

**영향도**: 🟡 P1 — 404 는 자주 노출되는 페이지이고 본 서비스의 IA 미완성 때문에 더욱 자주 보일 것.
**Fix**: 404 템플릿을 revision-purple CTA + 사이드바 유지형으로 재설계 (ux_roadmap C-04 와 연계).

---

## 5. Writer Dashboard 에서 존재하지 않는 API 호출

- `GET http://web.dev.revision.internal/node_api/api/v1/question-group/mine?page=1&limit=30` → `net::ERR_ABORTED` on `/dashboard`.
- Writer 에게 **Dashboard 자체가 존재하면 안 되는데** (Notion `My Exam vs Dashboard` 기준) 화면이 로드되면서 엉뚱한 API 를 호출 → 취소됨.
- 즉, **Writer 의 `/dashboard` 진입은 곧 버그** (ux_roadmap D-1 의 확정 증거).

**Fix 방향 (D-1 결정)**: Writer 로그인 후 `/writer/my-exams` 로 server-side redirect. `/dashboard` 는 Writer 에게 404 또는 /writer 홈으로 alias.

---

## 6. 성능 지표 — 로딩 이슈는 **없음**

16개 경로 metrics 집계 (manager + teacher + student + writer 합산):

| 지표 | 평균 | 최대 | 판정 |
|---|---|---|---|
| TTFB | ~170ms | 207ms | ✅ 매우 빠름 |
| DOMContentLoaded | ~260ms | 687ms | ✅ |
| First Paint | ~250ms | 508ms | ✅ |
| First Contentful Paint | ~500ms | 660ms | ✅ |
| LargestContentfulPaint | **null** | — | ⚠️ 지표 수집 실패 (headless LCP observer 미활성) |
| navMs (networkidle2 기준) | 1.5~5.3s | 5.4s | ⚠️ GA 차단으로 인한 idle wait 지연 |

**결론**: 웹 기본 성능은 문제 없음. "로딩이 오래 걸린다" 는 체감은 **모달 Step 2 Loading 무한 대기 (L-01)** 와 **deep-link 리다이렉트 지연** 이 원인.

---

## 7. 부수 관찰 — 노이즈 제외

| 관찰 | 정체 | 조치 |
|---|---|---|
| `google-analytics.com/g/collect` POST 가 13~31회 ERR_ABORTED | GA4 트래커가 네트워크/CSP 로 차단됨 (headless 환경 한정 가능성) | 무시 가능 — 실유저 환경에서 재확인만 |
| `supabase.co/auth/v1/user` GET 1회 ERR_ABORTED (teacher only) | 페이지 언로드 중 취소 | 무시 |
| `/dashboard?onboarding=true` GET ERR_ABORTED 여러 번 | SPA 내 중복 네비게이션으로 인한 취소 | 무시 |

---

## 8. Phase A — Student.1 SPA Flow 실측 (추가)

`capture_student_flow2.js` 실행 결과 — 이번엔 직접 URL 이 아닌 **사이드바 클릭(SPA 내부 네비)** 로 이동.

| 단계 | 착지 URL | 결과 |
|---|---|---|
| login → /dashboard | `/dashboard` | ✅ |
| sidebar → Score Report | `/score-report` | ✅ |
| Completed 행 Report 아이콘 | `/score-report/62` | ✅ — 풀 상세 페이지 |
| sidebar → Score Calculator | `/student/score-calculator` | ✅ |
| sidebar → Subjects | `/student/subjects` | ✅ |
| sidebar → Payment | `/payment-management` | ✅ |
| sidebar → Profile | `/profile` | ✅ |
| sidebar → Notification | `/notification` | ✅ |
| sidebar → Instructions | `/instructions` | ✅ |
| "Opens in 7h 1m" 카드 클릭 | `/dashboard` (URL 무변화) | ❌ 클릭 무반응 |

### 결정적 관찰

1. **IA-02 Deep-link 범위 확정** — SPA 내부 client navigation 은 정상 동작. `capture_v2.js` 의 `page.goto()` (full page navigation) 에서만 `/dashboard` 로 리다이렉트. 원인: Next.js hydration 전 middleware/guard 가 세션 미로드 상태에서 `/dashboard` 로 tre-directs. **실제 유저는 북마크·공유링크·새창에서만 증상 발현** — 여전히 P0 지만 범위 축소.

2. **Score Report 상세(`/score-report/62`) 는 이미 고퀄리티 구현** — 통계 5카드 · 정규분포 차트 · My Percentile Rank · 문항별 ✅/❌ + Submitted/Correct · **교사 손글씨 피드백(빨간 펜 주석)** 렌더. ux_roadmap Top 10 #9 "Score Report 상세 부재" 지적은 **철회**.

3. **채점 기능은 실제로 동작 중** — `/teacher/marking` 은 404 지만, student.1 의 Completed 시험 3건(test11 / Bio_Test_2_jake / Jae Test Acc yr12 등) 에 교사 빨간 펜 주석이 존재. 즉 **Marking UI 는 다른 경로에서 접근됨** — 예: `/teacher/exam/{id}/mark` 또는 별도 admin. **IA-01 의 Marking 항목은 "404" 가 아니라 "잘못된 href" 로 재분류**.

4. **"Opens in" 카드 click 무반응** — 카운트다운 중이라 disabled 인지, 아예 핸들러 미바인딩인지 불명. 응시 시각 도달 시 자동으로 enabled 되는지도 미확인. **학생 시험 응시 entry point 불명** — Week 2 재캡처 시 시각 맞춰 재시도.

5. **Score Report 목록의 Marking Status** — 16건 중 13건이 "Waiting". 즉 **채점 backlog 가 매우 쌓여있거나 채점 자동화가 없는 상태**. 운영팀 워크플로 이슈일 수 있음.

---

## 요약 — Week 2 재캡처 전에 반드시 가야 할 P0

1. **IA 결정**: 404 가 되는 10개 사이드바 경로에 대해 (a) 기능 구현 / (b) 올바른 경로로 href 교정 / (c) 사이드바에서 숨김 중 택1 — **개발자 & Alex 합의 필요**
2. **Deep-link 가드 수정**: 세션 로드 전 `router.replace('/dashboard')` 를 지연시키거나 조건부화 — **프론트 수정**
3. **Teacher onboarding 쿼리 제거**: 서버 또는 client 쪽 중 한곳에서 `?onboarding=true` 지움 — **프론트 or 백엔드**
4. **Writer /dashboard 차단 or redirect**: D-1 결정 후 구현
5. **404 페이지 브랜드 적용**: revision-purple CTA + 사이드바 구조 유지

## 다음 액션

`ux_roadmap.md` Week 2 체크리스트를 위 P0 5건으로 덮어쓴다. Week 1 의 `capture_v2.js` 는 이미 완성 — **skipModal 매칭 규식만 실제 Skip Tutorial 버튼 텍스트로 정정** 하면 Teacher 모달 이후 실화면 캡처 가능.
