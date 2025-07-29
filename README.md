# 🎬 Shortly-Clone-Project

짧은 영상 기반의 플랫폼을 클론한 포트폴리오 프로젝트입니다.  
서버는 Spring Boot, 클라이언트는 Expo 기반 React Native로 구성되어 있습니다.

---

## 🏗️ 프로젝트 구조

### 📁 Backend (Spring Boot)

```
backend/
├── src/main/java/com/shortly/backend/
│   ├── domain/
│   │   ├── user/
│   │   │   ├── controller/UserController.java
│   │   │   ├── service/UserService.java
│   │   │   ├── repository/UserRepository.java
│   │   │   ├── entity/User.java
│   │   │   └── dto/
│   │   │       ├── SignupRequest.java
│   │   │       ├── LoginRequest.java
│   │   │       └── UserResponse.java
│   │   ├── video/
│   │   │   ├── controller/VideoController.java
│   │   │   ├── service/VideoService.java
│   │   │   ├── repository/VideoRepository.java
│   │   │   ├── entity/Video.java
│   │   │   └── dto/
│   │   │       ├── VideoResponse.java
│   │   │       └── VideoSearchResponse.java
│   │   └── tag/
│   │       ├── entity/Tag.java
│   │       └── repository/TagRepository.java
│   ├── auth/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtTokenProvider.java
│   │   └── SecurityConfig.java
│   ├── config/
│   │   └── WebConfig.java
│   ├── utils/
│   │   ├── Constants.java
│   │   ├── ValidationUtils.java
│   │   └── FileUtils.java
│   └── common/
│       └── dto/ApiResponse.java
```

### 📁 Frontend (React Native + Expo)

```
Client/
├── src/
│   ├── api/
│   │   ├── index.ts
│   │   ├── config.ts
│   │   ├── types.ts
│   │   ├── apiUtils.ts
│   │   ├── auth.ts
│   │   ├── video.ts
│   │   └── user.ts
│   ├── components/
│   │   ├── VideoCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── UploadForm.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── VideoDetailScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useVideoUpload.ts
│   │   └── useVideoPlayer.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   ├── index.ts
│   │   ├── validation.ts
│   │   └── format.ts
│   ├── constants/
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── App.tsx
└── package.json
```

---

## ✅ Backend 구조 상세

### 📁 Entity
- `User`: 사용자 정보 (JWT 인증 지원), 즐겨찾기 태그 리스트 포함  
- `Video`: 영상 정보 (제목, 설명, URL, 썸네일, 소유자)  
- `Tag`: 태그 정보  
- `VideoTag`: Video와 Tag 간 다대다 관계 매핑  

### 📁 DTO (Data Transfer Object)

**요청 DTO**
- `SignupRequest`  
- `LoginRequest`  
- `VideoUploadRequest`  

**응답 DTO**
- `UserResponse`  
- `VideoResponse`  
- `VideoSearchResponse`  

**공통 DTO**
- `ApiResponse`  
- `LoginResponse`

### 📁 Repository
- `UserRepository`: 사용자 CRUD 및 이메일/사용자명 검색  
- `VideoRepository`: 영상 CRUD, 키워드 검색, 태그별 필터링  
- `TagRepository`: 태그 CRUD  

### 📁 Service
- `UserService`: 회원가입, 로그인, 사용자 정보 조회, 즐겨찾기 태그 관리  
- `VideoService`: 영상 업로드, 검색, 삭제 (ValidationUtils 통합)  
- `FileService`: 파일 업로드, 썸네일 생성, 파일 삭제  

### 📁 Controller
- `AuthController`: `/api/auth/*` - 회원가입, 로그인, 로그아웃  
- `UserController`: `/api/user/*` - 사용자 정보 조회, 즐겨찾기 태그 관리  
- `VideoController`: `/api/videos/*` - 영상 업로드, 검색, 삭제  

### 📁 Utils (새로 추가)
- `Constants.java`: API, 파일, 검증, JWT, 에러 메시지 등 상수 정의
- `ValidationUtils.java`: 파일, 제목, 설명, 태그, 이메일, 비밀번호 검증
- `FileUtils.java`: 파일 확장자, 이름 생성, 크기 포맷, 디렉토리 관리

### 📁 설정
- `build.gradle`: JWT, Spring Security, JPA, Validation 등의 의존성 추가  
- `application.properties`: 데이터베이스, JWT, 파일 업로드 관련 설정  

---

## ✅ Frontend 구조 상세

### 📁 API Layer
- `config.ts`: API 설정 및 엔드포인트 정의
- `types.ts`: API 요청/응답 타입 정의
- `apiUtils.ts`: 인증 토큰 처리, FormData 처리, 재시도 로직
- `auth.ts`: 인증 관련 API (회원가입, 로그인)
- `video.ts`: 비디오 관련 API (업로드, 검색, 좋아요)
- `user.ts`: 사용자 관련 API (프로필, 즐겨찾기)

### 📁 Utils (새로 추가)
- `validation.ts`: 파일, 제목, 설명, 태그, 이메일, 비밀번호 검증
- `format.ts`: 파일 크기, 시간, 날짜, 조회수, 좋아요 수 포맷팅
- `index.ts`: 모든 유틸리티 함수 통합 export

### 📁 Constants (새로 추가)
- `index.ts`: API, 앱, UI, 에러 메시지, 성공 메시지 상수 정의

### 📁 Types (새로 추가)
- `index.ts`: TypeScript 타입 정의 통합

### 📁 Hooks
- `useAuth.ts`: 인증 상태 관리
- `useVideoUpload.ts`: 비디오 업로드 로직 (FormData 처리)
- `useVideoPlayer.ts`: 비디오 재생 관리

### 📁 Contexts
- `AuthContext.tsx`: 전역 인증 상태 관리

---

### 🗄️ 데이터베이스 - 테이블 구조 (MySQL)

```sql
users (
  id, username, email, password, profile_picture,
  created_at, updated_at, role
)

videos (
  id, title, description, url, thumbnail_url, owner_id,
  created_at, updated_at
)

tags (
  id, name, created_at
)

video_tags (
  id, video_id, tag_id
)

user_favorite_tags (
  user_id, tag_id
)
```

---

## ☁️ 스토리지
AWS S3 사용 예정  

---

## 🌐 API 엔드포인트

### 인증 / 사용자
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/user/me` - 사용자 정보 조회

### 즐겨찾기
- `POST /api/user/favorites/tags?tagName=태그명` - 태그 즐겨찾기 추가
- `GET /api/user/favorites/tags` - 즐겨찾기 태그 목록
- `DELETE /api/user/favorites/tags/{tagName}` - 태그 즐겨찾기 삭제

### 영상
- `POST /api/videos` - 영상 업로드 (FormData)
- `GET /api/videos/search?keyword=검색어` - 영상 검색
- `GET /api/videos/tag/{tagName}` - 태그별 영상 조회
- `DELETE /api/videos/{videoId}` - 영상 삭제
- `POST /api/videos/{videoId}/like` - 영상 좋아요
- `DELETE /api/videos/{videoId}/like` - 영상 좋아요 취소
- `GET /api/videos/{videoId}/is-liked` - 좋아요 상태 확인

---

## 🛠️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **File Upload**: MultipartFile
- **Build Tool**: Gradle

### Frontend
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Context API
- **HTTP Client**: Fetch API
- **Image/Video Picker**: Expo Image Picker

---

## 🚀 실행 방법

### Backend 실행
```bash
cd backend
./gradlew bootRun
```

### Frontend 실행
```bash
cd Client
npm install
npx expo start
```
