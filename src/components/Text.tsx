// src/components/Test.tsx
'use client';

import { authenticatedFetch } from '../components/auth/utils/tokenUtils';
import { useEffect } from 'react';

export default function TestComponent() {
  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await authenticatedFetch('/api/users/4');
        const data = await response.json();
        console.log('응답:', data);
      } catch (error) {
        console.error('에러:', error);
      }
    };

    testAuth();
  }, []);

  return <div>토큰 테스트 중...</div>;
}

