# UX Audit & Phase 1 Week Plan — 2026-04-19

> **TL;DR** — 디자인 시스템은 2차로 미루고, **UX 기본(로딩·콘텐츠 누락·그리드·프로덕션 가드) + 역할별 화면 커버리지 완전성** 을 Phase 1 의 1차 목표로 삼는다. Notion Wiki `My Exam vs Dashboard` · `Wiki 표준`을 전제로 기존 QA 지적 일부를 수정하고, 8주 플랜으로 재캡처 → UX 핫픽스 → 누락 화면 완성 순서를 제안.

## Metadata

| | |
|---|---|
| Product | RevisionOnline (web, responsive) |
| Author | Claude (Alex QA 자동화) |
| Date | 2026-04-19 |
| Status | 📐 Designed — Alex 승인 대기 |
| References | [qa_common](qa_common.md) · [qa_writer](qa_writer.md) · [qa_teacher](qa_teacher.md) · [qa_student](qa_student.md) · [qa_manager](qa_manager.md) · [qa_public](qa_public.md) · [design_system_audit](design_system_audit.md) · Notion: `My Exam vs Dashboard`, `Wiki Documentation Standards` |

## Overview

2026-04-19 10계정 자동 캡처 QA 후 2.0 방향을 옵션 A (Design System First) 로 결정했으나, Alex 가 "디자인 시스템보다 웹사이트 기본 UX 및 역할별 누락 화면" 을 1차 focus 로 재지정. 또한 Notion 공식 문서 `My Exam vs Dashboard` 로 기존 QA 지적 일부가 의도된 설계였음을 확인. 본 문서는 전제를 재정리하고 8주 실행 계획을 제안.

## Non-goals

- 디자인 토큰 전면 재설계 (Phase 2 로 이관)
- Figma 완전 재생 (Phase 2)
- 4-UI → 1-UI 통합 (옵션 B/C 의 범위)
- 네이티브 앱 / 모바일 앱 별도 프로젝트 (본 서비스는 **웹 only, 반응형으로 모바일 대응**)

---

## 0. 전제 수정 — 기존 QA 에서 잘못 지적한 항목

Notion `My Exam vs Dashboard` 문서 확인 후, 기존 QA 리포트에서 **의도된 설계를 버그로 오인한 항목** 을 정정.

| 기존 지적 | 리포트 | 실제 의도 (Notion 기준) | 조치 |
|---|---|---|---|
| M-5 "Practice Exams vs Practice Exam List 중복" | qa_manager.md | Dashboard 는 in-operation only(Scheduled/Open/Access Closed), Practice Exam List=My Exam 은 Draft~Graded 전체 — **의도된 분리** | 지적 철회. 단 명명(All Practice Exams → All School Practice Exams) 은 Notion 에서도 논의 중 |
| B-1/B-3 "Writer Dashboard 빈 상태 / Writer 전용 대시보드 부재" | qa_writer.md | Writer 는 Dashboard 역할 없음. My Exams 는 Question Bank 기반 별개 페이지 | Writer 에게 Dashboard 진입이 가능한 것 자체가 **라우팅 오류** — P0 로 재분류 |
| S-3 "Student Dashboard 에 Welcome 카드/메트릭 없음" | qa_student.md | Student 는 Practice Exams 뷰(학생용) + Mock Exam Periods + In-progress Banner 만 노출하도록 **의도됨** | 지적 철회. 단 Mock Exam Periods / In-progress Banner 가 실제 렌더되는지 **재캡처 필요** |
| T-6 "[New] 배지와 Published 배지 모두 보라" | qa_teacher.md | [New] 는 Marking Required 통계카드의 액션 유도 배지, Published 는 lifecycle status 배지 — 성격 다름 | 색 통일 아닌 **시각 위계(pulse/outline) 분리** 로 방향 변경 |
| T-7 "Writer Dashboard vs Teacher Dashboard 기능 격차" | qa_teacher.md | Writer 에겐 Dashboard 자체가 없음. 비교 대상 오류 | 지적 철회 |

**남은 유효 지적**: T-1/T-2/T-11/W-1/W-2/S-4/S-14/M-6/M-7 등 P0·P1 로 분류된 UX 버그는 유효.

---

## 1. UX 기본 이슈 (웹사이트 기초)

기존 캡처 + 세션 관찰에서 추출한 **디자인 시스템과 무관한 기본 UX 문제**.

### 1-1. 로딩 / 네트워크

