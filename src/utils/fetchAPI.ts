// ✅ 액세스 토큰 가져오기
const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

// ✅ 현재 로그인한 사용자 ID 가져오기 - 안써서 잠시 주석
// const getUserId = (): number | null => {
//   const userStorageStr = localStorage.getItem("user-storage");
//   if (!userStorageStr) return null;

//   try {
//     const userStorageData = JSON.parse(userStorageStr);
//     return userStorageData?.state?.user?.id || null;
//   } catch (error) {
//     console.error("❌ 유저 ID 파싱 실패:", error);
//     return null;
//   }
// };

// ✅ 공통 Fetch API 함수 (제네릭 활용)
export const fetchAPI = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>
): Promise<{ success: boolean; data?: T; message?: string }> => {
  const token = getAccessToken();
  if (!token) {
    console.warn("🚨 인증 토큰 없음! 요청이 거부될 수 있음");
  }

  // ✅ 현재 환경에 맞는 프로토콜 설정 (HTTPS 환경이면 'https', HTTP 환경이면 'http')
  const httpProtocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = `${httpProtocol}://3.36.40.240:8001${url}`;

  try {
    const response = await fetch(baseUrl, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // ✅ 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "서버 요청 실패");
    }

    const responseData: T = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류 발생",
    };
  }
};

// ✅ 데이터 가져오기 (GET)
export const fetchData = async <T>(
  url: string
): Promise<{ success: boolean; data?: T; message?: string }> => {
  return fetchAPI<T>(url, "GET");
};

// ✅ 데이터 생성하기 (POST)
export const postData = async <T>(
  url: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data?: T; message?: string }> => {
  return fetchAPI<T>(url, "POST", body);
};

// ✅ 데이터 수정하기 (PUT)
export const putData = async <T>(
  url: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data?: T; message?: string }> => {
  return fetchAPI<T>(url, "PUT", body);
};

// ✅ 데이터 삭제하기 (DELETE)
export const deleteData = async <T>(
  url: string
): Promise<{ success: boolean; data?: T; message?: string }> => {
  return fetchAPI<T>(url, "DELETE");
};
