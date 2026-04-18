# RevisionOnline DEV — 공통 디자인 QA 리포트

**캡처 일자**: 2026-04-19
**DEV 서버**: http://web.dev.revision.internal/
**대상**: writer.1~3, manager.1, teacher.1~3, student.1~3 (10개 계정)
**기준 Figma**: https://www.figma.com/design/yPGvpXitLDGlEg2ZFR9zCA/RevisionOnline
**분석 범위**: 역할별 주요 진입 화면, 사이드바, 공통 컴포넌트

---

## 핵심 발견 — 시스템이 4개의 개별 UI로 분리됨

현재 구현은 사실상 **4개의 독립된 UI 시스템**이 하나의 URL 아래에서 공존하고 있습니다. 공통 디자인 시스템 적용이 불완전해 역할 전환 시 전혀 다른 제품처럼 보입니다.

| 역할 | 사이드바 구조 | 강조색(Focus/Accent) | Primary 버튼 모양 |
|---|---|---|---|
| **writer** | Exam / Account (2그룹, 5항목) | 보라 (#6366F1 계열) | 그라디언트 보라 Pill + 화살표 |
| **teacher** | Menu / Exam / Account (추정 3그룹) | 보라 | 보라 Pill ("Add Exam") |
| **student** | Menu / School / Score / Billing / Account (5그룹) | 보라 | 보라 직사각형 / 초록 Pill(Save Changes) |
| **manager** | Menu / Exam / User Management / Content Management (4그룹, 13+항목) | **시안/틸** (#14B8A6 계열) | 보라 Pill (비활성 스타일) |

→ 같은 Primary Action임에도 **모양·색·상태 스타일이 서로 다름**. Manager 의 폼 Focus 컬러가 보라가 아닌 시안인 것이 대표적 모순.

---

## 1. 브랜딩 & 카피 불일치

| 이슈 | 증거 | 영향 |
|---|---|---|
| **서비스명 띄어쓰기** | 앱 로고: "Revisionary Online" (띄어쓰기) / 프로젝트 기록(메모리): "RevisionaryOnline" (붙여씀) / 도메인: `revisiononline.com.au` (Revisionary 자체가 없음) | 브랜드 혼선 — 3가지 표기 공존 |
| **이메일 도메인** | 실제 로그인 이메일: `@revisiononline.com.au` (Notion 가이드는 `@revisionaryonline.com.au`로 기재) | 가이드 문서 부정확 OR 도메인 전환 중 |
| **페이지 라우트 vs 타이틀** | URL `/notification` → H1 "**Notice**" (writer) | IA 명명 불일치 |
| **역할 vs 라우트** | manager 가 접근한 Create Exam 페이지 URL: `/teacher/exam/create` | 다역할이 동일 라우트 공유 — URL 설계 불명 |

---

## 2. 온보딩 모달이 로그인 시마다 자동 재출현

- **대상**: teacher.1, teacher.2, teacher.3 모두 로그인 직후 동일한 "Welcome to Revisionary Online!" 튜토리얼 모달 자동 출현 (writer/student/manager 에는 없음).
- **문제**:
  1. 모달 내부의 step 2 콘텐츠가 "Loading..." 상태로 고정(스크린샷에 포착됨)
  2. 매 로그인마다 표시 → 사용자가 계속 "Skip Tutorial"을 눌러야 함 (상태 비영속)
  3. 튜토리얼이 덮고 있는 아래 화면(my exams, classroom)은 독립적으로 이미 렌더된 상태 → 모달은 본질적인 가이드가 아닌 "추가 레이어"처럼 보임
- **권장**: 계정별 `hasSeenOnboarding` flag 저장, step 콘텐츠 로딩 실패 시 모달 자동 닫기 또는 재시도 UX.

---

## 3. 버튼 스타일 8종 이상 혼재

| 스타일 | 사용처 | 예시 |
|---|---|---|
| 솔리드 보라 사각 | writer Profile Update, student Profile Update, sign-in 제출 | `#6366F1` 60% hover |
| 솔리드 보라 **그라디언트 Pill + 화살표** | writer Create Exam 제출 | 그라디언트 + 우측 `›` 아이콘 |
| 페일 보라 비활성 Pill | manager/teacher Create Exam 제출 | 불투명 30% 느낌 |
| 검정 Pill (sort/tab active) | writer My Exams "All" 탭 | #000 배경 |
| 화이트 Outline Pill (tab inactive) | writer My Exams "Pending/Published/Draft" 탭 | 얇은 보더 |
| 빨강 Pill + 쓰레기통 아이콘 | writer My Exams Delete | `#EF4444` 계열 |
| Outline Pill + 펜 아이콘 | writer My Exams Continue Draft | 얇은 보더 + 아이콘 |
| **초록 Pill** | student Subjects "Save Changes" | `#22C55E` — 서비스 전체에서 이 화면에만 등장 |
| "Get started — it's free" Pill | 랜딩/사인인 최상단 | 보라 Pill |

**문제**: 의미 체계(Primary/Secondary/Destructive) 미정. 같은 "Primary 저장" 액션에 다른 시각이 붙어 사용자가 상태·중요도를 예측 불가.

---

## 4. 폼 · 인풋 일관성

| 항목 | 구현 상태 | Figma |
|---|---|---|
| Label 색 | 역할에 따라 혼재 (writer 회색, student/manager 보라) | 파운데이션 레이어에 라벨 컬러 토큰 존재 (Neutral/600/700) |
| "(optional)" 마커 | **보라색 링크 같은 스타일** — 필수 입력과 동등한 시각 우선순위 | — |
| Focus outline | writer/student/teacher = 보라 / manager = **틸** | 단일 토큰 기대 |
| 눈에 띄는 에러 | writer Create Exam 진입 즉시 "Subject is required" **빨강 문구 표시** (유저 입력 전 eager validation) | — |
| Disabled 인풋 | Email/Role 필드 배경이 약간 어둡지만 label 색·커서 상태가 동일 | disabled 토큰 불명확 |
| 한 줄짜리 Exam Specifications 필드 | writer Create Exam — 라벨만 표시, **본문 입력 영역 없음** (렌더 누락 의심) | manager 쪽은 리치 에디터로 구현됨 |

---

## 5. 헤더 & 사이드바

- **로고**: 풀 "Revisionary Online" 텍스트 + 아이콘 → 사이드바 확장 시. 축소 시에도 아이콘만 남는 토글이 있으나 manager 대시보드 스크린샷에서는 텍스트 크기가 작아 보임 (스케일 불일치).
- **사이드바 폭**: Figma 스펙 264px, 구현도 264px 근접 — 일치.
- **상단 바 높이**: Figma = 63px. 구현은 일관되어 보임. 단, 상단 우측 알림 벨에 **항상 빨간 점** 표시 → 읽지 않은 알림이 없어도 점이 보임 (상태 동기화 이슈 추정).
- **Sign Out 배치**: writer/teacher/student는 사이드바 맨 아래 / manager는 Content Management 섹션 내부에 Sign Out 배치 — 일관 깨짐.

---

## 6. 빈 상태(Empty State) 처리

| 화면 | 현재 빈 상태 | 문제 |
|---|---|---|
| writer Dashboard "Practice Exams" | 회색 박스 플레이스홀더 한 칸, 안내 텍스트 없음 | UX 설명 부재 |
| writer Instructions | "Instructions will be available soon" + 아이콘 — 비교적 양호 | (OK) |
| student Payment | "This page should include: ... Currently under development..." 개발자용 메모 그대로 노출 | **프로덕션 가드 미달**: 작업 중 메모가 최종 사용자에게 보이면 안 됨 |
| student Subjects → Mock Exam Periods | "No mock exam periods available for 2026" | 연도/조치 경로 없음 |

---

## 7. 접근성 & 사소한 버그

- 상단바 알림 벨: 빨간 점이 미읽음 배지 성격이나 텍스트/숫자 없음 → 스크린리더 지원 부족 추정.
- Profile 페이지 "Reset Password" 버튼이 **form 내부에 링크 형태로** 위치 → form submit(Update)과 동작이 다르나 시각적으로 동일 영역에 배치되어 오해 유발.
- 체크박스/토글(Sign in의 Remember me 등) 디자인 스펙이 역할 전반에서 비일관 — 추가 샘플링 필요.
- `/notification` 리스트 카드가 **카드 elevation 없음** → 목록 리듬 부족.

---

## 8. 역할별 핵심 리포트 링크

- [qa_writer.md](qa_writer.md)
- [qa_teacher.md](qa_teacher.md)
- [qa_student.md](qa_student.md)
- [qa_manager.md](qa_manager.md)
- [qa_public.md](qa_public.md) — 랜딩/사인인
- [2.0_direction.md](2.0_direction.md) — 2.0 디자인 방향성 옵션

---

## 캡처 매니페스트

모든 스크린샷은 `qa/screenshots/{role}_{user}/` 경로에 저장되어 있습니다.

```
qa/screenshots/
├── writer_writer.1/  (6 screens + landing + signin)
├── writer_writer.2/
├── writer_writer.3/
├── teacher_teacher.1/
├── teacher_teacher.2/
├── teacher_teacher.3/
├── student_student.1/
├── student_student.2/
├── student_student.3/
└── manager_manager.1/
```

캡처 스크립트: `qa/scripts/capture.js` · 실행: `qa/scripts/run_all.sh`
