/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
const KAKAO_MAP_URL = "https://dapi.kakao.com/v2/maps/sdk.js";
const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

const KakaoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  const pathCoords: { lat: number; lng: number }[] = [
    { lat: 37.537776, lng: 127.140009 },
    { lat: 37.545539, lng: 127.142906 },
    { lat: 37.5495, lng: 127.1475 },
    { lat: 37.5482, lng: 127.149 },
    { lat: 37.547, lng: 127.1505 },
    { lat: 37.546453, lng: 127.151675 },
    { lat: 37.5455, lng: 127.15 },
    { lat: 37.544, lng: 127.1485 },
    { lat: 37.543, lng: 127.147 },
    { lat: 37.542, lng: 127.1455 },
    { lat: 37.541, lng: 127.144 },
    { lat: 37.537776, lng: 127.140009 },
    null, // 테스트용 null 값
  ].filter(
    (coord): coord is { lat: number; lng: number } =>
      coord !== null &&
      typeof coord.lat === "number" &&
      typeof coord.lng === "number"
  );

  useEffect(() => {
    const loadKakaoMapScript = async () => {
      const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
      if (!existingScript) {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = KAKAO_MAP_SCRIPT_ID;
          script.src = `${KAKAO_MAP_URL}?appkey=${apiKey}&libraries=services&autoload=false`;
          script.async = true;
          script.onload = () => {
            if (window.kakao && window.kakao.maps) {
              window.kakao.maps.load(() => resolve());
            } else {
              reject("Kakao maps SDK failed to load");
            }
          };
          script.onerror = () => reject("Failed to load Kakao Maps script");
          document.head.appendChild(script);
        });
      } else if (window.kakao?.maps) {
        return Promise.resolve();
      } else {
        return Promise.reject("Kakao maps SDK not available");
      }
    };

    const initializeMap = async () => {
      try {
        await loadKakaoMapScript();

        if (!window.kakao?.maps) {
          console.error("Kakao maps SDK not available");
          return;
        }

        if (!mapContainer.current) return;

        const centerCoords = new window.kakao.maps.LatLng(
          pathCoords[0].lat,
          pathCoords[0].lng
        );

        const options = {
          center: centerCoords,
          level: 5,
        };

        mapInstance.current = new window.kakao.maps.Map(
          mapContainer.current,
          options
        );

        polylineRef.current = new window.kakao.maps.Polyline({
          path: [],
          strokeWeight: 3,
          strokeColor: "#1D8B5A",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });

        polylineRef.current.setMap(mapInstance.current);

        markerRef.current = new window.kakao.maps.Marker({
          position: centerCoords,
          map: mapInstance.current,
        });

        const animatePolyline = () => {
          let currentIndex = 0;
          let progress = 0;
          let framesPerSegment = 200; // 기본 분할 개수

          const animate = () => {
            if (currentIndex >= pathCoords.length - 1) {
              if (animationRef.current) {
                window.cancelAnimationFrame(animationRef.current);
              }
              return;
            }

            const start = new window.kakao.maps.LatLng(
              pathCoords[currentIndex].lat,
              pathCoords[currentIndex].lng
            );
            const end = new window.kakao.maps.LatLng(
              pathCoords[currentIndex + 1].lat,
              pathCoords[currentIndex + 1].lng
            );

            // 두 좌표 간 거리 계산
            const distance = Math.sqrt(
              Math.pow(end.getLng() - start.getLng(), 2) +
                Math.pow(end.getLat() - start.getLat(), 2)
            );

            // 거리 기반으로 프레임 개수 조정 (거리가 크면 더 많은 프레임)
            framesPerSegment = Math.max(200, Math.ceil(distance * 1000000));

            const dx = (end.getLng() - start.getLng()) / framesPerSegment;
            const dy = (end.getLat() - start.getLat()) / framesPerSegment;

            progress += 1;

            if (progress <= framesPerSegment) {
              const newPoint = new window.kakao.maps.LatLng(
                start.getLat() + dy * progress,
                start.getLng() + dx * progress
              );

              const currentPath = [...polylineRef.current.getPath(), newPoint];
              polylineRef.current.setPath(currentPath);
              markerRef.current.setPosition(newPoint);

              animationRef.current = requestAnimationFrame(animate);
            } else {
              progress = 0;
              currentIndex++;
              animationRef.current = requestAnimationFrame(animate);
            }
          };

          animate();
        };

        animatePolyline();
      } catch (error) {
        console.error("Error initializing Kakao Map:", error);
      }
    };

    initializeMap();

    return () => {
      const script = document.getElementById(KAKAO_MAP_SCRIPT_ID);
      if (script) script.remove();
      mapInstance.current = null;
      polylineRef.current = null;
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "400px",
      }}
    />
  );
};

export default KakaoMap;
