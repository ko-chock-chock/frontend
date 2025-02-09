/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { authenticatedFetch } from "../auth/utils/tokenUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { BoardData, ExistingImage, JobFormData } from "./types";

import { z } from "zod";
import { jobFormSchema } from ".";

export const useJobBoardNew = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const param = useParams();
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [boardData, setBoardData] = useState<BoardData | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      mainRegion: "",
      subRegion: "",
      price: "",
      contents: "",
      newImages: [],
    },
  });

  const newImages = watch("newImages") || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setValue("newImages", fileArray); // react-hook-form의 setValue 사용
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 기존 이미지 삭제 처리 수정
  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch(
        `https://api.kochokchok.shop/api/v1/boards/image/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("이미지 삭제에 실패했습니다.");
      }

      // 성공적으로 삭제되면 상태 업데이트
      setExistingImages(
        existingImages.filter((img) => img.image_id !== imageId)
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "이미지 삭제에 실패했습니다."
      );
    }
  };

  // 새 이미지 삭제 처리
  const handleDeleteNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setValue("newImages", updatedImages);
  };

  // const onSubmit = async (data: JobFormData) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
  //     }
  //     const formData = new FormData();
  //     formData.append("title", data.title);
  //     formData.append("price", data.price.replace(/,/g, ""));
  //     formData.append("contents", data.contents);
  //     formData.append("status", "구인중");
  //     formData.append("location", `${data.mainRegion} ${data.subRegion}`);

  //     if (data.newImages) {
  //       data.newImages.forEach((image) => {
  //         formData.append("files", image);
  //       });
  //     }

  //     const response = await authenticatedFetch(`/api/trade`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message);
  //     }

  //     alert("게시물이 성공적으로 등록되었습니다.");
  //     router.push("/jobList");
  //   } catch (error) {
  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : "등록에 실패했습니다. 다시 시도해주세요."
  //     );
  //   }
  // };

  // const onEdit = async (data: JobFormData) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
  //     }

  //     const formData = new FormData();
  //     formData.append("title", data.title);
  //     formData.append("price", data.price.replace(/,/g, ""));
  //     formData.append("contents", data.contents);
  //     formData.append("status", "구인중");
  //     formData.append("location", `${data.mainRegion} ${data.subRegion}`);

  //     if (data.newImages) {
  //       data.newImages.forEach((image) => {
  //         formData.append("files", image);
  //       });
  //     }

  //     const response = await fetch(
  //       `https://api.kochokchok.shop/api/v1/boards/${param.boardId}/edit`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //         credentials: "include",
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message);
  //     }

  //     alert("게시물이 성공적으로 수정되었습니다.");
  //     router.push(`/jobList/${param.boardId}`);
  //   } catch (error) {
  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : "수정에 실패했습니다. 다시 시도해주세요."
  //     );
  //   }
  // };

  useEffect(() => {
    const fetchEditData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("토큰이 없습니다. 로그인이 필요합니다.");
        return;
      }

      try {
        const response = await fetch(
          `https://api.kochokchok.shop/api/v1/boards/${param.boardId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Access-Control-Allow-Headers": "Authorization, Content-Type",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const responseData = await response.json();
        const boardData: BoardData = responseData.data;
        setBoardData(boardData);

        // 폼 데이터 설정
        setValue("title", boardData.title || "");
        const [mainRegion, subRegion] = (boardData.location || "").split(" ");
        setValue("mainRegion", mainRegion || "");
        setValue("subRegion", subRegion || "");
        setValue("price", boardData.price?.toString() || "");
        setValue("contents", boardData.contents || "");

        // 기존 이미지 설정
        if (boardData.images && Array.isArray(boardData.images)) {
          setExistingImages(
            boardData.images.map((img) => ({
              image_id: img.image_id,
              image_url: img.image_url,
              is_thumbnail: img.is_thumbnail,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
  }, [param.boardId, setValue]);

  return {
    control,
    handleSubmit,
    errors,
    handleOpenFileDialog,
    handleFileChange,
    existingImages,

    handleDeleteExistingImage,
    watch,
    setValue,
    fileInputRef,
    router,
    newImages,
  };
};
