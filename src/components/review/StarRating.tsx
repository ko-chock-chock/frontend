// components/StarRating.tsx
'use client';
import { useState, useRef } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];
    
    // 터치 위치를 기준으로 별점 계산
    const touchX = touch.clientX - containerRect.left;
    const starWidth = containerRect.width / 5;
    const newRating = Math.ceil(touchX / starWidth);
    
    // 1-5 범위로 제한
    const clampedRating = Math.max(1, Math.min(5, newRating));
    
    onRatingChange(clampedRating);
  };

  const handleTouchEnd = () => {
    // 터치 끝났을 때의 처리
    setHover(0);
  };

  return (
    <div 
      ref={containerRef}
      className="flex gap-2 touch-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="w-10 h-10"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <svg
            viewBox="0 0 24 24"
            fill={star <= (hover || rating) ? '#FFD700' : '#E5E5E5'}
            className="w-full h-full"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}