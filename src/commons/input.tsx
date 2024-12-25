import React from "react";

interface InputProps {
  type?: "text" | "password" | "email" | "number"; // 필요한 타입 정의
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  error,
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} flex px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}{" "}
      {/* 오류 메시지 */}
    </div>
  );
};

export default Input;
