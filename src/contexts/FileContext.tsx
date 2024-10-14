import React, { createContext, useMemo, useState } from "react";

type FileContentType = {
  file: File | null;
  fileUrl: string;
  defaultName: string;
  fileType: string;
  title: string;
  description: string;
  uploadStatus: string;
  isChecked: boolean;
  isError: boolean;
  error: string;
};

type FileProviderType = {
  uploadInfo: FileContentType;
  setUploadInfo: React.Dispatch<React.SetStateAction<FileContentType>>;
};

export const FileContext = createContext<FileProviderType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export default function FileProvider({ children }: Props) {
  const [uploadInfo, setUploadInfo] = useState<FileContentType>({
    file: null,
    fileUrl: "",
    defaultName: "",
    fileType: "",
    title: "",
    description: "",
    uploadStatus: "",
    isError: false,
    error: "",
    isChecked: true,
  } as FileContentType);

  const value: FileProviderType = useMemo(
    () => ({
      uploadInfo,
      setUploadInfo,
    }),
    [uploadInfo]
  );

  return (
    <FileContext.Provider value={value}>
      <div className="flex gap-x-4 min-w-[60%]">{children}</div>
    </FileContext.Provider>
  );
}
