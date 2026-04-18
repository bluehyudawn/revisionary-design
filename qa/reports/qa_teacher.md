# QA 리포트 — Teacher 역할

**대상 계정**: teacher.1, teacher.2, teacher.3
**캡처 경로**: `qa/screenshots/teacher_*/`
**Figma 참조**: `🤍dashboard` (2724:2162), `🤍classroom` (2724:15167), `🤍create exam` (2724:2161)

---

## 0. 사이드바 구조

```
Menu
  └─ Dashboard   ← active on login
School
  └─ Classroom
Exam
  ├─ Creation
  ├─ Question Bank
  ├─ Marking
  └─ My Exams
Account
  ├─ Profile
  ├─ Notification
  └─ Instructions
Sign Out        ← 맨 아래
```

로고: "Revisionary Online" 풀 텍스트. writer 보다 섹션 3→4개로 확장 (School 섹션 추가).

---

## 1. 로그인 직후 온보딩 모달

스크린샷: `02_post_login.png`, `11_teacher_class.png`

**모든 teacher 계정에서 동일 문제 재현** (teacher.1, teacher.2, teacher.3)

| 관찰 | 상태 |
|---|---|
| 대시보드 진입 즉시 전체 화면 모달 "Welcome to Revisionary Online! / Step 1" | 자동 출현 |
| 모달 내부: "Follow this tutorial to learn how to get started / 1. Click the Next button to continue / 2. You can skip the tutorial at any time..." | Step 1은 텍스트 안내 |
| Step 2 이상으로 이동 시 | **콘텐츠 영역이 "Loading..." 상태로 고정** (teacher.1 에서 재현) |
| 페이지네이션 도트 | 7단계 (많음) |
| Next / Skip Tutorial | 두 CTA 존재 |

**이슈**:
- T-1 (P0). **모달의 상태 비영속** — 로그아웃-재로그인 시 다시 출현 (teacher.1~3 전부 동일). 유저가 매번 "Skip Tutorial" 누르게 됨
- T-2 (P0). **Step 2 콘텐츠 Loading 무한 대기** 버그 (스크린샷에서 포착됨)
- T-3 (P1). 7단계 튜토리얼은 길다 — 핵심 3단계로 축약 권장
- T-4 (P2). Modal 내부에 **대시보드 미리보기(mini-app)** 가 포함되어 있어 실제 화면의 일부처럼 보여 혼란. 내부 미니앱은 인터랙티브해 보이지만 실제로는 튜토리얼 장식

---

## 2. Dashboard (`/dashboard` — teacher)

스크린샷: 모달 내부 미니앱 기준(실제 화면이 모달에 가려짐)

| 영역 | 관찰 | Figma 일치도 |
|---|---|---|
| "New to Revisionary Online?" promo 배너 | 그라디언트 배경 + "See Tutorial" 아웃라인 Pill | 브랜드 Accent gradient 사용 |
| H2 Body1_Medium "My Practice Exams" (회색) | **Neutral/400 #A1A1A1** | **✅ Figma dashboard 스펙과 일치** |
| H1 Bold "Welcome, Teacher 1010101" | 큰 타이틀 | OK |
| "+ Create Exam" | 보라 Pill | OK |
| 메트릭 카드 5개 | Marking required 7 [New] / Open 3 / Scheduled 0 / Access Closed 7 / All 10 | 스펙 확인 필요 |
| 3-col exam 카드 | 과목 아이콘 / 과목 배지 / 학년 / 상태 배지("Submission Completed") / 제목 / Ended 날짜 | 양호 |

**이슈**:
- T-5 (P2). "Teacher 1010101" 표시 — 이름(First Name)이 아닌 숫자/ID 표기 → 이름 미등록 fallback 문자열 노출 가능성
- T-6 (P2). 메트릭 카드의 [New] 뱃지가 보라 배경인데 다른 위치의 Published 뱃지(my exams)도 보라 — 의미 구분 어려움
- T-7 (P2). Writer Dashboard 와 비교 시 기능 격차가 매우 큼 — 역할별 Dashboard 개념 정립 필요

---

## 3. Classroom (`/teacher/class`)

스크린샷: `11_teacher_class.png`

