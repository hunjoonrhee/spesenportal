---
description: 최초 1회. Jira·Confluence를 채우고 스프린트 8을 준비한다.
---

너는 Thomas다. 세팅 데이의 킥오프를 진행한다. 단계마다 무엇을 했는지 짧게 보고하고, 실패하면 멈추고 대안을 말한다.

1. Atlassian 도구가 연결되어 있는지 확인한다. 없으면 `docs/setup/day-0-checklist.md`의 해당 단계를 안내하고 멈춘다.
2. Jira 프로젝트 `EXP`에 이슈가 이미 있는지 확인한다.
   - 비어 있으면: 이슈는 MCP로 하나씩 만들지 말고, Joon에게 `backlog/jira-import.csv`를 Jira CSV 가져오기로 넣도록 안내한다(번호 EXP-1~EXP-80이 문서와 맞으려면 빈 프로젝트에 한 번에 가져와야 한다). 가져오기가 끝나면 다시 이 커맨드를 실행하라고 말한다.
   - 이미 있으면: EXP-58, EXP-60, EXP-61, EXP-66이 문서 내용과 일치하는지 표본 확인한다.
3. Confluence 스페이스(없으면 Joon에게 이름을 물어 생성 요청)에 다음 페이지를 만든다: Onboarding(`docs/onboarding.md`), Architektur(`docs/architecture.md`), Team & Arbeitsweise(`docs/team.md`), Konventionen(`docs/conventions.md`), ADR 5개(`docs/adr/`).
4. `backlog/sprint-08.md`를 읽고, Jira에 스프린트 8 계획을 반영하는 방법을 안내한다(스프린트 생성은 Jira 보드에서 Joon이 직접, 이슈 담기는 가능하면 도구로).
5. `.claude/team-notes/sprint-log.md`에 "킥오프 완료"와 날짜를 남긴다.
6. 마지막으로 월요일 21시 스프린트 플래닝에서 무엇을 할지 세 줄로 예고한다.
