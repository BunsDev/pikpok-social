import { useState } from "react";
import BrandButton from "@components/atoms/BrandButton";
import Input from "@components/atoms/Input";
import Switch from "@components/atoms/Switch";
import TextArea from "@components/atoms/Textarea";
import { H1, Paragraph } from "@components/atoms/typography";
import useFile from "@hooks/useFile";
import FileInput from "./FileInput";
import { getJwt } from "@src/services/pinataUtils";
import useAuth from "@hooks/useAuth";
import { getCurrentUser } from "@src/services/authFirebase";

type Props = {
  onClose: () => void;
};

type FileData = {
  cid: string;
  created_at: string;
  id: string;
  mime_type: string;
  name: string;
  number_of_files: number;
  size: number;
  user_id: string;
};

const FileUpload = ({ onClose }: Props) => {
  const { uploadInfo, setUploadInfo } = useFile();
  const { userData } = useAuth();
  const [isOn, setIsOn] = useState(true);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadInfo((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUploadInfo((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleToggle = () => {
    const newIsOn = !isOn;
    setUploadInfo((prev) => ({
      ...prev,
      isChecked: newIsOn,
    }));
    setIsOn(newIsOn);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { file, title, description, isChecked } = uploadInfo;

    if (!file) {
      setUploadInfo((prev) => ({
        ...prev,
        error: "Please upload a file.",
        isError: true,
        uploadStatus: "Please upload a file.",
      }));
      return;
    }

    const fifteenMB = 15728640;

    if (file.size > fifteenMB) {
      setUploadInfo((prev) => ({
        ...prev,
        uploadStatus: "File size exceeds 15MB.",
        isError: true,
        error: "File size exceeds 15MB.",
      }));
      return;
    }

    setUploadInfo((prev) => ({
      ...prev,
      uploadStatus: "Uploading file...",
      isError: false,
      error: "",
    }));

    const formData = new FormData();
    formData.append("file", file, file.name);
    const signedJWT = await getJwt();
    console.log("signedJWT", signedJWT);

    fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${signedJWT}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        const data = response.data as FileData;

        const body = {
          posterId: userData?.uid || "",
          posterName: userData?.displayName || "",
          description: description,
          isPublic: isChecked,
          cid: data.cid,
          mime_type: data.mime_type.split("/")[0],
          title: title || data.name,
        };

        const user = getCurrentUser();

        if (user) {
          user.getIdToken().then((token) => {
            const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              "Content-Type": "application/json",
              body: JSON.stringify(body),
            };
            fetch("https://uploaddata-oaqex6hz3a-uc.a.run.app", options)
              .then((response) => response.json())
              .then((response) => {
                setUploadInfo((prev) => ({
                  ...prev,
                  file: null,
                  fileUrl: "",
                  title: "",
                  description: "",
                  defaultName: "",
                  fileType: "",
                  uploadStatus: response.message,
                }));

                setTimeout(() => {
                  setUploadInfo((prev) => ({
                    ...prev,
                    uploadStatus: "",
                  }));
                }, 1000);
              })
              .catch(() => {
                setUploadInfo((prev) => ({
                  ...prev,
                  uploadStatus: "Try again in a bit.",
                  error: "An error occurred while uploading the file.",
                  isError: true,
                }));
              });
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-modal-background rounded-lg p-6 gap-y-6 flex flex-col items-start relative flex-1">
      <div className="flex w-full justify-between items-start">
        <H1>Content</H1>
        <button onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"#fff"}
            fill={"none"}
          >
            <path
              d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-start justify-start w-full gap-y-4">
        <FileInput
          onFileChange={(file) => {
            if (!file) return;
            const fileUrl = URL.createObjectURL(file);
            const fileName = file.name;
            const fileType = file.type;
            setUploadInfo((prev) => ({
              ...prev,
              file,
              fileUrl,
              defaultName: fileName,
              fileType,
            }));
          }}
        />
        <Input
          label="Title"
          value={uploadInfo.title}
          placeholder="Type your title here"
          onChange={handleTitleChange}
        />
        <TextArea
          label="Description"
          value={uploadInfo.description}
          placeholder="Type your description here"
          onChange={handleDescriptionChange}
        />
        <div className="flex flex-col items-start gap-x-4">
          <label htmlFor="switch" className="text-gray-300 text-sm mb-2">
            Content Access*
          </label>
          <div className="flex gap-x-4">
            <Switch isOn={isOn} handleToggle={handleToggle} />
            <Paragraph>{isOn ? "Free to View" : "Paid to View"}</Paragraph>
          </div>
        </div>
      </div>
      {uploadInfo.isError && (
        <p className=" text-red-400 w-80 text-balance text-left">
          {uploadInfo.error}
        </p>
      )}
      <BrandButton
        onClick={handleSubmit}
        variant={uploadInfo.isError ? "error" : "primary"}
        active={true}
      >
        {uploadInfo.uploadStatus || "Upload"}
      </BrandButton>
    </div>
  );
};

export default FileUpload;
