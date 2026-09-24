# 루틴 등록 가이드

팀이 먼저 말을 거는 부분은 Claude Code **Routines**(클라우드 실행)로 돌린다. 노트북이 꺼져 있어도 동작한다.
등록은 `claude.ai/code/routines` → **New routine**에서 한다. 루틴은 아직 리서치 프리뷰라 화면 이름은 조금 다를 수 있다.

| 루틴 | 파일 | 스케줄 (cron, 로컬 시간) | 모델 | 주당 실행 |
|---|---|---|---|---|
| Thomas 세션 전 브리핑 | `thomas-prebrief.md` | `30 20 * * 1,3,6` (월·수·토 20:30) | Sonnet | 3 |
| Lena 리파인먼트 안건 | `lena-refinement-agenda.md` | `0 12 * * 3` (수 12:00) | Sonnet | 1 |
| BE 팀 작업 | `be-team-work.md` | `0 2 * * 2,5` (화·금 02:00) | Opus | 2 |

## 공통 설정

1. **Repository**: 이 레포 (GitHub 연결 필요)
2. **Environment**
   - Network access: `slack.com`에 접근할 수 있어야 한다. 허용 목록을 쓸 수 있으면 `slack.com`을 추가, 아니면 Full.
   - Environment variables:
     - `SLACK_BOT_TOKEN` = 팀 봇 토큰 (`xoxb-...`)
     - `SLACK_CHANNEL_DAILY`, `SLACK_CHANNEL_SPRINT`, `SLACK_CHANNEL_BACKEND` = 채널 ID (`C0...`)
     - `SLACK_JOON_USER_ID` = 네 Slack 사용자 ID (`U0...`). 멘션해야 폰 알림이 확실히 온다.
   - Setup script (BE 팀 루틴만): `npm --prefix backend install`
3. **Connectors**: Atlassian(Jira)과 Slack만 남기고 나머지는 전부 뺀다. Slack 커넥터는 **읽기용**이다. 커넥터로 글을 쓰면 네 이름으로 올라가서 알림이 안 오기 때문에, 쓰기는 항상 `scripts/slack-post.mjs`(봇)로 한다.
4. **BE 팀 루틴만**: 브랜치 푸시는 기본값(`claude/` 접두사 브랜치만) 그대로 둔다.

## 알아둘 제약

- 스케줄 최소 간격은 1시간이고, 실행은 예정 시각보다 몇 분 늦게 시작될 수 있다.
- 루틴 실행은 대화형 세션과 같은 구독 사용량에서 차감되고, 계정별 일일 실행 상한이 따로 있다. 주 6회면 충분히 여유 있다.
- 승인 프롬프트 없이 실행되므로, 커넥터와 네트워크는 위에 적은 만큼만 연다.
- 등록 후 각 루틴을 한 번 **수동 실행(Run now)**해서 Slack에 메시지가 오는지 확인한다.
