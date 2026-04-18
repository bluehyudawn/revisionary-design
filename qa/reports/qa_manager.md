# QA 리포트 — Manager 역할

**대상 계정**: manager.1
**캡처 경로**: `qa/screenshots/manager_manager.1/`
**Figma 참조**: `👩‍💻manager` (3689:588), `🤍create exam` (2724:2161)

---

## 0. 사이드바 구조 — 시스템 내 최대 권한

```
Menu
  └─ Dashboard
Exam
  ├─ Creation
  ├─ Question Bank
  ├─ My Exams
  ├─ Mock Exam Seque...(nce) ← 텍스트 잘림
  ├─ Mock Exam List
  ├─ Practice Exam List
  └─ Writer Question List
User Management
  ├─ User
  ├─ School
  └─ Inquiry
Content Management
  ├─ Question Category
  ├─ Subjects
  └─ Sign Out              ← 여기 Sign Out 배치
```

**이슈**:
- M-1 (P1). "Mock Exam Seque..." **라벨 잘림** — ellipsis 미적용, 한 글자 더 들어갈 공간 있음에도 끊김
- M-2 (P1). **Sign Out 이 Content Management 그룹 내부**에 배치 — writer/teacher/student 는 모두 사이드바 하단 독립 항목. 일관성 위반

---

## 1. Dashboard — "Practice Exams" 3-col 카드 그리드

스크린샷: `02_post_login.png`, `10_dashboard.png`

| 영역 | 관찰 |
|---|---|
| H1 "Practice Exams" | 보라 "Practice" + 검정 "Exams" (writer/student 와 동일 로직) |
| 3-col × 4+row 카드 그리드 | 각 카드: 과목 배지(색)/ Year 12 / 시험 번호(예 "20260412 01") / 과목명 / 일자 · 시간 / Reading(시각)/Writing(시각) / Submitted (n/n) / Marked (n/n) / 교사 이메일 |
| 상태 배지 | Submission Completed(주황) / Scheduled(노랑) |
| 진행률 바 | 각 카드 하단 얇은 라인 (Submitted %) |
| 하단 페이지네이션 | Previous / 1 · 2 · 3 / Next |
| 상단 바 | 작은 로고 + 알림 벨 + 프로필 — 좌측 로고가 **축소됨** |

**이슈**:
- M-3 (P2). 과목 배지 색상 (English 주황, Accounting 보라/회색, Specialist Math 노랑 등) — Student Dashboard 와 일관성 확인 필요
- M-4 (P2). 카드 정보 밀도가 매우 높음 — 스캐닝 리듬 설계 재검토 여지 (필수 vs 보조 정보 분리)
- M-5 (P2). Practice Exams(여기 dashboard) vs Practice Exam List(사이드바 별도 항목) 중복 여부 확인 필요

---

## 2. Create Exam (`/teacher/exam/create` — manager 접근)

스크린샷: `11_teacher_exam_create.png`, `12_menu_open.png`

Teacher 의 Create Exam 과 **동일한 UI** 가 manager 에게 노출됨. URL 도 `/teacher/exam/create` — **role-based URL prefix 가 혼란**.

| 관찰 | 상태 |
|---|---|
| 좌측 폼 + 우측 리치 에디터 2개 | Teacher 리포트 T-13 동일 이슈 |
| Reading/Writing Time focus outline | **시안/틸** (#14B8A6 계열) — 브랜드 보라와 다름 |
| Create Exam 버튼 | 페일 보라 Pill (비활성 스타일로 기본 상태 보임) |
| 배경 영역 좌측에 **푸른 그라디언트 아트워크** 잔상 | 카드 뒤로 불룩한 푸른 원/삼각 도형이 보임 — Figma create exam 프레임의 장식 일부인 것으로 추정 |

**이슈**:
- M-6 (P0). URL `/teacher/exam/create` 를 manager 가 사용하는 것은 IA 설계 결함. `/exam/create` 또는 `/admin/exam/create` 로 정리 필요
- M-7 (P1). Focus outline 시안 → 보라 정합 (Teacher T-11 과 동일 이슈)
- M-8 (P2). 장식 그라디언트 아트 — 기능 UI 와 관계없이 "떠다니는" 시각 요소. 프로덕션 화면인지 Figma 장식인지 재검토

---

## 3. Menu 확장 상태 비교

스크린샷: `12_menu_open.png`

- 사이드바를 확장하면 위 섹션 구조가 그대로 노출됨
- 아이콘+텍스트 대비 양호
- "Mock Exam Seque..." 잘림 확인 (M-1)

---

## 4. 미캡처/추가 확인 필요 화면

Manager 의 스크린샷은 단 3장(dashboard, create exam, menu open)만 확보됨. 사이드바의 User Management / Content Management 서브 페이지들은 이번 QA 에서 캡처되지 않았습니다.

```
Question Bank, My Exams, Mock Exam Sequence, Mock Exam List,
Practice Exam List, Writer Question List,
User, School, Inquiry,
Question Category, Subjects
```

→ **2차 캡처 권장** (capture.js 에 명시적 URL 순회 추가 or 내부 링크 재클릭 로직 확장)

---

## Manager QA Summary (우선순위)

**P0**
- M-6 `/teacher/exam/create` 라우트 재설계 (역할-라우트 분리)

**P1**
- M-1 사이드바 라벨 ellipsis / 더 긴 너비 허용
- M-2 Sign Out 위치 통일 (사이드바 하단 독립)
- M-7 Focus color 보라로 정합

**P2**
- M-3/M-4/M-5 카드 정보 밀도 · 과목 배지 체계 · 메뉴 중복 정리
- M-8 장식 그라디언트 재검토
- 2차 캡처로 나머지 관리 페이지 QA 수행
