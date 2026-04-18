# QA 리포트 — Writer 역할

**대상 계정**: writer.1, writer.2, writer.3
**캡처 경로**: `qa/screenshots/writer_*/`
**Figma 참조**: `🤍create exam` (2724:2161), `🤍my exam` (3691:26920), `🤍profile` (2724:2160), `🤍writer` (2819:4065)

---

## 0. 사이드바 구조

```
Exam
  ├─ Create Exam   ← 보라 활성 탭 (Pill)
  └─ My Exams
Account
  ├─ Profile
  ├─ Notification
  └─ Instructions
[Sign Out]         ← 맨 아래
```

로고: 좌상단 "Revisionary Online" + 그라디언트 삼각 아이콘. 사이드바 ~264px.

---

## 1. Dashboard (post-login = `/dashboard`)

스크린샷: `02_post_login.png`

| 관찰 | 상태 |
|---|---|
| H1 "Practice Exams" — "Practice"(보라) + "Exams"(검정) 혼색 | 브랜드 강조 OK, 단 Figma dashboard 스펙의 "My Practice Exams" (Neutral/400 회색) 와 불일치 |
| 콘텐츠: **회색 빈 박스 1개** | Empty state 설명·CTA 없음 |
| 좌상단 햄버거 메뉴 토글 | 사이드바 접힘 제어 (기능 존재 확인) |
| 상단 우측 알림 벨 · 프로필 아이콘 | 벨에 항상 빨간 점 — 미읽음 없을 때도 표시됨 |

**이슈**:
- B-1. Writer 의 Dashboard가 실질적으로 **비어 있음** — 로그인 직후 다음 행동 유도 없음
- B-2. "Practice Exams" 헤더가 섹션 타이틀인지 페이지 타이틀인지 모호
- B-3. Figma 의 dashboard 프레임(2724:2162)은 student 용으로 설계되어 있고, writer 전용 대시보드 스펙은 명시적으로 존재하지 않는 것으로 보임 → **writer용 대시보드 디자인 자체가 결정되지 않은 상태로 임시 구현**

---

## 2. Create Exam (`/writer/exam/create-exam`)

스크린샷: `10_writer_exam_create_exam.png`

| 영역 | 관찰 |
|---|---|
| Subject 드롭다운 | "Select subject" 플레이스홀더 + 화살표 |
| **"Subject is required"** | 페이지 로드 직후부터 빨간색으로 노출 (eager validation) |
| Title 라벨 / Enter **group** title 플레이스홀더 | 라벨-플레이스홀더 용어 불일치 ("Title" vs "group title") |
| Reading Time / Writing Time | 사이드 바이 사이드, 기본값 15 / 60 |
| **Exam Specifications (optional)** | 라벨만 존재, 입력 필드 **미렌더** |
| Overall Comment (optional) | 인풋 본문은 렌더됨. 상단 설명에 **bold** 강조 구문("not be visible..." / "appear on their score report...") |
| Create 버튼 | 보라 그라디언트 Pill + "›" 아이콘, 카드 **바깥** 우하단 배치 |

**이슈**:
- W-1. Eager validation: 사용자 입력 전에 에러 문구가 표시 → 신뢰도 저하
- W-2. Exam Specifications 필드 렌더 누락 또는 스펙 부재
- W-3. "Title" 라벨과 "group title" 플레이스홀더 용어 모순
- W-4. `(optional)` 마커가 보라색 링크 스타일 → 시각 우선순위 과대
- W-5. Primary 버튼이 다른 writer 화면(Profile Update)의 버튼과 모양이 다름 (Pill+화살표 vs 직사각형)

---

## 3. My Exams (`/writer/my-exams`)

스크린샷: `11_writer_my_exams.png`