| ID | 증거 | 상태 |
|---|---|---|
| L-01 | Teacher Welcome Modal Step 2 콘텐츠 "Loading…" 무한 대기 (teacher.1~3 모두 재현) | 🔴 P0 |
| L-02 | capture.js 자체에 navigation timing / LCP / 네트워크 실패 수집 로직 **부재** — 실제 페이지 로딩 지표 불명 | 🟡 측정 인프라 부재 |
| L-03 | 캡처 시 post-login → 모든 페이지가 초기엔 `/dashboard` 로 리다이렉트 → client-side route 로 다시 이동. **첫 페이지 렌더 지연 체감 확인 필요** | 🟡 |

### 1-2. 콘텐츠 누락 / 렌더 실패

| ID | 화면 | 누락 내용 |
|---|---|---|
| C-01 | Writer Create Exam | Exam Specifications 필드 라벨만 있고 **입력 영역 미렌더** |
| C-02 | Writer Dashboard | 콘텐츠 대신 **회색 빈 박스 1개** (애초에 Writer 에게 Dashboard 라우트 가 있으면 안 됨) |
| C-03 | Writer Notification | 카드에 시간·보낸이·타입·읽음상태 **메타데이터 전무** |
| C-04 | Public / 404 | Figma `404error` (4646:9202) 존재하나 구현 여부 **미확인** |
| C-05 | Student Dashboard | Mock Exam Periods accordion / In-progress Exam Banner **캡처 안됨** (계정 상태상 렌더 안 됐을 수 있음 — 재확인 필요) |
| C-06 | Teacher Dashboard | My Practice Exams + All Practice Exams 두 섹션 구조 **미확인** (Welcome 모달에 가려짐) |
| C-07 | Student Subjects | Mock Exam Periods 빈 상태 텍스트만 — 연도 전환·문의 경로 없음 |
| C-08 | Sign In | 비밀번호 재설정 / 회원가입 플로우 **미캡처** |

### 1-3. 레이아웃 / 그리드

| ID | 증거 | 영향 |
|---|---|---|
| G-01 | Student Score Report 의 사이드바가 타 페이지 대비 **좁게 렌더** (동일 1440 뷰포트) | CSS breakpoint 누락 의심 |
| G-02 | Manager 사이드바 "Mock Exam Seque…" 텍스트 **잘림** — ellipsis 미적용, 여유 공간 있음 | 오버플로우 처리 |
| G-03 | Teacher Create Exam 좌측 폼 / 우측 리치 에디터 2개 — **우측이 훨씬 길어** 스크롤 불균형 | 컬럼 기반 레이아웃 높이 동기화 부재 |
| G-04 | Manager Create Exam 뒤에 **푸른 그라디언트 장식** 이 기능 UI 와 겹쳐 보임 — z-index / 배치 의도 불명 | 프로덕션 가드 의심 |
| G-05 | Manager 상단 바 로고가 **축소된 상태** — 타 역할 대비 스케일 차이 | 헤더 레이아웃 일관성 |
| G-06 | Sign In 의 Password 인풋 우측 👁 아이콘 — 토글 상태 표시 방식 애매 | UX 패턴 정립 필요 |
| G-07 | **반응형 브레이크포인트 전 범위 미테스트** (1440 데스크톱만 캡처) | 웹 only 서비스로서 치명적 |

### 1-4. 프로덕션 가드 (production-ready 가 아닌 상태가 유저에 노출)

| ID | 화면 | 노출된 내용 |
|---|---|---|
| P-01 | Student Payment Management | "This page should include: ... Currently under development…" **개발자 메모 원문** |
| P-02 | Writer Instructions | "Instructions will be available soon" — 플레이스홀더 자체는 OK, 단 Writer 전용인지 전역인지 불명 |
| P-03 | Student Subjects "Mock Exam Periods" 빈 메시지 | "No mock exam periods available for 2026" — 2027 이후 자동 롤오버 로직 여부 불명 |
| P-04 | 알림 벨 빨간점 **상시 표시** | 미읽음 상태 동기화 안 되어 항상 켜짐 |
| P-05 | Teacher "Teacher 1010101" 표시 | 이름 미등록 fallback 이 ID/숫자 노출 → 브랜딩 허술함 |

### 1-5. 접근성 / 인터랙션 품질

