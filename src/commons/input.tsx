/* eslint-disable react/display-name */
import React, { forwardRef } from "react";

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

// ✅ forwardRef를 사용하여 ref를 올바르게 전달
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder = "",
      value = "", //기본값이 undefined로 설정되므로 초기값을 ''빈문자열로 설정 수정함
      onChange,
      className = "",
      error,
      name,
      id,
    },
    ref
  ) => {
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
          ref={ref} // ✅ ref 연결 (forwardRef 사용)
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}{" "}
        {/* 오류 메시지 */}
      </div>
    );
  }
);

export default Input;
