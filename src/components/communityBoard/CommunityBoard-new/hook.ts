import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema } from "./schema";

export default function useCommunityBoardNew() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    title: string;
    contents: string;
    images: File[];
  }>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      title: "",
      contents: "",
      images: [],
    },
  });

  const images = watch("images") || [];
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: File[] = Array.from(e.target.files);
      setValue("images", [...(images || []), ...newFiles]);

      const previewURLs = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewURLs]);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  const appnedImg = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  const uploadImages = async (files: File[]) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/uploads/multiple", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("파일 업로드 실패");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      return [];
    }
  };

  const onSubmit = async (data: {
    images: File[];
    title: string;
    contents: string;
  }) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

      let imageUrls: string[] = [];
      if (data.images.length > 0) {
        imageUrls = (await uploadImages(data.images)) || [];
      }

      const payload = {
        title: data.title,
        contents: data.contents,
        images: imageUrls,
      };

      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("게시글 등록 실패");

      alert("게시글이 등록되었습니다!");
      router.push("/communityBoard");
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return {
    fileInputRef,
    register,
    handleSubmit,
    errors,
    inputValue,
    setInputValue,
    handleFileChange,
    removeImage,
    appnedImg,
    previewImages,
    uploadImages,
    onSubmit,
  };
}
