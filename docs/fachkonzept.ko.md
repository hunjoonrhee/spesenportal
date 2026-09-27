# Fachkonzept Spesenportal (한국어판)

- Verantwortlich: Lena Vogel
- Review: Thomas Brandt, Markus Weber, Sabine Keller
- Status: Entwurf
- Stand: 26.09.2026

> 이 문서는 [`fachkonzept.md`](fachkonzept.md)의 번역본이다. 두 문서가 다르면 **독일어 원본이 기준**이다. 원본을 고치면 이 문서도 함께 고친다.
> 도메인 용어(Kostenstelle, Beleg 등)와 상태값(DRAFT 등)은 원어 그대로 두었다. 뜻은 7장 용어집을 본다.

## 1. 비전과 목표

Spesenportal은 Nordwerk AG에서 쓰던 출장비·경비용 Excel 양식을 대체한다. 직원은 경비를 디지털로 입력하고, Kostenstellenverantwortliche:r가 검토해서 결정하고, Buchhaltung이 지급을 처리한다.

목표:

- Excel 양식보다 경비를 더 빨리 입력하고, 검토하고, 지급한다.
- Spesenrichtlinie를 모든 직원에게 똑같이 적용한다.
- 모든 결정(승인, 반려)을 추적할 수 있게 기록한다.
- 직원은 언제든 자기 제출 건의 상태를 한눈에 볼 수 있다.

이 문서가 다루지 않는 것: 기술적 구현. Fachkonzept는 어떤 규칙이 적용되는지를 말하고, 그 규칙을 코드로 어떻게 구현하는지는 말하지 않는다.

## 2. 사용자와 역할

| 역할 | 명칭 | 하는 일 |
|---|---|---|
| EMPLOYEE | Mitarbeiter:in | 경비 입력·제출, 본인 경비 조회 |
| APPROVER | Kostenstellenverantwortliche:r | 담당 Kostenstelle의 제출 건 검토, 승인 또는 반려 |
| ACCOUNTING | Buchhaltung | 승인된 경비 지급, 회계용 집계 |

한 사람은 정확히 하나의 역할을 가진다. Kostenstelle마다 책임자는 최대 한 명이다(예외: 최상위 „1000 Geschäftsführung“에는 현재 책임자가 등록되어 있지 않다. 열린 질문 1 참고).

승인 권한은 역할이 아니라 „Kostenstelle의 책임자“라는 지정에 따른다. 그래서 ACCOUNTING 역할인 사람도 특정 Kostenstelle에 대해 승인 권한을 가질 수 있다. 누가 무엇을 보고, 수정하고, 결정하고, 지급하는지는 6장의 권한 매트릭스에 정리했다.

## 3. 업무 흐름과 상태 전이

경비는 다음 흐름을 거친다: 초안(Entwurf)으로 입력 → 제출 → 담당 Kostenstellenverantwortliche:r의 결정 → 승인되면 Buchhaltung이 지급.

| 이전 | 이후 | 계기 | 누가 | 조건 |
|---|---|---|---|---|
| – | DRAFT | 경비 입력 | 경비 작성자(Ersteller:in) | Kostenstelle가 Blatt-Kostenstelle일 것(선택 범위는 4.6) |
| – | SUBMITTED | 입력하면서 바로 제출 | 경비 작성자 | 필수 항목이 모두 채워지고 유효할 것(EXP-26) |
| DRAFT | DRAFT | 초안 수정 | 경비 작성자 | DRAFT 상태에서만 가능 |
| DRAFT | SUBMITTED | 제출 | 경비 작성자 | 필수 항목이 모두 채워지고 유효할 것 |
| DRAFT | – | 초안 삭제 | 경비 작성자 | DRAFT 상태에서만 가능 |
| SUBMITTED | APPROVED | 승인 | 해당 Kostenstelle의 책임자 | 열린 질문 1 참고 |
| SUBMITTED | REJECTED | 반려 | 해당 Kostenstelle의 책임자 | 사유 필수, 5~300자 |
| APPROVED | PAID | 지급 처리 | Buchhaltung | 열린 질문 5 참고 |