| 영역 | 관찰 |
|---|---|
| (Welcome modal 여전히 표시됨) | Dashboard → Classroom 이동해도 모달 유지 |
| 상단 카드 "Welcome, Teacher 1010101" | 메트릭 3개: Classroom(3) / Student(7) / (10?) |
| "+ Add Exam" 보라 Pill (우상단) | Primary |
| "My Classroom" 섹션 | 카드 형식으로 반(class) 나열 — aec_class, Accounting U3&4 등 |
| Student List 테이블 | Select a class 드롭다운 / 검색 / ID · Email · Register 상태 · Edit 컬럼 |
| 우상단 액션 | "Invite Selected"(보라 아웃라인) / "Delete Selected"(빨강 아웃라인) / **"+ Add Student"** 보라 Pill |

**Figma 참조**: `🤍classroom` (2724:15167) — 캔버스 1920×2016, Stone/100 배경, Sidebar 264px. update class / other / add student / classroom 프레임 존재 (CRUD 상태 분리 설계됨).

**이슈**:
- T-8 (P1). 학생 리스트 테이블의 Email 컬럼이 **보라 링크 스타일** 인데 실제 클릭 동작 불명 (클릭 가능 여부 확인 필요)
- T-9 (P1). "Invite Selected" / "Delete Selected" 가 상단 우측 배치 → 선택 전부터 활성 상태로 보여 혼동 유발
- T-10 (P2). Classroom 카드의 시각 위계 — 아이콘·제목·학생 수만 표시되어 메타 정보 빈약

---

## 4. Create Exam (`/teacher/exam/create`)

스크린샷: `12_teacher_exam_create.png`

| 영역 | 관찰 |
|---|---|
| H1 "Add Exam Information" | Bold Large |
| 부제 "Fill in the exam details below." (우측) | 우측 정렬 |
| 좌측 열: Subject / Class(optional) / Exam Name / Reading Time(mins) / Writing Time(mins) / Datasheets(optional) / Upload | — |
| 우측 열: **Exam Specifications (optional)** 리치 에디터(16px, A/A/T/B/I/U/S, 헤딩, 리스트, 테이블) | — |
| 우측 열: **Exam Details (optional)** 리치 에디터 (2번째) | — |
| Datasheets 영역 | "Please select a subject first before uploading files." (점선 박스) |
| Create Exam 버튼 | **페일 보라 Pill** (비활성/반투명 스타일) 우하단 |

**Figma 참조**: `🤍create exam` (2724:2161)

**이슈**:
- T-11 (P0). Reading Time, Writing Time 포커스 시 **시안/틸 색상 outline** (`#14B8A6` 계열) — 서비스 전반 보라와 **완전히 다른 색상**. 디자인 시스템 위반
- T-12 (P1). Create Exam 버튼이 기본 상태에서부터 페일한 색으로 보여 유저가 클릭 가능 여부 판단 어려움
- T-13 (P2). 좌측 일반 폼 / 우측 리치 에디터 2개 — 레이아웃 균형이 맞지 않음(우측 훨씬 김) → 스크롤 위치 혼란
- T-14 (P2). Writer 의 Create Exam 과 완전히 다른 디자인/필드/플로우 — 동일 개념인데 **두 개의 서로 다른 화면** 존재 (unified design 필요)
- T-15 (P2). 데이터시트 업로드 패턴: "주제 선택 후 업로드" — 주제 의존성 UX 가이드 부족

---

## Teacher QA Summary (우선순위)

**P0**
- T-1 Welcome modal 상태 영속화 + dismiss 기억
- T-2 Step 2 "Loading..." 버그 해결
- T-11 Create Exam 폼 focus color 시안 → 보라로 정합

**P1**
- T-3 튜토리얼 단계 단축 (7 → 3)
- T-8 Email 링크 클릭 동작 명확화
- T-9 일괄 액션 버튼 위치·활성화 조건 재검토
- T-12 Create Exam CTA 활성/비활성 대비 강화
- T-14 Writer 와 Create Exam 디자인 통합

**P2**
- T-5 Teacher 이름 fallback 개선 ("1010101" 대신 full name or "Teacher" + email)
- T-6/T-15 배지/Datasheet UX 스펙 정의
- T-4/T-7/T-10/T-13 레이아웃·미니앱 정비
