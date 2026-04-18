# RevisionOnline DEV QA — 2026-04-19

## 개요
DEV 서버(http://web.dev.revision.internal/)의 실제 화면을 **헤드리스 크롬**으로 10개 계정에 로그인 · 캡처한 뒤, Figma 디자인 파일과 대조해 작성한 QA 리포트 모음입니다.

## 리포트 목록

| 문서 | 대상 | 핵심 |
|---|---|---|
| [qa_common.md](qa_common.md) | 공통 | 4-UI 분리 현상, 브랜드 표기, 버튼 8종 혼재, 폼·사이드바 정합성 |
| [qa_writer.md](qa_writer.md) | writer.1~3 | Create Exam eager validation, Exam Specifications 렌더 누락, 빈 Dashboard |
| [qa_teacher.md](qa_teacher.md) | teacher.1~3 | 온보딩 모달 상태 비영속 + Step 2 Loading 버그, Create Exam 포커스 시안색 |
| [qa_student.md](qa_student.md) | student.1~3 | Save Changes 초록 버튼, Payment Management 개발 메모 노출, Subjects vs Score Calculator 중복 |
| [qa_manager.md](qa_manager.md) | manager.1 | `/teacher/exam/create` 라우트 공유, 사이드바 라벨 잘림, Sign Out 위치 일탈 |
| [qa_public.md](qa_public.md) | landing, signin | 브랜드 표기 혼재, Register CTA 파이프 구분 |
| **[2.0_direction.md](2.0_direction.md)** | 전략 | 옵션 A/B/C 제안 + P0 Hotfix 7개 + 의사결정 체크리스트 |
| **[design_system_audit.md](design_system_audit.md)** | Phase 1 (보류) | 기존 토큰/컴포넌트 자산 감사 — 현재는 병렬 트랙으로 축소 |
| **[ux_roadmap.md](ux_roadmap.md)** ★ | **현행 플랜** | UX 기본 + 역할별 누락 화면 중심 8주 Week Plan (Notion Wiki 전제 반영) |
| **[dev_probe_findings.md](dev_probe_findings.md)** 🆕 | DEV 프로브 | 2026-04-19 v2 캡처 실측 — 사이드바 404 10건 · deep-link 차단 · onboarding 쿼리 원인 |

## 재현 방법

```bash
cd qa/scripts
bash run_all.sh    # 10개 계정 전체 재캡처 (~5분, Warp 연결 필요)
# 개별 계정: node capture.js <role> <user>
```

## 디렉토리

```
qa/
├── reports/          ← 본 문서들
├── screenshots/      ← 계정별 원본 스크린샷 (fullPage PNG)
│   ├── writer_writer.1/ … writer_writer.3/
│   ├── teacher_teacher.1/ … teacher_teacher.3/
│   ├── student_student.1/ … student_student.3/
│   └── manager_manager.1/
└── scripts/
    ├── capture.js         ← puppeteer-core + 설치된 Google Chrome
    ├── run_all.sh         ← 배치 러너
    ├── package.json
    └── node_modules/
```

## 제약 · 한계

- **데스크톱 1440×900 뷰포트만 캡처**. 모바일 반응형 QA 별도 필요
- Manager 의 User Management / Content Management 서브 페이지는 나비게이션 수집 단계에서 미포함 → 2차 캡처 필요
- Figma MCP 연결 중단으로 **렌더링 이미지 직접 비교 불가**, 스펙 수치 기반 대조로 대체
- 로그인 실패 / 네트워크 오류 등 엣지 케이스 미테스트
