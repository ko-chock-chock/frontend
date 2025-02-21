// ✅ 엑세스 토큰 가져오기
const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

// ✅ 현재 로그인한 사용자 ID 가져오기
const getUserId = (): number | null => {
  const userStorageStr = localStorage.getItem("user-storage");
  if (!userStorageStr) return null;

  try {
    const userStorageData = JSON.parse(userStorageStr);
    return userStorageData?.state?.user?.id || null;
  } catch (error) {
    console.error("❌ 유저 ID 파싱 실패:", error);
    return null;
  }
};

// ✅ 공통 Fetch API 함수
export const fetchAPI = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) => {
  const token = getAccessToken();
  if (!token) {
    console.warn("🚨 인증 토큰 없음! 요청이 거부될 수 있음");
  }

  try {
    const response = await fetch(`http://3.36.40.240:8001${url}`, {
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

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류 발생",
    };
  }
};

// ✅ 데이터 가져오기 (GET)
export const fetchData = async (url: string) => {
  return fetchAPI(url, "GET");
};

// ✅ 데이터 생성하기 (POST)
export const postData = async (url: string, body: any) => {
  return fetchAPI(url, "POST", body);
};

// ✅ 데이터 수정하기 (PUT)
export const putData = async (url: string, body: any) => {
  return fetchAPI(url, "PUT", body);
};

// ✅ 데이터 삭제하기 (DELETE)
export const deleteData = async (url: string) => {
  return fetchAPI(url, "DELETE");
};
