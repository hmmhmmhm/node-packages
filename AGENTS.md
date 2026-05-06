# 에이전트 개발 규칙

이 문서는 AI 에이전트가 `node-packages` 모노레포에서 코드를 작성하고 기여할 때 따라야 하는 규칙과 가이드라인을 정의합니다.

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [코드 작성 규칙](#코드-작성-규칙)
- [커밋 규칙](#커밋-규칙)
- [보안 및 개인정보](#보안-및-개인정보)
- [파일 구조](#파일-구조)
- [코드 스타일](#코드-스타일)
- [문서화](#문서화)
- [테스트](#테스트)
- [패키지 발행](#패키지-발행)

---

## 프로젝트 개요

`node-packages` 는 hmmhmmhm 의 개인 연구용 npm 패키지 모노레포입니다. pnpm workspaces + Turborepo 구조로 운영되며, 현재 10개 패키지를 포함합니다.

- `base2000`, `base6000` — 진수 변환·인코딩 실험
- `biggest` — 임의 정밀도 큰 수·소수 라이브러리
- `curse-script` — 텍스트 변환 실험
- `edge-crypto` — 엣지 런타임용 암호화 헬퍼
- `gauss-spiral` — 가우스 나선 좌표 시스템
- `mugunghwa` — 한글 기반 base 인코딩
- `patternly` — 패턴 매칭 유틸
- `pseudo-shuffle` — 순열 없는 가짜 셔플
- `usernamer` — 사용자명 생성기

각 패키지는 독립적으로 npm 에 발행되며, 공통 의존성·도구 설정은 루트에서 관리합니다.

---

## 코드 작성 규칙

### 파일 크기 제한

**모든 코드 파일은 450줄 이하로 작성되어야 합니다.**

- **최대 줄 수**: 450줄
- **권장 줄 수**: 300-400줄
- **초과 시 조치**: 파일이 450줄을 초과하면 기능별로 분리하여 모듈화
- **예외**: 자동 생성 파일(예: 빌드 산출물, lockfile) 은 예외로 둘 수 있음

#### 파일 분리 예시

```typescript
// ❌ 나쁜 예: 하나의 파일에 모든 기능 (600줄)
// packages/biggest/src/index.ts (600줄)

// ✅ 좋은 예: 기능별로 분리
// packages/biggest/src/integer.ts (200줄)
// packages/biggest/src/decimal.ts (180줄)
// packages/biggest/src/format.ts (120줄)
// packages/biggest/src/index.ts (50줄, re-export)
```

### 코드 품질

- **명확성**: 코드는 명확하고 이해하기 쉽게 작성
- **재사용성**: 중복 코드를 최소화하고 공통 로직은 함수로 추출
- **타입 안정성**: TypeScript 의 타입 시스템을 적극 활용 (strict 모드 유지)
- **에러 핸들링**: 모든 비동기 작업과 외부 API 호출에 적절한 에러 처리 구현
- **제로 의존성 지향**: 가능한 한 외부 런타임 의존성을 추가하지 않습니다. 추가 시 합당한 사유를 PR 본문에 명시합니다.

#### 예시

```typescript
// ✅ 좋은 예
export function parse(input: string): Result {
  if (!input) {
    throw new TypeError("input must be a non-empty string");
  }
  return doParse(input);
}

// ❌ 나쁜 예
export function parse(input: any) {
  return doParse(input);
}
```

---

## 커밋 규칙

### 커밋 빈도

- **주기적인 커밋**: 논리적인 작업 단위마다 커밋
- **작은 단위**: 한 번에 하나의 기능이나 수정사항만 포함
- **완성된 코드**: 빌드 실패나 런타임 에러가 없는 상태에서만 커밋

### 커밋 메시지 형식 (Conventional Commits)

```
<type>: <설명>

[선택: 본문]
```

- `feat` — 신규 기능
- `fix` — 버그 수정
- `docs` — 문서만 변경
- `chore` — 빌드/도구/의존성
- `refactor` — 동작 변경 없는 구조 개선
- `test` — 테스트 추가/수정
- `perf` — 성능 개선

#### 예시

```
feat: add base6000 hangul-aware decoder
fix: handle negative zero in biggest comparison
chore: bump turbo to 2.x
```

---

## 보안 및 개인정보

- 비밀키·토큰·자격증명을 코드·테스트·문서에 포함하지 않습니다.
- 개인 정보(이메일, 실명) 를 예시 코드에 박지 않고, 의도된 mock 만 사용합니다.
- 보안 관련 변경(예: edge-crypto 의 알고리즘 변경) 은 별도 PR 로 분리하고 commit 메시지에 명시합니다.

---

## 파일 구조

```
node-packages/
├── packages/
│   └── <name>/
│       ├── src/
│       ├── tests/         (있는 경우)
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
├── package.json           (root, workspaces 정의)
├── pnpm-workspace.yaml
├── turbo.json
└── AGENTS.md / CLAUDE.md
```

각 패키지는 자기 자신의 `package.json` 을 가지며, npm 에 독립 발행됩니다.

---

## 코드 스타일

- **포매터**: prettier (`pnpm format`)
- **린터**: 각 패키지 단위로 turbo 가 위임 (`pnpm lint`)
- **타입 체크**: `pnpm check-types`
- **빌드**: `pnpm build` (turbo 가 의존 그래프에 따라 캐시·병렬 실행)

PR 제출 전 위 4개를 모두 통과시킵니다.

---

## 문서화

- 각 패키지는 자체 `README.md` 를 가지며, 설치·사용 예제·API 표를 포함합니다.
- 영어 README 를 우선하며, 한국어 README 는 선택적입니다 (있다면 영어와 동기 유지).
- 새 패키지 추가 시 root `README.md` 의 패키지 목록도 갱신합니다.

---

## 테스트

- 각 패키지는 자기에게 적합한 테스트 도구를 사용합니다 (Vitest 권장).
- 신규 함수·버그 수정에는 회귀 테스트를 동봉합니다.
- 외부 시스템에 의존하지 않는 단위 테스트만 운영합니다 (의존하면 mock 처리).

---

## 패키지 발행

- 각 패키지의 `package.json` 에 `publishConfig.access = public` 명시.
- 발행 전 `pnpm build && pnpm check-types && pnpm lint` 모두 통과 확인.
- 버전 범프는 SemVer 를 따릅니다. breaking change 는 major.
- npm 발행 토큰은 `personal-agent/secrets/.npmrc.personal` 을 사용합니다 (CI 가 아닌 로컬 발행 시).
