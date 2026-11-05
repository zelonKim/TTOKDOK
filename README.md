# 📚 TTOKDOK 똑독 - AI 도서 추천 및 독서 관리 플랫폼

AI가 내가 좋아할 만한 도서를 추천해주고, 나의 독서 일정에 맞춰 하루 적정 독서량을 알려줍니다.
해당 플랫폼은 **똑똑한 독서 습관**을 기르기 위한 서비스로서, 브라우저 웹 기반 환경의 플랫폼입니다.

---

## 🚀 프로젝트 실행 방법

### 1. 환경 변수 설정

ttokdok/back_nest 디렉토리에서 `.env` 파일을 생성하고, 아래의 환경 변수를 설정해 주세요.

```env
DATABASE_URL="file:./sqlite.db"

OPENAI_API_KEY="이메일에 첨부된 API키"
```

마찬가지로, ttokdok/front_next 디렉토리에서 `.env` 파일을 생성하고, 아래의 환경 변수를 설정해 주세요.

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. 백엔드 서버 실행

```bash
# 1. 디렉터리 이동
cd back_nest

# 2. 의존성 및 패키지 설치
npm install

# 3. 데이터베이스 마이그레이션
npx prisma migrate dev

# 4. 시드 데이터 생성
npx prisma db seed

# 5. 개발 서버 실행
npm run start:dev
```

### 3. 프론트엔드 실행

```bash
# 1. 디렉터리 이동
cd front_next

# 2. 의존성 및 패키지 설치
npm install

# 3. 개발 화면 실행
npm run dev

# 4. 브라우저 접속
http://localhost:3001
```

---

## 🛠️ 사용한 기술 스택 및 선택 이유

### 🖥️ Front-End

- **기술 스택**: Next.js (TypeScript), TanStack Query
- **선택 이유**:
  - **Next.js**: 서버 컴포넌트를 활용하여 초기 로딩 속도를 최적화하고, 파일 기반 라우팅을 통해 직관적인 페이지 구조와 효율적인 레이아웃 관리를 위함.
  - **TanStack Query**: 서버 상태를 효과적으로 캐싱하고, 데이터 페칭 과정에서 발생하는 로딩 및 에러 상태를 일관되게 관리함으로써 보다 사용자 경험을 향상시키기 위함.

### ⚙️ Back-End

- **기술 스택**: NestJS (TypeScript), Prisma ORM
- **선택 이유**:
  - **NestJS**: 아키텍처의 모듈화를 통해 비즈니스 로직의 관심사를 명확하게 분리하고, 똑독 프로젝트의 핵심인 `DTO 유효성 검증`, `전역 예외 처리`, `무결성 검증 로직` 등을 보다 체계적이고 확장성 있게 구축하기 위함.
  - **Prisma ORM**: 선언적인 스키마 정의를 통해 데이터베이스 구조를 한눈에 파악하고, 강력한 컴파일 타임 타입 안정성을 바탕으로 쿼리 작성 시 발생할 수 있는 에러를 사전에 방지하기 위함.

### 🤖 LLM API

- **기술 스택**: OpenAI API (`gpt-4o-mini`)
- **선택 이유**:
  - 사용자의 선호 장르, 연령대, 관심사(`genre`, `ageGroup`, `interests`)를 바탕으로 맞춤 도서를 구조화된 JSON 형태로 안정적으로 도출하기 위함.
  - 토큰 비용 대비 뛰어난 응답 속도와 산출 퀄리티를 제공함으로써, 해당 AI 추천 서비스의 비용 효율성과 사용자 경험을 모두 만족시키기 위함.

---

## 🏗️ 아키텍처 및 컨벤션

### 전체 구조

```text
[ Client / Next.js ]
       │ (HTTP 요청 & Axios 에러 파싱)
       ▼
[ Back-End / NestJS (Modular Architecture) ]
       │ (DTO 검증 및 비즈니스 로직 / 예외 처리)
       ▼
[ Database / Prisma ORM & SQLite ] + [ External / OpenAI API ]
```

### 백엔드 구조 (`back_nest`)

```text
src/
├── app.module.ts          # 루트 모듈 (전역 설정 및 모듈 통합)
├── main.ts                # 애플리케이션 진입점 (CORS, ValidationPipe 설정)
└── books/                 # 도서 관리 도메인 모듈
    ├── books.controller.ts # 클라이언트 HTTP 요청 수신 및 라우팅
    ├── books.service.ts   # 비즈니스 로직 (CRUD, 날짜/페이지 무결성 검증)
    └── dto/               # 데이터 전송 객체 (class-validator 유효성 검증)
```

### 프론트엔드 구조 (`front_next`)

