/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "../store/userStore";

// 위치 정보를 나타내는 인터페이스
interface ILocation {
  latitude: number;
  longitude: number;
}

// API에서 받아오는 게시물 데이터 인터페이스 (필요에 따라 확장 가능)
interface IBoardData {
  writeUserId: number;
}

// Kakao Map SDK에 대한 타입 선언 (간단히 any로 처리)
declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMapComponent: React.FC = () => {
  const { boardId } = useParams() as { boardId: string };
  const [boardData, setBoardData] = useState<IBoardData | null>(null);
  const [locationData, setLocationData] = useState<ILocation[]>([]);
  const [userLocation, setUserLocation] = useState<ILocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  // 토큰 관련 함수 (필요 시 TokenStorage로 대체 가능)
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  // Zustand에서 로그인한 사용자 정보를 가져옴
  const loggedInUserId = useUserStore((state) => state.user?.id);

  // 1. 게시물 데이터 조회
  useEffect(() => {
    if (!boardId) {
      console.error("🚨 boardId 값이 없습니다. API 요청을 중단합니다.");
      return;
    }

    const token = getAccessToken();
    const fetchBoardData = async () => {
      try {
        console.log("[DEBUG] Fetching board data for boardId:", boardId);
        const response = await fetch(`/api/trade/${boardId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: IBoardData = await response.json();
        console.log("[DEBUG] Board data fetched:", data);
        setBoardData(data);
      } catch (error) {
        console.error("[DEBUG] Error fetching board data:", error);
      }
    };

    fetchBoardData();
  }, [boardId]);

  // 2. Kakao 지도 SDK 로드 및 초기화
  useEffect(() => {
    if (!window.kakao) {
      console.log("[DEBUG] Kakao Maps SDK not found, loading script...");
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      document.head.appendChild(script);
      script.onload = () => {
        console.log("[DEBUG] Kakao Maps SDK loaded");
        window.kakao.maps.load(() => {
          if (boardData) {
            console.log("[DEBUG] boardData available:", boardData);
            if (loggedInUserId !== boardData.writeUserId) {
              console.log(
                "[DEBUG] Role: 산책 알바생 - fetching initial location"
              );
              getInitialLocation();
            } else {
              console.log(
                "[DEBUG] Role: 게시물 작성자 - setting default location"
              );
              setUserLocation({ latitude: 37.5665, longitude: 126.978 });
            }
          }
        });
      };
    } else {
      console.log("[DEBUG] Kakao Maps SDK already loaded");
      window.kakao.maps.load(() => {
        if (boardData) {
          console.log("[DEBUG] boardData available:", boardData);
          if (loggedInUserId !== boardData.writeUserId) {
            getInitialLocation();
          } else {
            setUserLocation({ latitude: 37.5665, longitude: 126.978 });
          }
        }
      });
    }
  }, [boardData, loggedInUserId]);

  // 3. 산책 알바생(불일치 사용자)의 초기 위치 설정 (실시간 위치 업데이트 대상)
  const getInitialLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setUserLocation({ latitude: 37.5665, longitude: 126.978 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`초기 위치 설정: (${latitude}, ${longitude})`);
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error("초기 위치 가져오기 실패:", error);
        setUserLocation({ latitude: 37.5665, longitude: 126.978 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  // 4. userLocation 상태가 설정되면 Kakao 지도 초기화
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    console.log(
      "[DEBUG] Initializing Kakao Map with userLocation:",
      userLocation
    );
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      ),
      level: 3,
    };
    kakaoMapRef.current = new window.kakao.maps.Map(container, options);
  }, [userLocation]);

  // 5. 소켓 연결 및 역할별 위치 업데이트 처리
  useEffect(() => {
    if (!boardData) return;

    // 소켓 연결 생성 (두 역할 모두 연결)
    socketRef.current = io("http://localhost:5001", {
      query: { boardId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("[DEBUG] Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on("connect_error", (err: any) => {
      console.error("[DEBUG] Socket connection error:", err);
    });

    socketRef.current.on("disconnect", () => {
      console.log("[DEBUG] Socket disconnected");
    });

    let interval: NodeJS.Timeout | null = null;

    if (loggedInUserId === boardData.writeUserId) {
      // 게시물 작성자: 위치 업데이트 이벤트 수신
      socketRef.current.on("locationUpdate", (location: ILocation) => {
        console.log("[DEBUG] Received location update from socket:", location);
        setLocationData((prevLocations) => {
          const updatedLocations = [...prevLocations, location];
          updatePolyline(updatedLocations);
          return updatedLocations;
        });
      });
    } else {
      // 산책 알바생: 주기적으로 위치 업데이트 전송
      const updateLocation = () => {
        if (!navigator.geolocation) {
          console.error("Geolocation을 지원하지 않는 브라우저입니다.");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation: ILocation = { latitude, longitude };
            console.log("[DEBUG] 산책 알바생 location update:", newLocation);
            setLocationData((prevLocations) => {
              const updatedLocations = [...prevLocations, newLocation];
              updatePolyline(updatedLocations);
              return updatedLocations;
            });
            if (socketRef.current) {
              console.log(
                "[DEBUG] Emitting locationUpdate event via socket:",
                newLocation
              );
              socketRef.current.emit("locationUpdate", newLocation);
            }
          },
          (error) => {
            console.error("위치 정보 가져오기 실패:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      };

      // 최초 업데이트 후 주기적 업데이트
      updateLocation();
      interval = setInterval(updateLocation, 10000);
    }

    // 컴포넌트 언마운트 또는 boardData 변경 시 소켓 및 interval 정리
    return () => {
      if (interval) clearInterval(interval);
      if (socketRef.current) {
        console.log("[DEBUG] Disconnecting socket...");
        socketRef.current.disconnect();
      }
    };
  }, [boardData, loggedInUserId]);

  // 6. Polyline 업데이트 및 지도 뷰 자동 포커싱
  const updatePolyline = (locations: ILocation[]) => {
    if (!kakaoMapRef.current || locations.length === 0) return;

    const linePath = locations.map(
      (loc) => new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
    );

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const polyline = new window.kakao.maps.Polyline({
      map: kakaoMapRef.current,
      path: linePath,
      strokeWeight: 10,
      strokeColor: "#FF0000",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });

    polylineRef.current = polyline;

    const bounds = new window.kakao.maps.LatLngBounds();
    linePath.forEach((latLng) => bounds.extend(latLng));
    kakaoMapRef.current.setBounds(bounds);
  };

  return (
    <div>
      {!userLocation ? (
        <p>⏳ 위치를 불러오는 중...</p>
      ) : (
        <div
          id="map"
          ref={mapRef}
          style={{ width: "100%", height: "1000px" }}
        ></div>
      )}
    </div>
  );
};

export default KakaoMapComponent;
