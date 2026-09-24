# 봉인: 심어둔 기술 부채 목록

> Joon, 이 파일은 네가 직접 찾아내는 게 목적이야. 열어봐도 괜찮지만, 몇 스프린트 동안은 리뷰와 리파인먼트에서 스스로 발견해보는 걸 추천해.
> 팀원(Claude)은 이 목록을 먼저 말하지 않는다. Joon이 관련 코드를 건드리면 질문으로 유도한다.

| # | 위치 | 문제 | 배울 것 |
|---|---|---|---|
| 1 | `backend/src/approvals/approvals.controller.ts` `approve()` | 역할(APPROVER)만 확인하고, 그 사람이 해당 Kostenstelle의 책임자인지는 확인하지 않는다. Stefan(IT)이 Vertrieb 경비를 승인할 수 있다. | 인가(authorization)는 역할이 아니라 자원 단위로. 트리 구조 권한(상위 Kostenstelle 책임자 포함 여부)은 재귀 문제이기도 하다. |
| 2 | `backend/src/expenses/expenses.service.ts` `update()` | `any` + `Object.assign`이라 `status`, `employeeId`, `amountEur`까지 PATCH로 덮어쓸 수 있다 (mass assignment). EXP-67이 DTO를 추가하지만, 허용 필드 화이트리스트까지 챙기는지가 포인트. | DTO 검증과 ValidationPipe `whitelist`의 한계, 명시적 매핑 |
| 3 | FE 전반 | 상태 관리가 세 가지 방식으로 섞여 있다: 목록은 BehaviorSubject + async, 폼은 subscribe 안에서 signal.set, 상세는 rxResource + computed. | 팀 표준을 정하는 법, zoneless에서 각 방식의 변경 감지 |
| 4 | `expense-list.ts` `load()` | 카테고리를 먼저 받은 뒤에야 경비를 요청한다(워터폴). 행마다 `categories.find()`로 라벨을 찾는다(O(n·m)). | `Map`으로 조회 테이블 만들기, 병렬 요청(forkJoin 또는 resource 조합) |
| 5 | `expense-list.ts` `formatAmount()` | `toFixed(2)`로 금액을 직접 포맷한다. 천 단위 구분이 없고, 상세 화면의 MoneyPipe와 표기가 다르다(57,11 EUR vs 13,47 €). | 포맷팅은 한 곳에서, `Intl.NumberFormat` |
| 6 | `expense-form.ts` `save()` | 에러 처리가 없다. API가 400을 주면 `saving`이 true로 남아 버튼이 영원히 비활성화된다. `any` 타입 사용. | 에러 경로도 상태 전이의 일부다 (EXP-71과 연결) |
| 7 | `expense-list.ts` 날짜 변환 | `new Date('2026-09-02')`는 UTC 자정으로 해석된다. 독일에선 문제없지만 UTC 서쪽 시간대에선 하루 전 날짜로 보일 수 있다. | 날짜 전용 값(LocalDate)과 시각(Instant)의 구분 |

참고: 날짜 정렬 버그(EXP-61), total 버그(EXP-66), 날짜 표기 불일치(EXP-78)는 이미 백로그에 공개된 버그라 이 목록에 넣지 않았다.