```text
src/
├── app/                   # App Router 기반 페이지 라우팅
├── components/            # 공통 컴포넌트 (BookModal 통합 리팩토링 적용)
├── services/              # API 요청 및 Axios 예외 핸들링 유틸
└── types/                 # 도서 및 폼 데이터 타입 정의
```

### 네이밍 컨벤션

- **변수, 함수**: 카멜 케이스를 사용하여 소문자로 시작하고 단어가 바뀔 때 대문자로 표기함. (예: `updateBook`, `newCurrentPage`, `isNewlyCompleted`)
- **클래스, 인터페이스, 타입**: 파스칼 케이스를 사용하여 대문자로 시작하도록 표기함. (예: `BooksController`, `BooksService`, `UpdateBookDto`, `Book`)
- **컴포넌트**: 파스칼 케이스를 사용하여 대문자로 시작하도록 표기함. (예: `BookModal.tsx`, `AddBookModal`)
- **상수**: 스네이크 케이스를 사용하여 대문자와 언더바 조합으로 표기함. (예: `INITIAL_FORM_DATA`)

### 코드 스타일 컨벤션

- **엄격한 타입 지정**:
  - `any` 타입 사용을 지양하고, 명확한 인터페이스 및 타입 정의를 통해 런타임 에러를 사전에 방지하고자 함.
- **SRP 준수 및 가독성 향상**:
  - 컴포넌트의 단일 책임 원칙을 준수하여 역할을 분리함.
  - 복잡한 조건문은 조기 반환(Early Return) 패턴을 활용하여 가독성을 향상시킴.
- **API 함수 및 유틸 함수 분리**: API 통신 로직 함수(/api)와 순수 데이터 변환 로직 함수(/utils)를 분리함으로써 재사용성을 향상시킴.

---

## 🗄️ DB 스키마 구조 및 설계 이유

### 스키마 구조 (`Book`)

| Field             | Type          | Description             |
| :---------------- | :------------ | :---------------------- |
| `id`              | String (UUID) | Primary Key (PK)        |
| `title`           | String        | 책 제목                 |
| `startDate`       | DateTime      | 독서 시작일             |
| `targetDate`      | DateTime      | 목표 완독일             |
| `currentPage`     | Int           | 현재까지 읽은 페이지 수 |
| `totalPages`      | Int           | 총 페이지 수            |
| `finishedReading` | Int           | 완독 횟수               |
| `createdAt`       | DateTime      | 생성 일시               |
| `updatedAt`       | DateTime      | 수정 일시               |

### 설계 이유

- **독서목록 중복 방지**: 독서 생성 및 수정 시, 동일 제목(`title`)의 독서 목록이 이미 존재하는지 검사함으로써 데이터 중복을 방지하기 위함.

- **남은 일 수 계산**: 독서 시작일(`startDate`)과 목표 완독일(`targetDate`)을 바탕으로 남은 일 수를 계산함으로써 하루 권장 독서량을 산출하기 위함.

- **남은 페이지 수 계산**: 사용자가 현재까지 읽은 페이지 수(`currentPage`)와 총 페이지 수(`totalPages`)를 바탕으로 남은 페이지 수를 계산함으로써 하루 권장 독서량을 산출하기 위함.

- **완독 횟수 파악**: 사용자가 현재까지 읽은 페이지 수가 총 페이지 수와 같아질때 완독 횟수(`finishedReading`)가 자동으로 1 증가되도록 함으로써 완독 횟수를 파악하기 위함.

---

## 💡 개발 시 고민했던 점 및 아쉬운 점

### 고민했던 점

- **컴포넌트 재사용성과 유지보수성 최적화**:
  - 초기 구현 시, 독서 등록 모달(`AddBookModal`)과 독서 수정 모달(`EditBookModal`)이 거의 동일한 폼 UI를 공유하고 있어 코드 중복이 발생했습니다. 이를 해결하기 위해 하나의 공통 독서 모달 (`BookModal`)로 통합하고, 전달되는 `book` 데이터의 유무에 따라 등록 모달인지 수정 모달인지 (`isEditMode`) 여부를 구분함으로써, 각 폼 상태가 알맞게 초기화되고, 뮤테이션 로직이 적절하게 분기되도록 설계했습니다. 그리고, 이를 통해 컴포넌트 응집도와 유지보수 용이성을 이전보다 향상시켰습니다.

### 아쉬운 점

- **인증 및 인가 부재**:
  - 사용자별 개인 독서 관리를 위해 회원가입 및 로그인 기능을 도입하고자 하였으나, 프로젝트 마감 기한과 핵심 서비스 완성도에 집중하기 위해 과감히 생략하였습니다. 하지만, 향후 확장성 측면에서 인증 모듈을 추가하여 멀티 테넌시 환경으로 고도화하고자 합니다.