| ID | 항목 | 상태 |
|---|---|---|
| A-01 | 알림 벨 빨간 점에 숫자/aria-label 없음 → 스크린리더로 상태 확인 불가 | ❌ |
| A-02 | Email 열의 보라 링크 (Teacher Classroom) 클릭 동작 불명 — hover 힌트/href 미확인 | ❌ |
| A-03 | Delete 버튼에 확인 다이얼로그 존재 여부 미확인 (Destructive primary 인데 방어 없으면 위험) | ⚠️ |
| A-04 | 폼 에러가 eager validation 으로 초기 노출 (Writer Create Exam) → 접근성 메시지 반복 | ❌ |
| A-05 | Focus-visible outline 이 역할마다 다른 색 (보라/시안/흰색/회색) | ⚠️ |
| A-06 | 키보드 탭 순서 / 모달 포커스 트랩 **전혀 테스트 안됨** | 🟡 |

### 1-6. 반응형 (전체 미테스트)

| 브레이크포인트 | 캡처됨? | 우선순위 |
|---|---|---|
| Desktop 1440×900 | ✅ | — |
| Desktop 1920 | ❌ | P2 |
| Laptop 1280 | ❌ | P1 |
| Tablet 1024 | ❌ | P1 |
| Tablet 768 | ❌ | P0 (학생 사용 추정) |
| Mobile 414 | ❌ | P0 (학생 사용 추정) |
| Mobile 375 | ❌ | P0 (학생 사용 추정) |

> 서비스가 웹 only + 반응형 = 모바일 커버리지가 Phase 1 에 필수.

---

## 2. 역할별 화면 커버리지 매트릭스

Notion `My Exam vs Dashboard` + Figma 구조 + 사이드바 관찰을 교차 점검한 **역할 × 화면** 완전성.

### 2-1. 역할 인벤토리 (Notion 기준)

| 역할 | 정의 | QA 대상 계정 | 상태 |
|---|---|---|---|
| Student | 시험 응시자 | student.1~3 | ✅ 계정 확보 |
| Writer | 질문(문항) 작성자, Question Bank 기반 | writer.1~3 | ✅ 계정 확보, 단 My Exams 의미 오인 |
| Teacher | 시험 운영자, 채점 | teacher.1~3 | ✅ 계정 확보 |
| SchoolAdmin | 학교 전체 운영자 | ❌ | 계정 필요 |
| Marker | 채점 전담 | ❌ | 계정 필요 |
| Assessor | Mock 질문 저자 | ❌ | 계정 필요 |
| Manager | 플랫폼 관리자 | manager.1 | ⚠️ 부분 캡처만 |
| Admin | 최고 관리자 | ❌ | 계정 필요 |

→ **4개 역할 (SchoolAdmin, Marker, Assessor, Admin) 이 이번 QA 에서 전혀 다뤄지지 않음.**

### 2-2. 역할 × 화면 커버리지

**범례**: ✅ 캡처됨 · ⚠️ 부분 · ❌ 미캡처 · **N/A** 해당 역할 범위 아님

| 화면 / 기능 | Student | Writer | Teacher | SchoolAdmin | Marker | Assessor | Manager | Admin |
|---|---|---|---|---|---|---|---|---|
| Landing | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Sign In | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Sign Up (teacher/student 2-way) | ❌ | ❌ | ❌ | — | — | — | — | — |
| Password Reset | ❌ | ❌ | ❌ | — | — | — | — | — |
| 404 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dashboard — Practice Exams (student view) | ✅ | **N/A** | **N/A** | — | — | — | — | — |
| Dashboard — My Practice Exams + 통계 5카드 | **N/A** | **N/A** | ⚠️ (모달로 가려짐) | ❌ | **N/A** | ❌ | ❌ | ❌ |
| Dashboard — All Practice Exams (필터) | **N/A** | **N/A** | ❌ | ❌ | **N/A** | ❌ | ❌ | ❌ |
| Dashboard — Mock Exam Periods (accordion) | ❌ | **N/A** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dashboard — In-progress Exam Banner | ❌ | — | — | — | — | — | — | — |
| Exam 응시 (Reading → Writing → Submit) | ❌ | — | — | — | — | — | — | — |
| Exam 상세/미리보기 | — | ⚠️ My Exams 카드 내 View | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Exam | — | ✅ (writer 스펙) | ✅ (teacher 스펙) | ❌ | — | ❌ | ✅ (teacher route 공유) | ❌ |
| My Exams (lifecycle Draft~Graded) | — | ✅ (단 Question Bank 기반, 오인됨) | ❌ | ❌ | — | ❌ | ❌ | ❌ |
| Question Bank | — | ❌ | ❌ | ❌ | — | ❌ | ❌ | ❌ |
| Marking (채점) | — | — | ❌ | ❌ | ❌ | — | ❌ | ❌ |
| Score Report (목록) | ✅ | — | — | — | — | — | — | — |
| Score Report (상세) | ❌ | — | — | — | — | — | — | — |
| Score Calculator | ✅ | — | — | — | — | — | — | — |
| Subjects (학생) | ✅ | — | — | — | — | — | — | — |
| Classroom | — | — | ✅ | ❌ | — | — | — | — |
| Profile | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notification | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Instructions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Payment (Billing) | ✅ (placeholder) | — | — | — | — | — | — | — |
| User Management (User/School/Inquiry) | — | — | — | ❌ | — | — | ❌ | ❌ |
| Content Management (Question Category/Subjects) | — | — | — | ❌ | — | ❌ | ❌ | ❌ |
| Mock Exam Sequence / List / Practice Exam List / Writer Question List | — | — | — | ❌ | ❌ | ❌ | ❌ | ❌ |

