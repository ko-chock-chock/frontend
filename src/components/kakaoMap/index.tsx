'use client'
import React, { useEffect, useState } from 'react';
const KAKAO_MAP_URL = process.env.NEXT_PUBLIC_KAKAO_MAP_URL || "https://dapi.kakao.com/v2/maps/sdk.js";
const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
const KakaoMap = ({ role, socket }) => {
  const [map, setMap] = useState(null); // 지도 객체
  const [marker, setMarker] = useState(null); // 마커 객체
  const [polyline, setPolyline] = useState(null); // 경로 표시용 Polyline

  useEffect(() => {
    // 카카오 지도 SDK 로드
    const script = document.createElement('script');
    script.src = `${KAKAO_MAP_URL}?appkey=${KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 중심 좌표
          level: 3,
        };

        // 지도 생성
        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
        setMap(kakaoMap);

        // 폴리라인 초기화
        const kakaoPolyline = new kakao.maps.Polyline({
          path: [],
          strokeWeight: 5,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
        });
        kakaoPolyline.setMap(kakaoMap);
        setPolyline(kakaoPolyline);
      });
    };

    return () => {
      document.head.removeChild(script); // 클린업: 스크립트 제거
    };
  }, []);

  useEffect(() => {
    if (map && socket) {
      // 위치 데이터 수신
      socket.on('locationUpdate', (data) => {
        const { latitude, longitude } = data;
        const currentPos = new kakao.maps.LatLng(latitude, longitude);

        // 지도 중심 이동
        map.setCenter(currentPos);

        // 마커 위치 업데이트
        if (!marker) {
          const newMarker = new kakao.maps.Marker({
            position: currentPos,
            map: map,
          });
          setMarker(newMarker);
        } else {
          marker.setPosition(currentPos);
        }

        // 폴리라인 경로 추가
        if (polyline) {
          const path = polyline.getPath();
          path.push(currentPos);
          polyline.setPath(path);
        }
      });

      return () => {
        socket.off('locationUpdate');
      };
    }
  }, [map, socket, marker, polyline]);

  return <div id="map" style={{ width: '100%', height: '80vh' }}></div>;
};

export default KakaoMap;
