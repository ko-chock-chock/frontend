// 로티 때문에 만든 파일
// src/custom.d.ts 또는 types/custom.d.ts 파일에 추가
declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-player": any; // 'any' 타입을 사용하여 기본적인 오류를 제거합니다.
  }
}
