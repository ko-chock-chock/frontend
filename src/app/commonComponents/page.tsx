import Input from "@/commons/input";

export default function exPage() {
  return (
    <>
      <h1>공통 컴포넌트 체크 페이지</h1>
      <Input className="border-blue-500" />
      <br />
      <Input className="w-full" />
      <br />
      <Input className="w-1/2" />
      <br />
      <Input className="w-1/3" />
      <br />
      <Input className="w-1/4" />
      <br />
      <Input className="w-[10%]" />
    </>
  );
}
