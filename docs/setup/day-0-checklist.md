# 세팅 체크리스트

**Part A는 지금(약 1시간)**, **Part B는 토요일 세팅 데이(약 45분)**. 각 단계 끝의 ✅ 확인이 되면 다음으로 넘어간다.

---

## Part A · 지금 (약 1시간)

### A1. 로컬 실행 (10분)
```bash
cd spesenportal
nvm install          # .nvmrc → Node 24 (npm 11 포함)
node -v              # v24.15 이상이어야 한다 (Angular 22 요구사항)
npm install          # 루트에서 한 번 → backend, frontend까지 설치
npm test             # BE 단위 5 + e2e 4, FE 4 → 전부 통과
npm run dev
```
✅ http://localhost:4200 에서 Anna Becker로 로그인 → "Meine Ausgaben"이 보인다. (Anna는 28건인데 "152 Ausgaben"이라고 나오는 건 정상. 네 첫 BE 버그 EXP-66이야.)
✅ http://localhost:3000/api/docs 에 Swagger가 뜬다.

### A2. GitHub에 올리기 (10분)
```bash
git init -b main
git add .
git commit -m "chore: import Spesenportal state after sprint 7"
gh repo create spesenportal --public --source=. --push
```
(`gh`가 없으면 GitHub에서 빈 public 레포를 만들고 `git remote add origin …` 후 `git push -u origin main`)

### A3. PR 자동 리뷰 연결 (15분)
```bash
claude update        # Claude Code 최신화
claude               # 레포 폴더에서 실행
```
Claude Code 안에서:
1. `/install-github-app` → 이 레포 선택 → GitHub App 설치
2. Actions 설정을 계속 진행하고, 인증은 **Claude 구독(OAuth)** 방식을 고른다. API 키 방식은 별도 요금이 나가니 고르지 않는다.
3. 설정 과정에서 Claude가 자체 워크플로우 PR을 만들면 **머지하지 말고 닫는다.** 우리 워크플로우(`.github/workflows/`)가 이미 있다.
4. GitHub 레포 → Settings → Secrets and variables → Actions에 `CLAUDE_CODE_OAUTH_TOKEN`이 생겼는지 확인한다.
   - 없으면 대안: 터미널에서 `claude setup-token`으로 토큰을 만들고 `gh secret set CLAUDE_CODE_OAUTH_TOKEN`으로 등록.

리뷰 테스트:
```bash
git switch -c test/review-check
# frontend/src/app/features/expenses/expense-list/expense-list.ts 아무 곳에 주석 한 줄 추가
git commit -am "test: review pipeline" && git push -u origin test/review-check
gh pr create --title "EXP-0: Review-Test" --body "Pipeline-Test"
```
✅ 몇 분 안에 PR에 Sabine의 리뷰 코멘트가 달린다 (Actions 탭에서 진행 확인). 확인했으면 PR은 머지하지 말고 닫고 브랜치를 지운다.
⚠️ 인라인 코멘트가 안 달리고 요약만 오면, 워크플로우의 `--allowedTools`를 공식 예제(anthropics/claude-code-action 레포의 PR 리뷰 예제)와 비교해서 맞추면 된다.

### A4. Jira 채우기 + 킥오프 (25분)
1. atlassian.com에서 무료로 Jira 사이트를 만든다(계정 생성은 네가 직접).
2. **Scrum** 템플릿으로 프로젝트를 만든다. 이름 `Spesenportal`, **키 `EXP`**.
3. **아무 이슈도 만들기 전에** `backlog/jira-import.csv`를 CSV 가져오기로 넣는다.
   - 위치: Jira 설정(톱니바퀴) → System → External System Import → CSV. 화면이 다르면 Jira 도움말에서 "Import data from CSV"를 찾는다.
   - 대상 프로젝트: `EXP`, 인코딩 UTF-8
   - 필드 매핑: Issue ID → Issue ID, Parent → Parent, Summary, Issue Type, Description, Story Points → Story point estimate (또는 Story Points), Labels → Labels, Status → Status (`To Do`, `Done`)
   - ✅ 확인: EXP-1이 Epic "Spesen erfassen", EXP-58이 "Spesenliste nach Status filtern"이면 번호가 문서와 맞는 것.
   - 번호가 밀렸다면(프로젝트에 이미 이슈가 있었던 경우) 프로젝트를 지우고 새로 만든 뒤 다시 가져오는 게 가장 깔끔하다.
4. Claude Code에 Atlassian 연결:
   ```bash
   claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
   ```
   Claude Code 안에서 `/mcp` → atlassian 인증.
5. Claude Code에서 `/kickoff` 실행 → Thomas가 Jira를 확인하고 Confluence 페이지를 만든다.
6. Jira 백로그 화면에서 **Sprint 8**을 만든다(28.09.–11.10.). 이슈는 월요일 플래닝에서 담는다.

Part A 끝. 여기까지 되면 월요일 플래닝을 할 수 있는 상태야.

---

## Part B · 토요일 세팅 데이 (약 45분)

### B1. Slack 워크스페이스와 팀 봇 (15분)
1. 무료 Slack 워크스페이스를 만들고 채널 4개를 만든다: `#daily`, `#sprint`, `#backend`, `#pr-review`
2. api.slack.com/apps → Create New App → From scratch → 이름 `Nordwerk Team`
3. OAuth & Permissions → Bot Token Scopes에 `chat:write`, `chat:write.customize` 추가 → Install to Workspace
4. **Bot User OAuth Token**(`xoxb-…`)을 복사해둔다.
5. 네 채널 각각에서 `/invite @Nordwerk Team`
6. 채널 ID 4개(채널 이름 클릭 → 맨 아래 Channel ID)와 네 Member ID(프로필 → ⋮ → Copy member ID)를 메모한다.

### B2. GitHub에 Slack 정보 등록 (5분)
```bash
gh secret set SLACK_BOT_TOKEN                 # xoxb-… 붙여넣기
gh variable set SLACK_CHANNEL_PR_REVIEW --body C0XXXXXXX
```

### B3. Claude를 Slack에 (10분)
1. claude.ai/code에서 GitHub를 연결하고 이 레포를 허용한다 (Slack 연동과 루틴 둘 다 필요).
2. Slack App Marketplace에서 **Claude**를 설치하고 Claude 계정으로 인증한다. 라우팅 모드는 Code + Chat.
3. 네 채널에서 `/invite @Claude`
4. claude.ai 설정의 커넥터에서 **Atlassian**과 **Slack**을 연결한다 (루틴이 Jira를 읽고 Slack 답글을 읽는 데 쓴다).

### B4. 루틴 3개 등록 (15분)
`routines/README.md`를 따라 claude.ai/code/routines에서 등록한다. 환경 변수: `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_DAILY`, `SLACK_CHANNEL_SPRINT`, `SLACK_CHANNEL_BACKEND`, `SLACK_JOON_USER_ID`.
✅ Thomas 루틴을 **Run now**로 한 번 실행 → #daily에 "Thomas Brandt (PL)" 이름으로 브리핑이 오고 폰 알림이 울린다.

Part B 끝. 이제 팀이 먼저 말을 건다.