„경비 작성자“를 일부러 EMPLOYEE 역할과 같게 두지 않았다. Kostenstellenverantwortliche와 Buchhaltung도 자기 경비를 입력하기 때문이다.

목표는 빈틈없는 기록이다. 제출과 지급을 포함한 모든 상태 변경을 시점, 처리한 사람, 이전 상태와 이후 상태와 함께 기록한다. 반려할 때는 사유도 함께 기록한다. 기록은 수정할 수 없다. 지금은 `submittedAt`, `decidedAt`, `decidedBy`, `rejectionReason` 필드가 이 역할을 한다. 완전하고 영구적인 기록에는 영속 저장소가 필요하다(6장, EXP-73). `receiptFileName` 필드는 있지만 Beleg 업로드(EXP-68)가 생겨야 쓸 수 있다.

반려된 경비의 상세 화면에는 반려 사유, 결정한 사람, 결정 시점을 보여준다. 목록에는 상태만 보여준다. 상세 화면에는 Ausgaben-ID도 보여준다. 과도기(4.2) 동안 따로 제출한 종이 Beleg와 경비를 짝지을 수 있게 하기 위해서다. 승인 목록(EXP-55)의 „Datum“ 열은 제출 시점을 뜻한다. 4.3의 처리 목표가 제출 시점을 기준으로 하기 때문이다. 지출일은 별도 열로 함께 보여준다.

현재 모델에서 REJECTED는 최종 상태다. 반려된 경비를 다시 제출할 수 있는지는 열린 질문 4다.

## 4. Spesenrichtlinie

### 4.1 카테고리와 한도

카테고리는 12개다. 여러 박의 숙박처럼 한 건에 여러 단위가 묶이는 경우가 있어서, 필요한 곳에는 고정 상한 대신 Richtwert(권장 기준액)를 둔다.

| 카테고리(Key) | 명칭 | 규칙 |
|---|---|---|
| HOTEL | Übernachtung | 적정한 중급 호텔. Richtwert: 국내 1박 130 €까지, 해외나 물가가 비싼 대도시권 1박 180 €까지. 여러 박은 한 건으로 입력한다. |
| TRAIN | Bahnfahrt | 2등석. 1등석은 납득할 만한 이유가 있을 때만. |
| FLIGHT | Flug | Economy, 그때 이용할 수 있는 가장 싼 요금. 좌석 지정, 수하물 업그레이드, 라운지 같은 부가 서비스는 업무상 필요할 때만 비용으로 인정한다. |
| TAXI | Taxi | 대중교통을 이용하기 어렵거나 일정이 촉박할 때만. |
| RENTAL_CAR | Mietwagen | 중형차. 자기부담금 0 €인 완전 자차보험(Vollkasko)은 경비에 포함한다. |
| FUEL | Kraftstoff | 승인된 Mietwagen이나 회사 차량과 관련된 경우만. |
| PARKING | Parken | 증빙 필요. 예외는 4.2 참고. |
| HOSPITALITY | Bewirtung | 업무상 계기가 있을 때만. 기록 방법은 4.2 참고. Richtwert: 1인당 60 €까지. |
| PER_DIEM | Verpflegungsmehraufwand | 외부 근무일 기준 정액. 여러 날 출장의 출발일·도착일, 그리고 8시간 넘게 자리를 비운 당일 출장은 최대 14 €. 24시간 내내 자리를 비운 온전한 날은 최대 28 €. 식사를 제공받았으면 정해진 금액을 뺀다. 해외 기준액은 Buchhaltung에 문의한다. |
| OFFICE | Büromaterial | 사무용 소모품. |
| SOFTWARE | Software & Abos | 비용만 입력한다. 라이선스 승인 자체는 IT를 통해 따로 진행한다. |
| OTHER | Sonstiges | 설명만 읽어도 무슨 일로 쓴 돈인지 알 수 있어야 한다. |

