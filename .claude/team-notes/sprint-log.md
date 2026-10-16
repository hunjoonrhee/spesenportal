# Sprint-Log

Thomas가 회의마다 갱신한다. 최신이 위.

## 리파인먼트 (수 14.10.2026)
- 참석: Joon, Lena, Sabine, Jonas, Katrin. 안건은 Lena가 12:12에 #sprint에 올렸다(루틴을 고친 뒤 처음 정상 실행).
- **EXP-74** (FE, `refined`, **5 SP**, 백로그 최상단): 필터, 정렬, 페이지를 URL에 담는다.
  - 결정 ①: 상태의 원본은 **URL**(A). Joon의 근거: 한 방향 흐름, signal 동기화 걱정이 없다.
  - 결정 ②: URL 규칙(키, 파싱, 검증, 기본값)은 **서비스 한 곳(어댑터)**만 안다. 컴포넌트는 signal만 읽는다. 특정 화면 전용이 아니다.
  - 값은 API 어휘(`sort=date&order=asc`, `status=SUBMITTED`)를 쓰고, 기본값은 생략한다.
  - 기록: 필터·정렬 변경은 교체(`replaceUrl`), 페이지 이동은 쌓기(Lena 결정).
  - AC 4: 잘못되었거나 오래된 URL 값은 무시하거나 기본값으로 바꾸고, 목록은 그대로 보여준다(Joon이 위험을 찾음).
  - SP 근거: router와 zoneless signal이 처음이라 불확실하다. Jonas는 3을, Sabine은 5를 냈다. "테스트"는 SP의 근거가 아니다(DoD).
  - ADR-0006 초안: Thomas가 뼈대를 만들고 Joon이 결과와 트레이드오프를 채운다.
- **EXP-58**: AK „Filter bleibt nach einem Reload erhalten“을 EXP-74로 옮겼다(Joon 제안, Lena 동의, 조건: EXP-74를 Sprint 9 최상단에). SP 3은 그대로.
- **EXP-54** (Fullstack, `refined`, **3 SP**): 목록 위 „Kategorie ▾“와 체크박스 팝오버, 선택 칩과 „+N“, 전부 선택은 필터 없음, 카테고리 `key` 사용. 구현 전에 Joon이 와이어프레임을 붙이고 Lena와 Sabine이 확인한다. 순서 58 → 74 → 54. Sabine은 5, Katrin은 3을 냈고, Joon이 EXP-58 기준으로 3을 골랐다.
- 넘김: **EXP-53**(검색)은 다음 리파인먼트, **EXP-60** AK 추가안은 PR #8 리뷰 때 확인.
- 열린 질문: 검색어를 URL에 넣어도 되는지(DSGVO, Lena), „0개 선택“의 뜻(Lena), 모르는 카테고리 key에 대한 API 응답(400 vs 무시, Markus), 다중 값 표기(EXP-58 구현 때).
- 회고 안건(Joon): 2주 스프린트가 짧다(PR 하나에 오래 걸리고, BE 리뷰에 공부가 필요하다). 그 밖에 EXP-61 SP, `.vscode/settings.json`.
- 배운 점: 기준점이 되는 SP(EXP-58의 3)가 Joon이 합류하기 전에 매긴 값이었다. 기준점으로 쓰기 전에 그 숫자에 동의하는지부터 확인한다.

## 킥오프 완료 (2026-09-25)
- Jira EXP: 이슈 80건 CSV 가져오기 확인 (Done 45 / To Do 35). EXP-58·60·61·66 표본 대조 일치.
- CSV 가져오기 때 다중 라벨이 `_`로 합쳐진 15건(EXP-55~67, 71, 78)을 분리 수정. `labels = sprint-8` → 6건 확인.
- Confluence 스페이스 SP(Spesenportal)에 Onboarding, Architektur, Team & Arbeitsweise, Konventionen, Architecture Decision Records(ADR-0001~0005) 게시. 원본은 레포 `docs/`.
- Jira 보드 `EXP board`(id 2)에는 자동 생성된 빈 스프린트 `EXP Sprint 1`만 있음 → Joon이 Sprint 8로 정리. 이슈 담기는 플래닝에서.

