import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// 支持的文件类型配置
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "text/plain",
];

export const ACCEPTED_MEDIA_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
];

// 文件大小限制（单位：MB）
const SIZE_LIMITS = {
  image: 5,
  document: 10,
  media: 50,
};

interface UploadOptions {
  maxSize?: number; // 自定义大小限制（MB）
  acceptedTypes?: string[]; // 自定义支持的文件类型
  endpoint?: string; // 自定义上传端点
}

interface UploadResponse {
  url: string;
  fileType: string;
  fileName: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // 验证文件
  const validateFile = (file: File, options?: UploadOptions) => {
    const fileSize = file.size / (1024 * 1024); // 转换为 MB
    const maxSize = options?.maxSize || SIZE_LIMITS.media;
    const acceptedTypes = options?.acceptedTypes || [
      ...ACCEPTED_IMAGE_TYPES,
      ...ACCEPTED_DOCUMENT_TYPES,
      ...ACCEPTED_MEDIA_TYPES,
    ];

    if (fileSize > maxSize) {
      throw new Error(`File size should not exceed ${maxSize}MB`);
    }

    if (!acceptedTypes.includes(file.type)) {
      throw new Error("File type not supported");
    }
  };

  // 上传文件
  const uploadFile = async (
    file: File,
    options?: UploadOptions
  ): Promise<UploadResponse> => {
    try {
      setIsUploading(true);
      setProgress(0);

      // 验证文件
      validateFile(file, options);

      // 创建 FormData
      const formData = new FormData();
      formData.append("file", file);

      // 使用 XMLHttpRequest 发送请求
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", options?.endpoint || "/api/upload");
        xhr.setRequestHeader("Accept", "application/json");

        xhr.upload.onprogress = (event: any) => {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percentCompleted);
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            toast({
              title: "Upload Successful",
              description: "Your file has been uploaded successfully.",
            });
            resolve(response);
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.send(formData);
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  // 上传多个文件
  const uploadMultipleFiles = async (
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResponse[]> => {
    const results = [];
    for (const file of files) {
      const result = await uploadFile(file, options);
      results.push(result);
    }
    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
  };
}