카테고리는 이 12개가 전부다. 5장의 Nicht-Ziele 참고.

### 4.2 Belegpflicht

원칙: 모든 경비에는 Beleg가 필요하다. 예외는 Verpflegungsmehraufwand(정액이라 개별 Beleg 없음)뿐이다.

Eigenbeleg 예외: 주차 정산기처럼 영수증이 나오지 않는 경우, 10 €까지는 날짜·금액·계기를 적은 Eigenbeleg로 대신할 수 있다.

Bewirtung: 계기와 참석자는 종이 Bewirtungsbeleg에 적는다. 디지털 설명에는 계기만 짧게 적으면 된다(예: „Kundentermin – Bewirtung“). 참석자 명단을 다시 적을 필요는 없다.

Beleg 업로드가 생기기 전까지(EXP-68 이전)는 결정권자가 따로 제출된 원본 Beleg를 보고 Belegpflicht를 확인한다. 원본 Beleg는 Ausgaben-ID를 적어서 종이나 이메일로 Buchhaltung에 보낸다. EXP-68 이후에는 제출할 때 Beleg 업로드가 필수다. PER_DIEM과 Eigenbeleg로 표시한 10 € 이하 경비는 예외다.

### 4.3 제출 기한

경비는 제때 입력하고 제출해야 한다. 목표: 지출일로부터 14일(달력 기준) 안에 제출, 제출 후 10일(달력 기준) 안에 결정.

최종 기한: 경비는 늦어도 지출일로부터 3개월 안에 제출해야 한다. 지난 회계연도의 경비는 늦어도 다음 해 1월 15일까지 제출해야 한다.

### 4.4 승인

결정 권한은 경비가 기록된 Kostenstelle의 책임자에게 있다. 그 사람의 역할이 APPROVER인지 ACCOUNTING인지는 상관없다(2장, 6장 권한 매트릭스).

원칙은 Vier-Augen-Prinzip이다: 제출한 사람과 결정하는 사람은 같은 사람이 아니다. Kostenstellenverantwortliche와 Buchhaltung이 자기 경비를 제출하는 경우는 아직 규칙이 확정되지 않았다. 열린 질문 1 참고.

반려할 때는 사유가 필수다. 사유는 5~300자의 자유 텍스트이고(앞뒤 공백 제외), EXP-60과 맞춘다. 미리 정해둔 문구를 고를 수 있고, 저장하기 전에 고칠 수 있다:

- Beleg fehlt
- Betrag übersteigt Richtlinie
- Falsche Kostenstelle
- Freitext (직접 작성)

저장되는 것은 최종 텍스트 하나뿐이다. 5~300자는 문구를 골랐는지 직접 썼는지와 관계없이 이 저장된 텍스트의 길이를 말한다. 그래서 지금은 반려 사유를 카테고리별로 집계할 수 없다. 그런 집계가 필요해지면 나중에 확장하며, EXP-60의 범위에는 들어가지 않는다.

### 4.5 환율

지원 통화: EUR, CHF, USD. 환율은 „외화 1단위 = x EUR“ 형식으로 정한다:

| 통화 | 환율 |
|---|---|
| EUR | 1 EUR = 1,00 EUR |
| CHF | 1 CHF = 1,07 EUR |
| USD | 1 USD = 0,92 EUR |

적용 기준은 지출일이 아니라 **제출 시점**의 환율이다. 그러면 과거 환율표가 필요 없고, 직원도 이해하기 쉽다. 대신 지출일의 실제 카드 결제 환율과 차이가 날 수 있다. 적용한 환율은 경비와 함께 저장한다. EUR 환산 금액은 소수 둘째 자리에서 반올림한다(kaufmännisch).

환율 자체는 지금 고정값으로 들어가 있고 자동으로 갱신되지 않는다. 누가 얼마나 자주 갱신할지는 열린 질문 3이다.

### 4.6 필수 항목과 검증