## Sprint 8 (28.09.–01.11.2026, 두 번 연장) – Joon 합류
- 두 번째 연장 (16.10.): Joon이 시험 준비 등으로 일정을 다시 조정해 달라고 요청했다. 종료일을 18.10.에서 **01.11.(일)**로 옮겼다(Jira 반영). 리뷰·회고는 토 31.10. 22:15, Sprint 9 플래닝은 월 02.11. 21:00. 다음 리파인먼트는 수 28.10. 21:00(EXP-53 등).
- 앞으로 스프린트는 **4주**다. Lena는 Sprint 8 목표를 유지한다(01.11.까지 EXP-66과 EXP-58이 들어오면). 두 티켓은 묶지 말고 하나씩 끝까지 머지한다.
- 상태: **진행 중** (플래닝 월 28.09., Jira 스프린트 시작함)
- 연장: 원래 종료일은 11.10.이었다. Joon이 출장(05.10. 주)으로 작업하지 못해 07.10.에 #daily에서 "종료를 일주일 미루자"고 제안했고, 10.10.에 종료일을 18.10.로 확정했다. Jira 종료일은 12.10.에 18.10. 23:59로 반영했다. 리뷰·회고는 토 17.10., Sprint 9 플래닝은 월 19.10.로 옮긴다.
- 목표: „Joon ist im Team angekommen, und ‚Meine Ausgaben' zeigt korrekte und filterbare Daten."
- 진행 (12.10.): EXP-61 PR #6 머지. Sabine이 재리뷰에서 승인했다(남은 🔴 0개). 요청 경쟁 상태(race condition)는 후속으로 넘겼고, 목록·폼·상세 화면의 상태 관리 비교는 14.10. 리파인먼트 안건이다. EXP-66과 EXP-58은 아직 시작 전이고, BE PR #8(EXP-60)과 #9(EXP-67)는 Joon의 교차 리뷰를 기다린다.
- 캐파 (Joon): 12 h − 이벤트 3 h − 온보딩 2 h = 티켓 약 7 h. 바쁜 주 없음.
- Joon: EXP-61 (FE, 1) → EXP-66 (BE, 2) → EXP-58 (Fullstack, 3) = 6 SP, 예상 6~9 h. Stretch: EXP-63 (FE, 1, 스프린트에는 안 담음)
- FE:BE = 50:50 (목표 70:30). EXP-66이 EXP-58의 선행 작업이라 이번에는 받아들임. Sprint 9에서 FE 비중을 높여 균형을 맞춘다.
- BE 팀: EXP-67 (Tim, 2, 화 29.09. 루틴), EXP-60 (Katrin, 3, 금 02.10. 루틴). 둘 다 Joon이 교차 리뷰.
- 순서: EXP-61 진행 중에 EXP-67 리뷰·머지 → EXP-66 → EXP-58. 목 01.10.까지 EXP-67이 머지되지 않으면 Joon이 먼저 진행하고, Tim이 금 루틴에서 rebase.
- 리스크:
  - EXP-66, EXP-58, EXP-67이 모두 `expenses.controller.ts`와 `expenses.service.ts`를 건드린다. 머지 충돌 가능.
  - 예상 시간이 캐파 상한(9 h 대 7 h)에 걸린다. 넘치면 EXP-58의 FE 마무리가 Sprint 9로 넘어갈 수 있다.
  - EXP-60 AC 추가안(권한은 Kostenstelle 책임자, 결정 필드 저장, trim)을 Jira 코멘트로 남김. **Lena 확인 대기.**
  - EXP-61 SP: 01.10.에 Joon의 요청으로 Jira에서 1 → 5로 바뀌었지만 리파인먼트나 Lena 확인을 거치지 않았다. 리뷰·회고에서 확정한다.
  - EXP-61 AK가 스프린트 중에 세 줄 늘었다(28.09. 전체 목록 기준 정렬, 정렬하면 1페이지로 이동 / 30.09. 페이지를 넘겨도 정렬 유지). 모두 Joon이 질문해서 Lena가 확인했다. 1 SP를 넘을 수 있으니 EXP-66 착수가 01.10. 이후로 밀리면 EXP-58 범위를 다시 본다.

## Sprint 1–7 요약
- 기반 구축(1–2), 목록·API(3), 등록 폼·환율(4), 수정·제출·상세(5), 승인 API·역할(6), zoneless·업그레이드·온보딩 문서(7).
- 평균 속도 약 14 SP (팀 기준). 자세한 내용은 `backlog/sprint-history.md`.
- 스프린트 7 회고 액션: "새 팀원 온보딩 스프린트는 가볍게", "리뷰에서 트레이드오프를 글로 남기기".
