import Image from "next/image";

export default function ChatBox() {
  return (
    <main className="mx-5">
      <div className="flex h-[3rem] justify-between items-center items-start">
        <Image
          className="mr-8"
          src="/icons/Back_icon_24px.svg" // 로컬 파일 경로
          alt="Back Icon"
          width={24} // 크기
          height={24}
        />
        <span className=" overflow-hidden text-center text-[#26220D] text-[1.25rem] font-bold leading-[1.875rem] tracking-[-0.03125rem]">
          홍길동
        </span>
        <button className=" w-[4rem] h-[2.75rem]  text-center text-white text-[0.875rem] font-bold leading-[1.3125rem] tracking-[-0.02188rem] rounded-[3rem] bg-[#4D9933]">
          승인
        </button>
      </div>
      <section className="flex w-[23.4375rem] flex-col items-start gap-6">
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
            <span className="text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
              오후 12:56
            </span>
          </div>
        </div>

        {/* 내 채팅 */}
        <div className="w-[100%] flex justify-end items-end gap-1 align-self-stretch">
          <span className="text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
            오후 12:56
          </span>
          <div className="max-w-[79%] flex p-2.5 px-3 justify-center items-center rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none bg-[#E9E8E3] text-[#26220D] text-base font-suit font-medium leading-[1.5rem] tracking-[-0.025rem]">
            텍스트를 입력해주세요. 텍스트를 입력해주세요. 텍스트를 입력해주세요.
            텍스트를 입력해주세요.
          </div>
        </div>
        <div></div>
        <div></div>
      </section>
      <footer></footer>
    </main>
  );
}
