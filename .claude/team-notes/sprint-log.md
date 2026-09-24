# Sprint-Log

Thomas가 회의마다 갱신한다. 최신이 위.

## 킥오프 완료 (2026-09-25)
- Jira EXP: 이슈 80건 CSV 가져오기 확인 (Done 45 / To Do 35). EXP-58·60·61·66 표본 대조 일치.
- CSV 가져오기 때 다중 라벨이 `_`로 합쳐진 15건(EXP-55~67, 71, 78)을 분리 수정. `labels = sprint-8` → 6건 확인.
- Confluence 스페이스 SP(Spesenportal)에 Onboarding, Architektur, Team & Arbeitsweise, Konventionen, Architecture Decision Records(ADR-0001~0005) 게시. 원본은 레포 `docs/`.
- Jira 보드 `EXP board`(id 2)에는 자동 생성된 빈 스프린트 `EXP Sprint 1`만 있음 → Joon이 Sprint 8로 정리. 이슈 담기는 플래닝에서.

## Sprint 8 (28.09.–11.10.2026) – Joon 합류
- 상태: 계획됨 (플래닝 월 28.09. 21:00)
- 목표 초안: Joon이 개발 흐름에 올라타고, "내 경비" 목록이 정확하고 걸러볼 수 있는 데이터를 보여준다.
- 후보 (Joon): EXP-61 (FE, 1), EXP-66 (BE, 2), EXP-58 (Fullstack, 3), 여유 시 EXP-63 (FE, 1)
- 후보 (BE 팀): EXP-60 (Katrin, 3), EXP-67 (Tim, 2)
- 리스크: EXP-66, EXP-58, EXP-67이 모두 `ExpensesService`를 건드린다. 순서 조율 필요.

## Sprint 1–7 요약
- 기반 구축(1–2), 목록·API(3), 등록 폼·환율(4), 수정·제출·상세(5), 승인 API·역할(6), zoneless·업그레이드·온보딩 문서(7).
- 평균 속도 약 14 SP (팀 기준). 자세한 내용은 `backlog/sprint-history.md`.
- 스프린트 7 회고 액션: "새 팀원 온보딩 스프린트는 가볍게", "리뷰에서 트레이드오프를 글로 남기기".
