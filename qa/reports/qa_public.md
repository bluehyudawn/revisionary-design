# QA 리포트 — Public (Landing / Sign In)

**캡처 경로**: `qa/screenshots/writer_writer.1/00_landing.png`, `01_signin.png`
**Figma 참조**: `Landing` (46:2940), `👩‍💻Sign In & Up` (4514:5873)

---

## 1. Landing (`/`)

스크린샷: `00_landing.png` (1440×900, fullPage)

| 영역 | 관찰 |
|---|---|
| 상단 네비게이션 | 로고 "Revisionary Online" + Score Calculator / VCE Schedule / Features / Contact / News / Sign In / **"Get started — it's free"** 보라 Pill |
| 히어로 | 학생 배낭 사진 위에 frosted glass 효과, 우측에 카드가 덮임 |
| 전체 랜딩 하단 | 추가 캡처 대상 — 현재는 상단 뷰 위주 |

**이슈**:
- L-1 (P2). 네비게이션 아이템 7개 + CTA — 모바일 반응형 캡처 필요 (이번 QA 는 1440 데스크톱만)
- L-2 (P2). "Sign In" 은 검정 텍스트 / "Get started" 는 보라 Pill — 인증 관련 CTA 두 개가 인접한데 시각 차별 적절. OK
- L-3 (P2). 로고가 "Revisionary Online" 띄어쓰기 — 메모리 기록(RevisionaryOnline 붙여쓰기) 과 불일치 (qa_common.md 브랜딩 이슈 참고)

---

## 2. Sign In (`/signin`)

스크린샷: `01_signin.png`

| 영역 | 관찰 |
|---|---|
| 배경 | 학생 그룹 사진, 약간의 블러/오버레이 |
| 로그인 카드 | 중앙 우측, 화이트 배경, Rounded |
| H1 "Sign In" | Bold 중앙 정렬 |
| 부제 "Revisionary Online" | 보라 accent 소형 텍스트 |
| 라벨 "User Email" / "Password" | 보라 텍스트 |
| Input | 기본 border, 이메일 required, password type |
| "Remember me" 체크박스 | 좌측 |
| **Sign in** 버튼 | 솔리드 보라 직사각형, 풀 폭 |
| 하단 링크 | "Forgot Password" (중앙) / "Register as teacher \| student" (중앙) |

**이슈**:
- P-1 (P1). Password 인풋 우측 **👁 보이기/숨기기 토글** 가 활성 상태로 보이지만 (눈 아이콘 표시됨) — 기본적으로 비밀번호 가시성은 클릭 시 전환이라야 함. 아이콘 상태 확인 필요
- P-2 (P2). "Register as teacher | student" 한 줄 텍스트 — **두 CTA 를 "|" 로 구분**. 각각 별도 라우트(`/signup`, `/register-student`)로 이동하는지 확인 필요. 파이프 구분자보다 버튼 2개 UX 가 명확
- P-3 (P2). 부제 "Revisionary Online" 이 보라색인데 랜딩 로고 텍스트는 검정 — 브랜드 컬러 적용 규칙 정립 필요
- P-4 (P1). 로그인 실패 시 에러 피드백 패턴은 이번 QA 에서 확인하지 못함 — 별도 시나리오 테스트 필요

---

## 3. 404 에러 페이지

Figma `404error` 캔버스 (4646:9202) 존재. 구현은 미확인.
추가 QA: 존재하지 않는 경로 접속 → 4xx 반응 캡처 필요.

---

## 4. 로그아웃 → 랜딩 리다이렉트

**미테스트** — Sign Out 클릭 후 리다이렉트 목적지(/ vs /signin) 및 세션 정리 확인 필요.

---

## Public QA Summary

**P1**
- P-1 Password 토글 기본 상태 정합
- P-4 로그인 실패 에러 메시지 UX 검증

**P2**
- P-2 Register 2-way CTA 를 버튼 2개로 분리 권장
- P-3/L-3 브랜드 텍스트 컬러 표기 규칙
- L-1 모바일 반응형 별도 QA 진행

**추가 QA**
- 404 구현 확인
- 회원가입 플로우 (signup / register-student)
- 비밀번호 재설정 (forgot-password)