입력할 때와 초안을 수정할 때 똑같이 적용한다:

| 항목 | 규칙 |
|---|---|
| 날짜 | 필수, 시각 없는 달력 날짜, 미래 날짜 불가 |
| 카테고리 | 필수, 4.1의 12개 중 하나 |
| 금액 | 필수, 0보다 큼, 소수 둘째 자리까지 |
| 통화 | 필수, EUR·CHF·USD 중 하나 |
| Kostenstelle | 필수, 모든 Blatt-Kostenstelle 선택 가능, 기본값은 본인 Kostenstelle |
| 설명 | 필수, 최대 200자 |

본인 것만이 아니라 모든 Blatt-Kostenstelle를 고를 수 있게 한 이유는, 공동 출장처럼 다른 Kostenstelle를 위해 쓴 경비도 기록할 수 있게 하기 위해서다. 이때 선택 화면에 보이는 것은 Kostenstelle 구조(번호, 이름, 책임자)뿐이고, 다른 사람의 경비는 보이지 않는다. 경비를 볼 수 있는 권한은 6장의 권한 매트릭스가 정한다.

## 5. 범위와 로드맵

에픽별 정리:

- **EXP-1 Spesen erfassen**: 입력, 초안 저장, 제출은 완료. 다음: 초안 수정(EXP-57), 입력 폼 검증 개선(EXP-59), 날짜 표기 통일(EXP-78). 나중에 검토: 한 출장의 여러 경비를 묶기(EXP-76).
- **EXP-2 Übersicht & Suche**: 목록은 있다. Sprint 8(28.09.–11.10.): 정렬 버그 수정(EXP-61), 상태 필터(EXP-58), 페이지네이션 건수 수정(EXP-66), 로딩·빈 상태(EXP-63). 그다음: 텍스트 검색(EXP-53), 카테고리 필터(EXP-54), 필터 상태를 딥 링크로(EXP-74).
- **EXP-3 Genehmigungsworkflow**: 승인은 아직 API로만 있다. Sprint 8: 사유를 붙인 반려 API(EXP-60). 그다음: 승인 목록 UI(EXP-55), UI에서 승인(EXP-56), UI에서 반려(EXP-62), 바뀐 제출 건 알림(EXP-79).
- **EXP-4 Auswertung & Dashboard**: 아직 시작 안 함. 예정: 월별 카테고리 합계(EXP-64)와 집계 엔드포인트(EXP-77), Buchhaltung용 CSV 내보내기(EXP-69), 월별 비교(EXP-70).
- **EXP-5 Kostenstellen**: 아직 시작 안 함. 예정: Kostenstelle 트리 표시(EXP-65), 하위 Kostenstelle를 포함한 합계(EXP-72).
- **EXP-6 Belege**: 아직 시작 안 함. 예정: 드래그 앤 드롭 Beleg 업로드(EXP-68). 한 스프린트에 들어가기엔 커서 리파인먼트에서 쪼개야 한다.
- **EXP-7 Plattform & Qualität**: Sprint 8: PATCH 엔드포인트 검증(EXP-67). 그다음: FE 공통 에러 처리(EXP-71), 인메모리 대신 영속 저장소(EXP-73), SSO 스파이크(EXP-75), 접근성(EXP-80).

Sprint 8 목표: „Meine Ausgaben“이 직원에게 정확하고 걸러볼 수 있는 결과를 보여준다.

Nicht-Ziele (일부러 지금 범위에서 뺀 것):

- 개인 차량 이용에 대한 km당 정액(Kilometerpauschale).
- EUR, CHF, USD 외의 통화.
- 박·인원·일 단위 한도를 시스템이 자동 검사하는 것(열린 질문 2 참고).
- 네이티브 모바일 앱. 대신 반응형 웹 화면을 제공한다(EXP-42).
- 출장 예약이나 출장 신청(포털은 이미 발생한 경비만 다룬다).
- 실제 송금. 포털은 „지급됨“ 상태만 표시하고, 돈을 보내지는 않는다.
- 여러 단계의 결재 라인. 경비 한 건은 Kostenstellenverantwortliche:r 한 명이 결정한다.
- 법인카드 명세서와의 자동 대사.

