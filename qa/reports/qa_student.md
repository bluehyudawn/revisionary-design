# QA 리포트 — Student 역할

**대상 계정**: student.1, student.2, student.3
**캡처 경로**: `qa/screenshots/student_*/`
**Figma 참조**: `🤍dashboard` (2724:2162), `🤍score report (student)` (3122:9728)

---

## 0. 사이드바 구조

```
Menu
  └─ Dashboard   ← active on login
School
  └─ Subjects
Score
  ├─ Score Report
  └─ Score Calculator
Billing
  └─ Payment
Account
  ├─ Profile
  ├─ Notification
  └─ Instructions
Sign Out
```

5개 섹션 — 시스템 내 가장 긴 사이드바. Writer 의 2 섹션과 대비됨.

---

## 1. Dashboard (`/dashboard` — student)

스크린샷: `02_post_login.png`, `10_dashboard.png`

| 영역 | 관찰 | Figma 일치도 |
|---|---|---|
| H1 "Practice Exams" | Bold (보라 "Practice" + 검정 "Exams") | Figma 스펙: H2 Body1_Medium Neutral/400 — **불일치** |
| 3-col exam 카드 그리드 | 각 카드: 과목 배지(색상)/학년/"Completed"(녹) 배지/제목/날짜/Reading·Writing 시간/Submitted/Marked 메트릭/교사 이메일 | 풍부 |
| 페이지네이션 | Previous / 1 · 2 / Next | 하단 |
| 상단 우측 | 알림 벨 + 프로필 아이콘 | 벨 빨간점 항상 |

**이슈**:
- S-1 (P1). Dashboard H1 스타일이 Figma 의 Neutral/400 Body1_Medium 스펙과 다름 (구현은 Bold Heading)
- S-2 (P2). 과목 배지 색상 체계 불명 — English 보라, Accounting 노랑, Specialist Math 회색 등 → 랜덤 또는 과목별 고정인지 명세 필요
- S-3 (P2). Student 의 Dashboard 는 teacher 의 "My Practice Exams" 와 매우 유사하지만 Welcome 카드/메트릭 행이 없음 — 역할 간 일관성 고려 대상

---

## 2. Subjects (`/student/subjects`)

스크린샷: `11_student_subjects.png`

