// src/components/auth/components/AuthGuard.tsx

/**
 * AuthGuard 컴포넌트
 *
 * 주요 기능:
 * 1. 애플리케이션 전체 페이지의 통합 보안 접근 제어
 * 2. 사용자 인증 및 권한 실시간 검증 메커니즘
 * 3. 리소스 유형별 세분화된 접근 권한 관리
 *    - 게시글 수정/조회 권한
 *    - 채팅방 접근 권한
 *    - 프로필 접근 권한
 * 4. 보안 취약점 방어 및 비정상적 접근 추적
 *
 * 보안 핵심 전략:
 * - JWT 토큰 기반 인증
 * - 사용자 역할 및 권한의 다층적 검증
 * - 민감한 리소스에 대한 엄격한 접근 제한
 * - 비인가 접근 시도에 대한 comprehensive 로깅
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import {
  checkAuthStatus,
  TokenStorage,
} from "@/components/auth/utils/tokenUtils";
import { toast } from "react-hot-toast";
import {
  SecurityEventDetails,
  ChatRoom,
  AuthGuardProps,
  ResourceInfo,
} from "../types/auth";

/**
 * 전역 Window 인터페이스 확장
 *
 * 목적:
 * - 개발 환경에서 지도 테스트 모드를 활성화/비활성화할 수 있는 메소드를 Window 객체에 추가
 * - TypeScript에서 이러한 전역 메소드를 인식할 수 있도록 타입 정의를 확장
 *
 * 사용 방법:
 * - 개발자 콘솔에서 window.enableMapTestMode() 실행: 지도 테스트 모드 활성화
 * - 개발자 콘솔에서 window.disableMapTestMode() 실행: 지도 테스트 모드 비활성화
 *
 * 주의사항:
 * - 실제 프로덕션 환경에서는 이 메소드들이 정의되지 않음 (NODE_ENV === 'development' 조건으로 제한됨)
 * - 이 확장은 TypeScript 컴파일 시에만 사용되며, 런타임에는 영향을 주지 않음
 */
declare global {
  interface Window {
    /** 지도 테스트 모드를 활성화하는 메소드 - localStorage에 mapTestMode 설정 */
    enableMapTestMode: () => void;
    /** 지도 테스트 모드를 비활성화하는 메소드 - localStorage에서 mapTestMode 제거 */
    disableMapTestMode: () => void;
  }
}

/**
 * 보안 이벤트 로깅 함수
 * 현재는 콘솔에만 로깅하도록 구현
 *
 * @param eventType - 발생한 보안 이벤트의 유형
 * @param details - 이벤트와 관련된 상세 정보
 */
const logSecurityEvent = (eventType: string, details: SecurityEventDetails) => {
  // 기본 로그 데이터 구성
  const logData = {
    type: eventType,
    ...details,
  };

  // 일반 로그
  console.log("[AuthGuard][Security Event]", logData);

  // 보안 관련 중요 이벤트는 경고 레벨로 로깅
  if (eventType.includes("UNAUTHORIZED") || eventType.includes("ERROR")) {
    console.warn("[AuthGuard] ⚠️ Security Warning:", logData);
  }
};

