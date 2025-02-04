import React from "react";

interface InputProps {
  type?: "text" | "password" | "email" | "number"; // 필요한 타입 정의
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  error?: string;
  name?: string; // React Hook Form을 위한 속성 추가
  id?: string; // label 연결을 위한 속성 추가
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  error,
  name, // props 추가
  id, // props 추가
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} flex px-4 py-4 items-center gap-2 self-stretch rounded-lg border focus:border-[rgba(27,141,90,0.93)] focus:outline-none`}
        name={name} // name 속성 추가
        id={id} // id 속성 추가
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}{" "}
      {/* 오류 메시지 */}
    </div>
  );
};

export default Input;
