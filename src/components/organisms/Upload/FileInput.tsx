import BrandButton from "@components/atoms/BrandButton";
import useFile from "@hooks/useFile";
import React, { useRef } from "react";

interface FileInputProps {
  onFileChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setUploadInfo } = useFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    const fifteenMB = 15728640;
    if (selectedFile) {
      if (selectedFile.size > fifteenMB) {
        setUploadInfo((prev) => ({
          ...prev,
          error: "File size should be less than 15MB",
          isError: true,
          file: null,
        }));
        return;
      } else {
        setUploadInfo((prev) => ({
          ...prev,
          error: "",
          isError: false,
          file: selectedFile,
        }));
      }
    }
    onFileChange(selectedFile);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <BrandButton active variant="secondary" onClick={handleButtonClick}>
        Select File
      </BrandButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*, application/*"
        className="hidden"
      />
    </>
  );
};

export default FileInput;