| 영역 | 관찰 |
|---|---|
| 상단 탭 | **All**(검정 Pill active) / Pending / Published / Draft (각 화이트 Pill) |
| Exam 카드 | 제목(과목, Bold) / 날짜 · 단원 / 내부 타이틀(예: "Writer_Test_jake2") / Total Questions (N) / **Delete**(빨강 Pill) + **Continue Draft**(Outline Pill) 또는 **View**(Outline Pill) |
| 상태 배지 (우상단) | Draft = 회색 / Published = 보라 배경 |
| 카드 구분 | 얇은 호리즌탈 디바이더 + 여백 |

**이슈**:
- W-6. Delete 버튼이 **빨강 솔리드 Pill** 로, 공격적 시각(destructive primary). 실수 클릭 방어 확인 필요 (확인 다이얼로그 존재 여부 미확인)
- W-7. 카드에 **Elevation 없음** — Figma myDetailPage 프레임의 카드 스펙과 일치하는지 추가 검증 필요
- W-8. 상단 탭이 **Black Active** 디자인 — 사이드바 활성탭(보라) 및 다른 곳의 Primary(보라) 와 다른 컬러 로직

---

## 4. Profile (`/profile`)

스크린샷: `12_profile.png`

| 필드 | 구현 |
|---|---|
| Email / Role | disabled 배경, 보라 라벨 |
| First/Middle/Last Name | 일반 인풋 |
| Phone / Address / Postcode | 일반 인풋 |
| State / Local Time Zone | Select (X 클리어 + 화살표 토글 아이콘) |
| Reset Password | 보라 링크 + ↻ 아이콘 (form 내부) |
| **Update** | 보라 **직사각형** 버튼 (Pill 아님) |

**이슈**:
- W-9. Update 버튼 모양이 Create Exam 의 Pill 과 모순
- W-10. Reset Password 가 form 내 링크로 배치 — Update 와 시각 우선순위 차별화 필요
- W-11. 모든 라벨이 **보라색** — 본 사이트의 본문 텍스트 색과 다른 레벨, 계층 독해 방해
- W-12. Writer Profile 은 `School`, `School Year` 등 학생용 필드가 없어 적절해 보이나 **avatar 업로드 영역 부재**

---

## 5. Notification (`/notification`)

스크린샷: `13_notification.png`

| 항목 | 관찰 |
|---|---|
| 페이지 타이틀 | **"Notice"** (URL 은 /notification) |
| 단일 테스트 레코드 | "test by jake" / 본문 "ggg" |
| 카드 스타일 | 얇은 보더, **elevation 없음** |
| 시간·보낸이·타입 메타 정보 | **없음** |
| 읽음/안읽음 구분 | 없음 |

**이슈**:
- W-13. 타이틀-라우트 명명 불일치
- W-14. 카드 메타데이터 전무 → 가이드라인 수준의 기본 알림 UX 미달

---

## 6. Instructions (`/instructions`)

스크린샷: `14_instructions.png`

"Instructions will be available soon" placeholder + 블루 문서 아이콘. 콘텐츠 미개발 상태. Placeholder 디자인 자체는 양호.

---

## Writer QA Summary (우선순위)

**P0 (릴리즈 전 차단)**
- W-1 Eager validation 제거 or 인터랙션 기반으로
- W-2 Exam Specifications 렌더 누락

**P1 (일관성/브랜드)**
- W-5/W-9 Primary 버튼 단일화 (Pill or 사각 중 택일)
- W-3 Title/group title 용어 정합
- W-13 Notification/Notice 네이밍 정합
- W-11 Label 컬러 정합

**P2 (UX 개선)**
- B-1 Dashboard 빈 상태 개선 — CTA("Create your first exam") 추가
- W-6 Delete 확인 다이얼로그 확인
- W-14 Notification 카드 스펙 정의 (메타 + 읽음 상태)
- W-12 Avatar 업로드 영역 여부 결정

**P3 (Figma 정합)**
- Writer 전용 dashboard 디자인 확정 (현재 Figma 부재로 추정)