## 6. 비기능 요구사항

**DSGVO와 권한**

| 행위 | 경비 작성자 | 기록된 Kostenstelle의 책임자 | Buchhaltung |
|---|---|---|---|
| 경비 보기 | 예, 본인 것 | 예, 담당 Kostenstelle 것 | 예, 전체(지급을 위해) |
| 경비 입력·수정(DRAFT만) | 예 | 아니요 | 아니요 |
| 제출 | 예 | 아니요 | 아니요 |
| 승인·반려 | 아니요(원칙. 책임자의 예외는 열린 질문 1) | 예, 담당 Kostenstelle 것 | 아니요. 단, 어떤 Kostenstelle의 책임자라면 그 Kostenstelle는 가능(2장) |
| 지급됨으로 표시 | 아니요 | 아니요 | 예 |

권한은 서버에서 로그인한 사람의 신원과 Kostenstelle 지정을 기준으로 검사한다. UI에 메뉴가 보이는지 여부는 권한의 근거가 아니다. 보관 기한과 삭제 기한은 Buchhaltung, 개인정보 담당과 함께 정한다. 퇴사한 직원의 경비와 결정 기록은 보관 기한 동안 계속 볼 수 있지만, 그 사람의 계정은 쓸 수 없다.

**추적성·감사**: 3장의 상태 기록 참고. 데이터가 메모리에만 있는 동안(ADR-0003)에는 영구 기록이 불가능하다. EXP-73이 선행 조건이다.

**접근성**: 모든 페이지가 WCAG 2.2 AA를 충족한다. 스토리마다 두 가지로 증명한다: A/AA 위반이 나오지 않는 자동 검사, 그리고 수동 키보드 테스트. 릴리스 전에는 스크린리더 테스트를 추가로 한다. 2.1이 아니라 2.2를 고른 이유: EXP-68(드래그 앤 드롭)에는 드래그 없이 쓸 수 있는 대안이 필요하고(기준 2.5.7), 표 행 안의 버튼은 최소 크기를 지켜야 한다(기준 2.5.8). 관련: EXP-80.

**지원 브라우저**: Chrome, Edge, Firefox(현재 ESR 버전 추가), Safari(macOS와 iOS)의 각각 최신 두 메이저 버전과 Android용 Chrome. 단, 사용하는 Angular 버전이 지원하는 범위 안에서. 기준은 릴리스 시점이다. 회사에서 IT가 관리하는 실제 브라우저 현황은 IT와 확인한다.

**언어와 형식**: 화면은 독일어. 지출일은 시각 없는 달력 날짜이고 TT.MM.JJJJ로 표시한다. 제출·결정 시점은 Europe/Berlin 시간대 기준으로 날짜와 시각을 TT.MM.JJJJ, HH:MM 형식으로 표시한다. 금액은 소수점을 쉼표로 입력하고 표시한다. 외화 경비는 EUR 금액을 함께 보여준다(예: „120,00 CHF (128,40 €)“). 승인 목록(EXP-55)에서도 마찬가지다. 합계와 집계는 EUR로만 표시한다. 상태 표시명: Entwurf, Eingereicht, Genehmigt, Abgelehnt, Ausgezahlt. 관련: EXP-78, EXP-35.

**모바일 사용**: 화면 너비 320 CSS 픽셀부터 내용이나 기능을 잃지 않고 쓸 수 있어야 한다. 표는 가로 스크롤을 허용한다. 본인 경비의 입력, 제출, 조회는 스마트폰에서 모두 가능해야 한다. 승인과 반려도 스마트폰에서 할 수 있어야 한다. 그래야 외근 중에도 4.3의 처리 목표를 지킬 수 있다. 관련: EXP-42.

