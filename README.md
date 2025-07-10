# Shortly-Clone-Project

서버측 설정과 API(Spring boot)
📁 엔티티 (Entity)
User: 사용자 정보 (JWT 인증 지원) + 즐겨찾기 태그 리스트
Video: 영상 정보 (제목, 설명, URL, 썸네일, 소유자)
Tag: 태그 정보
VideoTag: Video와 Tag 간의 다대다 관계 매핑

📁 DTO (Data Transfer Object)
요청 DTO:
SignupRequest, LoginRequest, VideoUploadRequest
응답 DTO:
UserResponse, VideoResponse, VideoSearchResponse
공통 DTO:
ApiResponse, LoginResponse

📁 Repository
UserRepository: 사용자 CRUD 및 이메일/사용자명 검색
VideoRepository: 영상 CRUD, 키워드 검색, 태그별 필터링
TagRepository: 태그 CRUD

📁 Service
UserService: 회원가입, 로그인, 사용자 정보 조회 + 즐겨찾기 태그 관리
VideoService: 영상 업로드, 검색, 삭제
FileService: 파일 업로드, 썸네일 생성, 파일 삭제

📁 Controller
AuthController: /api/auth/* - 회원가입, 로그인, 로그아웃
UserController: /api/user/* - 사용자 정보 조회 + 즐겨찾기 태그 관리
VideoController: /api/videos/* - 영상 업로드, 검색, 삭제

📁 설정
build.gradle: JWT, Spring Security, JPA, Validation 의존성 추가
application.properties: 데이터베이스, JWT, 파일 업로드 설정

데이터베이스 - 테이블 구조(MySQL)
users (id, username, email, password, profile_picture, created_at, updated_at, role)
videos (id, title, description, url, thumbnail_url, owner_id, created_at, updated_at)
tags (id, name, created_at)
video_tags (id, video_id, tag_id)
user_favorite_tags (user_id, tag_id)

스토리지 - AWS S3 사용 예정

API 엔드포인트
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/user/me
POST /api/user/favorites/tags?tagName=태그명
GET /api/user/favorites/tags
DELETE /api/user/favorites/tags/{tagName}
POST /api/videos
GET /api/videos/search?keyword=검색어
GET /api/videos/tag/{tagName}
DELETE /api/videos/{videoId}

======================================================================================================

프론트측 구조(Expo기반의 React Native)
App.tsx
  앱의 진입점. 네비게이션 컨테이너, 전역 Provider 등 전체 구조 담당
assets/
  이미지, 폰트 등 정적 리소스
src/screens/
  각 화면(페이지)별 컴포넌트 (예: 홈, 업로드, 상세, 프로필 등)
src/components/
  여러 화면에서 재사용 가능한 UI 컴포넌트 (예: 영상 카드, 버튼 등)
src/navigation/
  네비게이션(Stack, Tab 등) 관련 설정 및 컴포넌트
src/api/
  서버와의 통신(REST API 호출 등) 관련 함수
src/hooks/
  커스텀 훅(예: 인증, 데이터 패칭 등)
src/contexts/
  Context API를 활용한 전역 상태 관리
src/utils/
  유틸리티 함수, 상수, 포맷터 등