| 영역 | 관찰 |
|---|---|
| H1 "Select Your Subjects" + 서브텍스트 "Select the subjects you want to study." | 명확 |
| 좌측 카드: **Required Subjects** (English + Subject 2~4) / **Optional Subjects** (Subject 5~6) | 아코디언 드롭다운 |
| 우측 정보 박스 "Required Subjects Needed" | 파스텔 블루 배경, ⓘ 아이콘, 완료 후 결과 리스트 |
| **Save Changes** 버튼 | **초록 Pill** (#22C55E 계열) — 서비스 전체에서 유일한 초록 Primary |
| 하단 "Mock Exam Periods" 카드 | "Available mock exam periods for 2026 / No mock exam periods available for 2026" |

**이슈**:
- S-4 (P0). **Save Changes 가 초록색** — 다른 모든 Primary 는 보라. 디자인 시스템 위반, 즉시 정합 필요
- S-5 (P1). Score Calculator 화면(13번)과 **거의 동일한 레이아웃·카피** — 차이가 불명. "Subjects" 가 데이터 저장, "Score Calculator" 가 계산 결과/시뮬레이션이라면 명명·UI 분리 명확화 필요
- S-6 (P2). Required 정보 박스의 "Select English subject" 와 "Select 3 more required subjects (0/3)" — 둘 다 같은 주황 ⓘ 아이콘이지만 영어는 특별 취급(1개 특정) → 현재 카피로는 왜 별도인지 불명
- S-7 (P2). 빈 Mock Exam Periods — 연도 전환/문의 경로 없음

---

## 3. Score Report (`/score-report`)

스크린샷: `12_score_report.png`

| 영역 | 관찰 |
|---|---|
| 상단 필터 | "Marking Status (All)" 드롭다운 — 전체 폭 |
| 테이블 컬럼 | # / Subject / Marking Status / Year / Subject Name / Submit Date / Marking Date / Report |
| 상태 배지 | Completed = 녹/Waiting = 회색 |
| Report 컬럼 | 완료된 행에만 📄 아이콘 (클릭 액션은 확인 필요) |
| 페이지 전체 | **사이드바가 유난히 좁음**(아이콘 + 텍스트 소형) → 동일 뷰포트임에도 다른 화면보다 사이드바 폭이 다르게 렌더링될 가능성 (CSS 불일치) |

**이슈**:
- S-8 (P1). 사이드바 폭/타이포 스케일이 **대시보드 대비 축소된 것으로 보임** — 스크린샷 비교 필요 (1440 동일 뷰포트에서 캡처)
- S-9 (P1). "Marking Status" 필터만 존재 — Year/Subject/기간 필터 부재 (사용자 기록이 많아지면 탐색 어려움)
- S-10 (P2). Report 아이콘 — 파일 유형(PDF?) 명시 없음, hover tooltip 확인 필요
- S-11 (P2). 날짜 포맷 "18/APR/2026 23:39" — 대/소문자 혼합, 시각 포함 → 가독성 개선 여지

---

## 4. Score Calculator (`/student/score-calculator`)

스크린샷: `13_student_score_calculator.png`

Subjects 화면과 UI 가 거의 동일. "Save Changes" 버튼이 **없음** (저장 개념 부재, 계산기 성격).

**이슈**:
- S-12 (P1). Subjects(11) 와 Score Calculator(13) 의 **시각 차별화 부재** — 사용자가 두 메뉴의 목적 구분 어려움
- S-13 (P2). ATAR 계산 결과가 실시간 노출되는 영역 디자인 확인 필요 (현재 빈 상태만 캡처)

---

## 5. Payment Management (`/payment-management`)

스크린샷: `14_payment_management.png`

현재 상태: **개발 중 placeholder**

```
Payment Management
This page should include:
 • Payment history and transaction records
 • Retry failed or incomplete payments
 • Invoice downloads and receipts
 • Subscription and billing management
 • Etc...
Currently under development...
```

**이슈**:
- S-14 (P0). **개발 메모가 최종 사용자에게 그대로 노출** — 명세 bullet list 가 유저에게 보이면 안 됨. 일반 placeholder ("Payment management is coming soon.") 로 대체 필요
- S-15 (P1). Payment 는 유료화 경로 — 2.0 단계에서 실제 결제·구독 모델 결정 필요

---

## 6. Profile (`/profile`)

스크린샷: `15_profile.png`

| 추가 필드 (writer 대비) | 값 예시 |
|---|---|
| School | Revisiononline |
| School Year | Year 12 |
| Class | (빈칸) |
| VCAA Number | (빈칸) |

- 이메일: `student.1@revisiononline.com.au`
- Role: "Student" disabled
- "Reset Password" 보라 링크 / "Update" **보라 직사각형 버튼**

**이슈**:
- S-16 (P1). 역할별 프로필 필드 확장이 **잘 구현됨**(School/Year/Class/VCAA) → 이 패턴을 teacher/manager 쪽에도 적용 검토
- S-17 (P2). "Class" 필드는 빈 인풋 — Classroom 에 배정되면 자동 채움인지 사용자 직접 입력인지 불명

---

## 7. Notification / Instructions

Writer 와 동일 이슈 (qa_writer.md W-13/W-14 참고). Student 전용 차이 없음.

---

## Student QA Summary (우선순위)

**P0**
- S-4 Save Changes 버튼 보라로 정합
- S-14 Payment Management 플레이스홀더 교체

**P1**
- S-1 Dashboard 타이포 스펙 Figma 일치
- S-5/S-12 Subjects vs Score Calculator 시각/카피 차별화
- S-8 Score Report 사이드바 스케일 버그 확인
- S-9 Score Report 필터 확충
- S-16 학생용 프로필 확장 패턴의 다른 역할 적용 검토

**P2**
- S-2 과목 배지 색상 체계 문서화
- S-11 날짜 포맷 표준
- S-7/S-10/S-13/S-17 상세 UX 결정
