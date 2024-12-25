'use client';

import Image from "next/image";

const JobDetailPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 상단 이미지 */}
      <div className="flex items-stretch h-[23.4375rem]">
        <Image
          src="/images/imgFrame.png"
          alt="드롭다운 메뉴 토글 아이콘"
          className="object-cover h-full w-full"
          width={0}
          height={0} 
        />
      </div>

      {/* 본문 내용 */}
      <div className="px-5">
        {/* 프로필 및 상단 정보 */}
        <div className="flex items-start space-x-3 mt-[1.5rem]">
          {/* 프로필사진 */}
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            {/* 이름과 아이콘 그룹 */}
            <div className="flex justify-between items-center w-full">
              <div className="text-text-primary font-sm">홍길동</div>
              <div className="flex space-x-1">
                <span className="flex items-center">
                <Image
                  src="/icons/post_list_view_icon_24px.svg"
                  alt="Post List View Icon"
                  width={24}
                  height={24}
                />
                  <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                </span>

                <span className="flex items-center">
                <Image
                  src="/icons/post_list_like_icon_24px.svg"
                  alt="Post List View Icon"
                  width={24}
                  height={24}
                />
                  <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                </span>

                <span className="flex items-center">
                <Image
                  src="/icons/post_list_chat_icon_24px.svg"
                  alt="Post List View Icon"
                  width={24}
                  height={24}
                />
                  <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                </span>
              </div>
            </div>
            <p className="text-text-tertiary text-sm">서울시 강동구 · 1주 전</p>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-base font-bold text-text-primary mt-[1.5rem]">
          강아지 1시간 30분 정도 산책 시켜주실 분 구합니다
        </h1>

        {/* 가격 */}
        <p className="text-jobListPrice text-text-primary mt-1">20,000원</p>

        {/* 상세 설명 */}
        <p className="text-sm text-text-secondary leading-6 mt-4">
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
          강동중학교 근처 ○○아파트에서 만나서 1시간 30분 정도 강아지 산책 시켜 주실 분 구합니다.
          소형견이고 믹스견이고 사람 좋아합니다. 12월 7일(금) 6시쯤 만나서 저희 아파트 근처 돌아 주실 분 구합니다.
        </p>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center w-full py-[1.25rem] px-[1.25rem] rounded-t-[2rem] shadow-[0_-0.25rem_1.875rem_rgba(0,0,0,0.1)] space-x-3">
      {/* 좋아요 버튼 */}
      <button className="flex justify-center items-center rounded-[0.75rem]">
        <Image
          src="/images/post_detail_like_selected_img_56px.svg"
          alt="Post List View Icon"
          width={56}
          height={56}
        />
      </button>

      {/* 채팅하기 버튼 */}
      <button className="flex px-[1.25rem] py-[1rem] justify-center items-center gap-[0.25rem] flex-1 rounded-[0.75rem] bg-primary text-base-bold text-white">
        채팅하기
      </button>
    </div>

    </div>
  );
};

export default JobDetailPage;