**핵심 누락 Top 10** (P0/P1):
1. **학생 시험 응시 전체 플로우** (Reading → Writing → Submit → Grade released) — 핵심 기능, 전혀 캡처 안됨
2. Teacher Marking 페이지 — 채점이라는 주요 기능 미확인
3. Question Bank (Writer · Teacher 양쪽)
4. Mock Exam Periods accordion (전 역할)
5. In-progress Exam Banner (Student)
6. Manager User/Content Management 서브 페이지 11개
7. 404 / Password Reset / Sign Up 플로우
8. SchoolAdmin / Marker / Assessor / Admin 계정 자체 미확보
9. Score Report 상세 페이지
10. 반응형 전 브레이크포인트

---

## 3. Week Plan — 8주 (2026-04-21 ~ 2026-06-15)

> P0 Hotfix 먼저, 재캡처로 데이터 확보, 이후 누락 화면·반응형 보강. 디자인 시스템은 이와 **병렬로 가볍게** 진행.

### Week 1 (04/21–04/27) · Foundation & 재캡처 인프라

- [ ] `capture.js` 확장: navigation timing, LCP, console error, failed requests 수집
- [ ] 추가 역할 계정 확보 문의 (SchoolAdmin / Marker / Assessor / Admin) — Alex 또는 운영팀
- [ ] Welcome Modal 자동 스킵 로직 추가 (teacher 재캡처용)
- [ ] 반응형 캡처 스크립트: 1440 / 1024 / 768 / 414 4단계
- [ ] Notion Wiki 표준(TL;DR/Metadata/Non-goals/Key Decisions/🔧 Engineer divider) 에 맞춰 기존 QA 리포트 포맷 조정

### Week 2 (04/28–05/04) · DEV Probe P0 Hotfix + 2차 재캡처

> 2026-04-19 `capture_v2.js` DEV 프로브에서 **사이드바가 404 로 연결되는 10개 경로** · **deep-link 강제 리다이렉트** · **`?onboarding=true` 강제 쿼리** 발견 (상세: [dev_probe_findings.md](dev_probe_findings.md)). Week 2 는 재캡처 이전에 라우팅 P0 먼저 해결.

**P0 Hotfix (순서 중요)**

- [ ] **IA-01** 사이드바 10개 404 경로 처리 결정 — (a) 기능 구현 / (b) href 교정 / (c) 사이드바에서 숨김
  - Teacher: `/teacher/question-bank`, `/teacher/marking`, `/teacher/my-exams`
  - Writer: `/writer/question-bank`
  - Manager: `/manager/question-bank`, `/manager/my-exams`, `/manager/mock-exam-sequence`, `/manager/mock-exam-list`, `/manager/practice-exam-list`, `/manager/writer-question-list`
- [ ] **IA-02** Deep-link 가드 수정 — 세션 로드 전 `router.replace('/dashboard')` 조건부화. Student 8/8, Teacher/Writer/Manager 각 5~9개 경로 공유 증상
- [ ] **IA-03** Teacher `?onboarding=true` 강제 쿼리 제거 (서버 or client) — 모달 persistence (T-01) 근본 원인
- [ ] **IA-04** Writer `/dashboard` 진입 차단 — `/writer/my-exams` 로 server-side redirect (D-1 결정 선행)
- [ ] **IA-05** 404 페이지 revision-purple CTA + 사이드바 유지형으로 재설계
- [ ] C-01 Writer Create Exam Exam Specifications 필드 렌더
- [ ] L-01 Teacher Welcome Modal Step 2 Loading 버그
- [ ] P-01 Payment Management placeholder 교체

