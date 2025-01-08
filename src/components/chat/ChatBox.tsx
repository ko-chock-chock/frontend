import Button from "@/commons/Button";
import Image from "next/image";

export default function ChatBox() {
  return (
    <main className="flex flex-col h-screen text-[#26220D] font-suit text-base">
      <section className="px-8 py-2 border-t border-b border-gray-300 mb-4">
        <div className="flex">
          <div
            className="w-12 h-12 mr-2 rounded-2xl bg-center bg-cover bg-no-repeat flex-shrink-0"
            style={{
              backgroundImage: "url('/path-to-image')", // 여기서 이미지를 적용
              backgroundColor: "#FF0000", // 원하는 배경색 (예: 빨간색)
            }}
          ></div>
          <div className="w-full">
            <div className="flex justify-between">
              <span className="max-w-[250px] truncate">
                제목이 들어가는 자리 입니다입니다입니다.
              </span>
              <span className="font-extrabold">구인중</span>
            </div>
            <div>
              <span className="font-extrabold">10,000 원</span>
            </div>
          </div>
        </div>
        <Button
          design="design5" // design5 스타일은 작은 둥근 버튼 스타일로 적합
          width="fit"
          className="mt-2 text-white text-[0.875rem] font-bold leading-[1.3125rem] tracking-[-0.02188rem] bg-[#4D9933]" // 기존 스타일을 className으로 추가
        >
          산책 승인 하기
        </Button>
      </section>
      <section className="mx-8 flex flex-col items-start gap-6">
        {/* 상대 채팅 */}
        <div className="flex">
          <div
            className="w-12 h-12 mr-2 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
            style={{
              backgroundImage: "url('/path-to-image')", // 여기서 이미지를 적용
              backgroundColor: "#FF0000", // 원하는 배경색 (예: 빨간색)
            }}
          ></div>
          <div className="flex items-end gap-1">
            <div className="max-w-[79%] px-3 py-2 rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg bg-[#BFE5B3] text-[#26220D] text-base font-medium leading-6 tracking-[-0.025rem]">
              텍스트를 입력해주세요. 텍스트를 입력해주세요. 텍스트를
              입력해주세요.
            </div>
            <span className="min-w-[3.8125rem] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
              오후 12:56
            </span>
          </div>
        </div>

        {/* 내 채팅 */}
        <div className="w-[100%] flex justify-end items-end gap-1 align-self-stretch">
          <span className="min-w-[3.8125rem] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
            오후 12:56
          </span>
          <div className="max-w-[79%] flex p-2.5 px-3 justify-center items-center rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none bg-[#E9E8E3] text-[#26220D] text-base font-suit font-medium leading-[1.5rem] tracking-[-0.025rem]">
            텍스트를 입력해주세요. 텍스트를 입력해주세요. 텍스트를 입력해주세요.
            텍스트를 입력해주세요.
          </div>
        </div>
        {/* 산책시작 */}
        <div className="flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
          <div className="flex flex-col self-stretch text-[#26220D] font-suit text-base font-medium leading-[1.5rem] tracking-[-0.025rem]">
            <span>산책을 시작하려 해요!</span>
            <span>우리 반려동물의 위치를 확인해 보세요!</span>
          </div>
          <Button design="design2">
            <Image
              className="mr-1"
              src="/icons/chat_location_icon_20px.svg" // 로컬 파일 경로
              alt="Back Icon"
              width={20} // 크기
              height={20}
            />
            위치 확인하기
          </Button>
        </div>
        <span className="self-stretch text-[#8D8974] font-suit text-sm font-medium leading-[1.125rem] tracking-[-0.01875rem] ">
          오후 12:56
        </span>

        {/* 산책종료 */}
        <div className="flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
          <div className="flex flex-col self-stretch text-[#26220D] font-suit text-base font-medium leading-[1.5rem] tracking-[-0.025rem]">
            <span>산책이 종료되었습니다.</span>
            <span>상대방에 대한 별점을 작성해주세요!</span>
          </div>
          <Button design="design2">
            <Image
              className="mr-1"
              src="/icons/chat_thumb-up_icon_20px.svg" // 로컬 파일 경로
              alt="Back Icon"
              width={20} // 크기
              height={20}
            />
            후기 작성하기
          </Button>
        </div>

        <span className="self-stretch text-[#8D8974] font-suit text-sm font-medium leading-[1.125rem] tracking-[-0.01875rem]">
          오후 12:56
        </span>
      </section>
      <footer className="h-screen flex items-end">
        <div className="mx-0 flex justify-between p-2 px-5 items-center gap-2 w-full bg-[#E9E8E3]">
          <div>
            <Image
              className="mr-1"
              src="/images/chat_image_upload_btn_img_44px.svg"
              alt="photo Icon"
              width={44}
              height={44}
            />
          </div>
          <input
            className="w-full flex p-3 px-4 items-center gap-2 rounded-[2.5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-[#A3A08F] text-base font-medium leading-[1.5rem] tracking-[-0.025rem]"
            type="text"
            placeholder="메세지를 입력해주세요."
          />
          <div>
            <Image
              className="mr-1"
              src="/images/chat_send_btn_img_44px.svg"
              alt="send Icon"
              width={44}
              height={44}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}
