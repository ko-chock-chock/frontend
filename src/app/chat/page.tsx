"use client";
import { useState } from "react";
import Modal from "@/commons/Modal";
import StarRating from "@/components/review/StarRating";
import Button from "@/commons/Button";
import Image from "next/image";

export default function ChatExample() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleReviewSubmit = () => {
    console.log("Rating submitted:", rating);
    setIsReviewModalOpen(false);
    setRating(0);
  };

  return (
    <div>
      {/* 페이지 타이틀 */}
      <h1 className="text-title-xl">홍길동</h1>

      {/* 후기 작성하기 버튼 */}
      <Button design="design2" onClick={() => setIsReviewModalOpen(true)}>
        <Image
          src="/icons/chat_thumb-up_icon_20px.svg"
          alt="후기 작성"
          width={20}
          height={20}
        />
        {/* <img
          src="/icons/chat_thumb-up_icon_20px.svg"
          alt="후기 작성"
          width={20}
          height={20}
        /> */}
        후기 작성하기
      </Button>

      {/* 리뷰 모달 */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setRating(0);
        }}
        onConfirm={handleReviewSubmit}
        title="상담 리뷰"
        confirmText="평가하기"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-base-medium">상대방을 평가해 주세요!</p>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
      </Modal>
    </div>
  );
}