export const AuthGuard = ({
  children,
  resource,
  requireAuth = true,
  fallback,
  redirectTo = "/login",
  loadingComponent = <div>Loading...</div>,
}: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        // 1. 인증 불필요한 페이지 사전 처리
        if (!requireAuth) {
          if (isMounted) {
            setIsAuthorized(true);
            setIsLoading(false);
          }
          return;
        }

        // 2. 사용자 인증 상태 검증
        const authResult = await checkAuthStatus();
        if (!authResult.isAuthenticated) {
          if (isMounted) {
            setIsLoading(false);
            router.push(redirectTo);
          }
          return;
        }

        // 3. 채팅방 전용 권한 체크 메커니즘
        if (resource?.type === "chat" && resource?.boardId) {
          try {
            const token = TokenStorage.getAccessToken();
            if (!token) {
              throw new Error("인증 토큰 없음");
            }

            // 사용자 정보가 없으면 대기하는 로직 추가
            if (!user || user.id === undefined) {
              console.log("[AuthGuard] 사용자 정보 로딩 중... 잠시 대기 시작", {
                userId: user?.id,
                hasUser: !!user,
              });

              // 사용자 정보 로딩 대기 (최대 3초)
              let attempts = 0;
              const maxAttempts = 15; // 200ms * 15 = 3초

              const waitForUser = () =>
                new Promise<boolean>((resolve) => {
                  const checkUser = () => {
                    attempts++;
                    const currentUser = useUserStore.getState().user;

                    if (currentUser && currentUser.id) {
                      console.log(
                        "[AuthGuard] 사용자 정보 로딩 완료:",
                        currentUser.id
                      );
                      resolve(true);
                      return;
                    }

                    if (attempts >= maxAttempts) {
                      console.log("[AuthGuard] 사용자 정보 로딩 타임아웃");
                      resolve(false);
                      return;
                    }

                    setTimeout(checkUser, 200);
                  };

                  checkUser();
                });

              const userLoaded = await waitForUser();
              if (!userLoaded) {
                console.log("[AuthGuard] 사용자 정보 로딩 실패, 리다이렉트");
                if (isMounted) {
                  setIsLoading(false);
                  router.push(redirectTo);
                }
                return;
              }

              // 사용자 정보가 로드된 후 최신 정보 가져오기
              const updatedUser = useUserStore.getState().user;
              if (!updatedUser || updatedUser.id === undefined) {
                throw new Error("사용자 정보를 로드할 수 없음");
              }
            }

            // 현재 경로를 usePathname을 통해 가져오기
            const currentPath = pathname || "";

            // 안전한 path 값 생성 (undefined 방지)
            const finalPath = resource.path || currentPath || "";

            // ResourceInfo 타입으로 명시적 타입 지정
            const resourceWithPath: ResourceInfo = {
              ...resource,
              path: finalPath,
              type: "chat",
            };

            // 경로 디버깅 로그 추가
            console.log("[AuthGuard][채팅/지도 접근 디버깅]", {
              boardId: resourceWithPath.boardId,
              chatId: resourceWithPath.chatId,
              path: resourceWithPath.path,
              isMapPath: resourceWithPath.path
                ? resourceWithPath.path.includes("/map")
                : false,
              userId: user?.id,
              hasUser: !!user,
            });

            // 지도 페이지 접근 권한 체크
            const isMapPath = resourceWithPath.path
              ? resourceWithPath.path.includes("/map")
              : false;

            if (isMapPath) {
              console.log("[AuthGuard] [지도 페이지] 접근 처리 시작");

              // 개발 환경에서만 활성화되는 테스트 모드 확인
              // URL에 test=true 쿼리가 있거나 로컬 스토리지에 mapTestMode가 설정된 경우
              const urlParams = new URLSearchParams(window.location.search);
              const isTestMode =
                process.env.NODE_ENV === "development" &&
                (urlParams.get("test") === "true" ||
                  localStorage.getItem("mapTestMode") === "true");

              if (isTestMode) {
                console.log(
                  "[AuthGuard] [지도 페이지] 테스트 모드로 접근 허용됨"
                );
                if (isMounted) {
                  setIsAuthorized(true);
                  setIsLoading(false);
                }
                return;
              }

              // 사용자 정보 유효성 재확인
              // 에러 처리 방식 개선
              if (!user || user.id === undefined) {
                console.log("[AuthGuard] 사용자 정보 부족으로 권한 체크 지연");
                // 에러를 던지는 대신 기다리기
                return; // 다음 렌더링 주기에서 다시 시도
              }

              // 채팅방 정보 조회 API 호출
              const response = await fetch(
                `/api/trade/${resourceWithPath.boardId}/chat-rooms`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error("채팅방 정보 조회 실패");
              }

              const chatRooms = await response.json();

              // 사용자 ID 완전성 보장
              const userId = user?.id;

              // 채팅방 접근 권한 검사
              const isAuthorizedUser =
                userId &&
                chatRooms.some(
                  (room: ChatRoom) =>
                    room.writeUserId === userId || room.requestUserId === userId
                );

              // 사용자 유형 확인 (작성자 또는 요청자)
              const userType =
                userId &&
                chatRooms.some((room: ChatRoom) => room.writeUserId === userId)
                  ? "게시물작성자(writeUserId)"
                  : "채팅참여자(requestUserId)";

              // 접근 권한 로그 추가 (한 번에 모든 정보 표시)
              console.log("[AuthGuard] 채팅방/지도 권한 검증:", {
                userId,
                chatRoomId: resourceWithPath.chatId, // 채팅방 ID 추가
                boardId: resourceWithPath.boardId,
                isMapPage: isMapPath,
                권한상태: isAuthorizedUser ? "승인" : "거부",
                사용자타입: userType,
                접근경로: resourceWithPath.path,
              });

              // 권한 있는 경우
              if (isAuthorizedUser) {
                if (isMounted) {
                  setIsAuthorized(true);
                  setIsLoading(false);
                }
              } else {
                // 권한 없는 경우
                console.log(
                  "[AuthGuard] [지도 페이지] 접근 권한 없음 - 채팅방 참여자가 아님"
                );

                // 비인가 접근 시도 로깅
                await logSecurityEvent("UNAUTHORIZED_CHAT_ACCESS", {
                  userId: user?.id,
                  attemptedBoardId: resourceWithPath.boardId,
                  timestamp: new Date().toISOString(),
                });

                toast.error(
                  "지도 페이지 접근 권한이 없습니다.\n해당 게시물 상세 페이지로 이동합니다.",
                  {
                    duration: 3000,
                    position: "top-center",
                  }
                );

                // 게시물 상세 페이지로 리다이렉트
                router.push(`/jobList/${resourceWithPath.boardId}`);
              }
              return;
            }

            // 일반 채팅방 접근 권한 확인 (지도 페이지가 아닌 경우)
            // 채팅방 정보 조회 API 호출
            const response = await fetch(
              `/api/trade/${resourceWithPath.boardId}/chat-rooms`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("채팅방 정보 조회 실패");
            }

            const chatRooms = await response.json();

            // 채팅방 접근 권한 검사
            const isAuthorizedUser = chatRooms.some(
              (room: ChatRoom) =>
                room.writeUserId === user?.id || room.requestUserId === user?.id
            );

            // 사용자 유형 확인 (작성자 또는 요청자)
            const userType =
              user?.id &&
              chatRooms.some((room: ChatRoom) => room.writeUserId === user.id)
                ? "게시물작성자(writeUserId)"
                : "채팅참여자(requestUserId)";

            // 접근 권한 로그 추가
            console.log("[AuthGuard] [채팅방 권한 디버깅]", {
              userId: user?.id,
              사용자타입: userType,
              권한있음: isAuthorizedUser,
              채팅방수: chatRooms.length,
              isMapPath: isMapPath,
            });

            // 권한이 없는 경우 처리
            if (!isAuthorizedUser) {
              // 비인가 접근 시도 로깅
              await logSecurityEvent("UNAUTHORIZED_CHAT_ACCESS", {
                userId: user?.id,
                attemptedBoardId: resourceWithPath.boardId,
                timestamp: new Date().toISOString(),
              });

              // 일반 채팅방인 경우
              toast.error(
                "채팅방 접근 권한이 없습니다.\n해당 게시물 상세 페이지로 이동합니다.",
                {
                  duration: 3000,
                  position: "top-center",
                }
              );

              // 게시물 상세 페이지로 리다이렉트
              router.push(`/jobList/${resourceWithPath.boardId}`);
              return;
            }

            // 일반 채팅방 권한 승인
            if (isMounted) {
              setIsAuthorized(true);
              setIsLoading(false);
            }
            return;
          } catch (error) {
            console.error("[AuthGuard 에러]", error);

            // 에러 발생 시 추가 분기 처리
            const currentPath = pathname || "";
            const isMapPath = currentPath.includes("/map");
            const pathSegments = currentPath.split("/").filter(Boolean);
            const chatId = pathSegments.length >= 3 ? pathSegments[2] : "";

            if (isMapPath && chatId) {
              // 지도 페이지에서 에러 발생 시 채팅방으로 리다이렉트
              console.log(
                "[AuthGuard][지도 페이지] 처리 오류 -> 채팅방으로 리다이렉트"
              );
              if (isMounted) {
                toast.error(
                  "지도 페이지 로드 중 오류가 발생했습니다.\n채팅방으로 이동합니다.",
                  {
                    duration: 3000,
                    position: "top-center",
                  }
                );
                setIsLoading(false);
                router.push(`/jobList/${resource.boardId}/${chatId}`);
              }
            } else {
              // 일반 채팅방 에러 시 게시글 목록으로 리다이렉트
              if (isMounted) {
                setIsLoading(false);
                router.push("/jobList");
              }
            }
            return;
          }
        }

        // 4. 게시글 수정/조회 권한 체크 메커니즘
        if (
          resource?.boardId &&
          (resource?.type === "trade" || resource?.type === "community")
        ) {
          try {
            const token = TokenStorage.getAccessToken();
            if (!token) {
              console.log("[AuthGuard] 토큰 없음");
              if (isMounted) {
                setIsLoading(false);
                router.push(redirectTo);
              }
              return;
            }

            // API 경로 동적 결정
            let apiPath = "";
            let redirectPath = "";

            if (resource.type === "trade") {
              apiPath = `/api/trade/${resource.boardId}`;
              redirectPath = "/jobList";
            } else {
              apiPath = `/api/community/${resource.boardId}`;
              redirectPath = "/communityBoard";
            }

            // 게시글 정보 조회
            const response = await fetch(apiPath, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              console.log("[AuthGuard] 게시글 조회 실패");
              if (isMounted) {
                setIsLoading(false);
                router.push(redirectPath);
              }
              return;
            }

            const responseData = await response.json();

            // 권한 체크 로깅
            console.log("[AuthGuard] 권한 체크:", {
              userId: user?.id,
              writeUserId: responseData?.writeUserId,
              사용자타입:
                user?.id === responseData?.writeUserId
                  ? "게시물작성자(writeUserId)"
                  : "일반사용자",
              isMatch: user?.id === responseData?.writeUserId,
            });

            // 게시글 작성자 권한 최종 검증
            if (!responseData || user?.id !== responseData.writeUserId) {
              console.log("[AuthGuard] 게시글 수정 권한 없음");
              if (isMounted) {
                toast.error(
                  "게시글 수정 권한이 없습니다.\n작성자만 수정이 가능합니다.",
                  {
                    duration: 3000,
                    position: "top-center",
                  }
                );
                setIsLoading(false);
                router.push(redirectPath);
              }
              return;
            }

            // 권한 승인
            if (isMounted) {
              setIsAuthorized(true);
              setIsLoading(false);
            }
            return;
          } catch (error) {
            console.error("[AuthGuard] 게시글 권한 체크 실패:", error);
            if (isMounted) {
              setIsLoading(false);
              const redirectPath =
                resource.type === "trade" ? "/jobList" : "/communityBoard";
              router.push(redirectPath);
            }
            return;
          }
        }

        // 5. 기본 리소스 권한 체크
        if (resource && resource.userId) {
          const hasResourceAccess = user?.id === Number(resource.userId);
          console.log("[AuthGuard] 리소스 접근 권한 체크:", {
            userId: user?.id,
            resourceUserId: resource.userId,
            hasAccess: hasResourceAccess,
          });

          if (!hasResourceAccess) {
            console.log("[AuthGuard] 리소스 접근 권한 없음");
            if (isMounted) {
              setIsAuthorized(false);
              setIsLoading(false);
              if (!fallback) {
                router.push("/");
              }
            }
            return;
          }
        }

        // 6. 모든 검증 조건 통과
        if (isMounted) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthGuard] 인증 체크 중 에러:", error);
        if (isMounted) {
          setIsLoading(false);
          setIsAuthorized(false);
          router.push(redirectTo);
        }
      }
    };

    verifyAuth();

    // 컴포넌트 언마운트 시 상태 정리
    return () => {
      isMounted = false;
    };
  }, [requireAuth, redirectTo, resource, router, user, pathname, fallback]);

  // 테스트 모드 활성화/비활성화 함수 (개발 도구에서 사용)
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    window.enableMapTestMode = () => {
      localStorage.setItem("mapTestMode", "true");
      console.log(
        "🔑 지도 테스트 모드가 활성화되었습니다. 페이지를 새로고침하세요."
      );
    };
    window.disableMapTestMode = () => {
      localStorage.removeItem("mapTestMode");
      console.log(
        "🔒 지도 테스트 모드가 비활성화되었습니다. 페이지를 새로고침하세요."
      );
    };
  }

  // 로딩 상태 렌더링
  if (isLoading) {
    return loadingComponent;
  }

  // 권한 체크 실패 시 폴백 컴포넌트 렌더링
  if (requireAuth && !isAuthorized) {
    return fallback || null;
  }

  // 모든 권한 검증 통과 시 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthGuard;
