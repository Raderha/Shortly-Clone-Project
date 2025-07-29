# API 레이어 구조

## 개요
API 레이어는 백엔드 서버와의 통신을 담당하며, 기능별로 분리되어 있습니다.

## 파일 구조

```
src/api/
├── index.ts          # 모든 API export
├── config.ts         # API 설정 및 엔드포인트
├── types.ts          # API 관련 타입 정의
├── apiUtils.ts       # 공통 유틸리티 함수
├── auth.ts           # 인증 관련 API
├── video.ts          # 비디오 관련 API
├── user.ts           # 사용자 관련 API
└── search.ts         # 검색 관련 API
```

## 주요 기능

### 1. 환경변수 관리
- `EXPO_PUBLIC_API_BASE_URL`: API 서버 URL
- `API_CONFIG`: 타임아웃, 재시도 횟수 등 설정

### 2. 공통 에러 처리
- `handleApiError`: 에러 객체를 일관된 형태로 변환
- `handleApiResponse`: HTTP 응답을 성공/실패로 처리
- `apiCallWithRetry`: 네트워크 오류 시 자동 재시도

### 3. 인증 처리
- `authFetch`: 토큰을 자동으로 포함한 fetch 래퍼
- 401 응답 시 자동 로그아웃 처리

## 사용 예시

```typescript
import { uploadVideo, likeVideo } from '../api';

// 영상 업로드
const result = await uploadVideo(formData, token);
if (result.success) {
  console.log('업로드 성공:', result.video);
}

// 좋아요 처리
const likeResult = await likeVideo(videoId, token);
if (likeResult.success) {
  console.log(likeResult.message);
}
```

## 환경 설정

1. `env.example` 파일을 `.env`로 복사
2. `EXPO_PUBLIC_API_BASE_URL`을 실제 서버 URL로 설정

```bash
cp env.example .env
```

## 타입 안전성

모든 API 함수는 TypeScript 타입을 사용하여 컴파일 타임에 타입 안전성을 보장합니다.

- `ApiResponse<T>`: 기본 응답 타입
- `VideoResponse`: 비디오 데이터 타입
- `AuthResponse`: 인증 응답 타입
- `UploadResponse`: 업로드 응답 타입