**보안**: 지금의 데모 인증(`X-Demo-User`, ADR-0004)은 개발용이다. 실제 운영 전에는 진짜 로그인(SSO, EXP-75)이 필요하다.

## 7. 용어집

| 독일어 | 한국어 |
|---|---|
| Spesen / Ausgabe | 경비 / 지출 건 |
| Kostenstelle | 비용센터 |
| Blatt-Kostenstelle | 말단 비용센터 |
| Kostenstellenverantwortliche:r | 비용센터 책임자 |
| Mitarbeiter:in | 직원 |
| Buchhaltung | 회계팀 |
| Entwurf | 임시 저장(초안) |
| Einreichen | 제출 |
| Genehmigen | 승인 |
| Ablehnen | 반려 |
| Ablehnungsgrund | 반려 사유 |
| Beleg | 영수증 / 증빙 |
| Eigenbeleg | 자체 작성 증빙 |
| Bewirtung | 접대(식사 등 대외 접대) |
| Verpflegungsmehraufwand | 출장 식비 정액 수당 |
| Dienstreise | 출장 |
| Vier-Augen-Prinzip | 상호 검증 원칙(신청자와 결재자 분리) |
| Richtwert | 권장 기준액 |
| Auszahlung | 지급 |
| Wechselkurs | 환율 |
| Spesenrichtlinie | 경비 규정 |

## 8. 열린 질문

1. **비용센터 책임자와 Buchhaltung이 자기 경비를 승인하는 문제**: 예시 데이터에는 책임자가 자기 경비를 직접 결정한 경우가 15건 있다. 일부는 말단이 아닌 Kostenstelle(예: 1100, 1200)에, 일부는 본인이 책임자인 Blatt-Kostenstelle(예: 1310)에 기록되어 있다. 게다가 „1000 Geschäftsführung“에는 책임자가 없고, „1300 Verwaltung“의 책임자는 하위 Kostenstelle의 책임자와 같은 사람이다. 그래서 „한 단계 위로 올린다“고 해서 꼭 다른 사람에게 넘어가지는 않는다. 따라서 „제출자는 자기 경비를 결정하지 않는다“를 확정 규칙으로 둘 수 없다. 논의할 선택지는 두 가지다. (A) Kostenstelle 계층을 따라 올라가면서 제출자가 아닌 첫 번째 책임자가 결정한다. 이렇게 하려면 „1000 Geschäftsführung“에 책임자를 지정해야 한다. (B) Kostenstelle마다 대리인(Stellvertretung)을 추가로 두고, 책임자 본인의 건은 대리인이 결정한다. 이 결정에 따라 „Zu genehmigen“ 메뉴를 EXP-55처럼 APPROVER 역할에 묶어둘 수 있을지, 아니면 Kostenstelle 지정에 따라 보여야 할지도 정해진다. 관련: EXP-55, EXP-41.
2. **한도 자동 검사**: 4.1의 Richtwert는 박·인원·일 단위다. 그런데 입력 폼에는 박 수, 인원수, 출장 일수 항목이 없다. 앞으로 시스템이 한도를 검사해야 할까(경고인가 차단인가)? 그러려면 어떤 항목이 더 필요할까? 관련: EXP-59, EXP-76.
3. **환율 관리**: 4.5의 환율은 누가 얼마나 자주 갱신하나? 직원의 실제 카드 결제 환율과 차이가 나면 어떻게 처리하나?
4. **반려 후 재제출**: 지금은 REJECTED가 최종 상태다. 반려된 경비를 고쳐서 다시 제출할 수 있게 할까(예: REJECTED → DRAFT), 아니면 새로 입력해야 할까? 재제출을 허용한다면 이전 반려 기록(사유, 시점, 결정자)을 덮어쓰지 말고 이력으로 남겨야 한다(3장). 관련: EXP-62.
5. **PAID 상태 설정**: 승인된 경비를 누가 지급됨으로 표시하나? 사람이 직접 하나, 아니면 Buchhaltung용 CSV 내보내기와 연결되나? 관련: EXP-69.
