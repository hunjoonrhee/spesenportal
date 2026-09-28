# Sprint-Log

Thomas가 회의마다 갱신한다. 최신이 위.

## 킥오프 완료 (2026-09-25)
- Jira EXP: 이슈 80건 CSV 가져오기 확인 (Done 45 / To Do 35). EXP-58·60·61·66 표본 대조 일치.
- CSV 가져오기 때 다중 라벨이 `_`로 합쳐진 15건(EXP-55~67, 71, 78)을 분리 수정. `labels = sprint-8` → 6건 확인.
- Confluence 스페이스 SP(Spesenportal)에 Onboarding, Architektur, Team & Arbeitsweise, Konventionen, Architecture Decision Records(ADR-0001~0005) 게시. 원본은 레포 `docs/`.
- Jira 보드 `EXP board`(id 2)에는 자동 생성된 빈 스프린트 `EXP Sprint 1`만 있음 → Joon이 Sprint 8로 정리. 이슈 담기는 플래닝에서.

## Sprint 8 (28.09.–11.10.2026) – Joon 합류
- 상태: **진행 중** (플래닝 월 28.09., Jira 스프린트 시작함)
- 목표: „Joon ist im Team angekommen, und ‚Meine Ausgaben' zeigt korrekte und filterbare Daten."
- 캐파 (Joon): 12 h − 이벤트 3 h − 온보딩 2 h = 티켓 약 7 h. 바쁜 주 없음.
- Joon: EXP-61 (FE, 1) → EXP-66 (BE, 2) → EXP-58 (Fullstack, 3) = 6 SP, 예상 6~9 h. Stretch: EXP-63 (FE, 1, 스프린트에는 안 담음)
- FE:BE = 50:50 (목표 70:30). EXP-66이 EXP-58의 선행 작업이라 이번에는 받아들임. Sprint 9에서 FE 비중을 높여 균형을 맞춘다.
- BE 팀: EXP-67 (Tim, 2, 화 29.09. 루틴), EXP-60 (Katrin, 3, 금 02.10. 루틴). 둘 다 Joon이 교차 리뷰.
- 순서: EXP-61 진행 중에 EXP-67 리뷰·머지 → EXP-66 → EXP-58. 목 01.10.까지 EXP-67이 머지되지 않으면 Joon이 먼저 진행하고, Tim이 금 루틴에서 rebase.
- 리스크:
  - EXP-66, EXP-58, EXP-67이 모두 `expenses.controller.ts`와 `expenses.service.ts`를 건드린다. 머지 충돌 가능.
  - 예상 시간이 캐파 상한(9 h 대 7 h)에 걸린다. 넘치면 EXP-58의 FE 마무리가 Sprint 9로 넘어갈 수 있다.
  - EXP-60 AC 추가안(권한은 Kostenstelle 책임자, 결정 필드 저장, trim)을 Jira 코멘트로 남김. **Lena 확인 대기.**

## Sprint 1–7 요약
- 기반 구축(1–2), 목록·API(3), 등록 폼·환율(4), 수정·제출·상세(5), 승인 API·역할(6), zoneless·업그레이드·온보딩 문서(7).
- 평균 속도 약 14 SP (팀 기준). 자세한 내용은 `backlog/sprint-history.md`.
- 스프린트 7 회고 액션: "새 팀원 온보딩 스프린트는 가볍게", "리뷰에서 트레이드오프를 글로 남기기".