**재캡처 (Hotfix 후)**

- [ ] `capture_v2.js` skipModal 매칭 규식을 실제 Skip Tutorial 버튼 텍스트로 정정
- [ ] Teacher Dashboard 실제 렌더 확인 (모달 스킵 후, My Practice + All Practice 2섹션)
- [ ] Teacher Marking 페이지 / Question Bank / My Exams 캡처 (IA-01 후)
- [ ] Manager 사이드바의 11개 서브 페이지 전수 캡처 (IA-01 후)
- [ ] Student 시험 응시 플로우 E2E 캡처 (테스트 exam 필요)
- [ ] Mock Exam Periods accordion 렌더 확인
- [ ] 404 / Password Reset / Sign Up 진입 캡처

### Week 3 (05/05–05/11) · UX 기본 이슈 일괄 정리

- [ ] C-03 Notification 카드 메타(time/sender/type/read) 추가
- [ ] G-01 Score Report 사이드바 스케일 버그 원인 추적 + 수정
- [ ] G-02 Manager 사이드바 ellipsis/너비 조정
- [ ] P-04 알림 벨 상태 동기화 (빈 상태면 점 숨김 + aria-label)
- [ ] P-05 Teacher 이름 fallback 개선
- [ ] A-04 Writer Create Exam eager validation → on-blur/on-submit 으로 전환

### Week 4 (05/12–05/18) · 누락 화면 설계 (역할 × 화면 matrix 기반)

- [ ] Student 시험 응시 화면 UX 스펙 (Reading/Writing 타이머, 자동 저장, Submit 확인)
- [ ] Student Score Report 상세 페이지
- [ ] Teacher Marking 페이지 UX 스펙 (채점 큐, 개별 응시자 화면, 피드백 입력)
- [ ] Question Bank (Writer 제작 + Teacher 참조) UX 스펙
- [ ] 404 페이지 구현
- [ ] Sign Up 2-way (teacher/student) 플로우 분리
- [ ] Password Reset 플로우

### Week 5 (05/19–05/25) · Manager 관리 화면 채우기

- [ ] User Management (User 리스트 + 상세 + Invite)
- [ ] School 리스트 + 상세
- [ ] Inquiry 리스트 + 상세
- [ ] Content Management: Question Category · Subjects CRUD
- [ ] Mock Exam Sequence / List / Practice Exam List / Writer Question List 4화면

### Week 6 (05/26–06/01) · 반응형 본격화

- [ ] Landing / Sign In 반응형 (1024/768/414)
- [ ] Dashboard 반응형 — 카드 그리드 3→2→1 col
- [ ] 사이드바 → 모바일 햄버거 drawer
- [ ] Teacher Create Exam / Marking 반응형 (데스크톱 전용 유지 결정 시 제외)
- [ ] Student 시험 응시 화면 모바일 우선 설계 (학생 모바일 사용 비중 큼)

### Week 7 (06/02–06/08) · 디자인 시스템 경량 보강 (병렬)

- [ ] Focus ring 단일 토큰 (`--ring-brand` = `revision-500`) 도입 → 전 컴포넌트 적용
- [ ] Save Changes 초록→보라 (S-04)
- [ ] Manager focus 시안→보라 (M-07)
- [ ] Brand 표기 최종 결정 → 로고/이메일/문서 단일화
- [ ] `/teacher/exam/create` 라우트 정리 (M-06)

### Week 8 (06/09–06/15) · 회귀 QA + 릴리즈 준비

- [ ] `qa/scripts/run_all.sh` 전체 재실행 (10+α 계정)
- [ ] Before/After diff 비교 리포트
- [ ] 잔여 P1/P2 정리
- [ ] Phase 2 (디자인 시스템 대폭 확대 / 옵션 B 역할 통합) 킥오프 문서 초안

---

## 4. Key Decisions — Alex 확인 필요

| # | 결정 사항 | 선택지 | 블로킹? |
|---|---|---|---|
| D-1 | Writer 의 `/dashboard` 진입 허용 여부 | (a) 제거하고 `/writer/my-exams` 로 리다이렉트 / (b) Writer 전용 대시보드 신설 | 🔴 Week 2 전 |
| D-2 | SchoolAdmin · Marker · Assessor · Admin 테스트 계정 발급 | Alex 가 운영팀에 요청 | 🔴 Week 2 전 |
| D-3 | Student 시험 응시 플로우 E2E 테스트용 exam 생성 가능한가 | manager/teacher 계정으로 테스트 exam 세팅 | 🔴 Week 2 전 |
| D-4 | 반응형 우선순위 — 모바일 중심(학생) or 데스크톱 균등 | 학생만 모바일 우선 + 교사/매니저는 데스크톱 | 🟡 Week 6 전 |
| D-5 | 이 폴더(👾Revisionary👾) 와 실제 프로덕트 저장소 관계 | (a) 여기가 프로덕트 / (b) 별도 Next.js 저장소 / (c) 마케팅+디자인만 | 🔴 Week 1 전 |
| D-6 | 브랜드 표기 최종 | "Revisionary Online" / "RevisionaryOnline" / "Revision Online" 중 택1 | 🟡 Week 7 전 |
| D-7 | Manager 의 `/teacher/exam/create` 라우트 리팩터 범위 | (a) URL만 alias / (b) 역할별 분리 재설계 | 🟡 Week 7 전 |

## 5. Considerations

- **리소스**: 이 플랜은 프런트 1~2명 + 디자인 1명 + 제한적 백엔드 지원 전제. 실제 리소스에 따라 Week 단위 수축/확장 필요.
- **리스크**: Week 2 재캡처에서 **기대보다 많은 신규 버그 발견** 시 Week 3~4 가 밀림. 완충 버퍼 1주 확보 권장.
- **측정**: Week 1 에 capture.js 에 timing 수집이 들어가면 이후 모든 재캡처에서 **성능 회귀 자동 감지** 가능.
- **문서 포맷**: Notion Wiki 는 영어(NZ/AU) + Diátaxis + C4. 본 리포트는 한국어지만 이후 공식 문서는 영어 스탠다드 준수.

---

## 🔧 Below this line is for engineers

### capture.js 확장안 (Week 1)

```js
// page.metrics() + page.on('response') + LCP via PerformanceObserver
const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0]
  const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0]
  return {
    ttfb: nav.responseStart - nav.requestStart,
    domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
    loadEvent: nav.loadEventEnd - nav.startTime,
    lcp: lcp?.renderTime || lcp?.loadTime || null,
  }
})
```

### 재캡처 대상 URL 체크리스트 (Week 2)

```
# Teacher (모달 스킵 후)
/dashboard                     # My Practice + All Practice 두 섹션
/teacher/marking               # 채점 페이지
/teacher/question-bank         # Question Bank
/teacher/my-exams              # lifecycle 전체 (Draft~Graded)

# Student (테스트 exam 필요)
/exam/{examId}                 # 응시 시작
/exam/{examId}/reading         # Reading Time
/exam/{examId}/writing         # Writing Time
/exam/{examId}/submit          # 제출 확인
/score-report/{examId}         # 상세 리포트

# Manager (11 화면)
/manager/user /manager/school /manager/inquiry
/manager/question-category /manager/subjects
/manager/mock-exam-sequence /manager/mock-exam-list
/manager/practice-exam-list /manager/writer-question-list

# Public
/404 (존재하지 않는 경로 강제 진입)
/password-reset
/signup?role=teacher
/signup?role=student
```

### 반응형 브레이크포인트 (Week 6)

| 이름 | px | Tailwind | 주요 변화 |
|---|---|---|---|
| mobile-s | 375 | default | 사이드바 drawer, 카드 1 col |
| mobile-l | 414 | default | same |
| tablet | 768 | `md:` | 사이드바 drawer, 카드 2 col |
| laptop | 1024 | `lg:` | 사이드바 고정(collapsed), 카드 2~3 col |
| desktop | 1280 | `xl:` | 사이드바 확장, 카드 3 col |
| wide | 1440+ | `2xl:` | 기본 기준 |

---

## 다음 액션

Alex 가 D-1 ~ D-5 (🔴 블로커 5개) 확인 주시면 Week 1 즉시 착수. 특히 **D-5 (저장소 위치)** 는 실제 수정 PR 을 열 곳이 어딘지 결정하는 핵심. 답변 주시면 바로 다음 단계로 이동합니다.
