import { H1, Paragraph } from "@components/atoms/typography";
import useFile from "@hooks/useFile";
import EmptySvg from "@src/svgs/EmptySvg";

const FileInformation = () => {
  const {
    uploadInfo: { fileUrl, defaultName, fileType, file },
  } = useFile();
  
  return (
    <div className="bg-modal-background rounded-lg p-6 gap-y-6 flex flex-col items-start relative">
      <H1>File Information</H1>
      {!file && (
        <div className="w-[18.625rem] flex flex-col items-center justify-center p-8 gap-y-8 flex-1">
          <EmptySvg />
          <Paragraph>Nothing. Just Nothing.</Paragraph>
        </div>
      )}
      {file && (
        <>
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              className="max-w-[18.625rem] aspect-square object-fill"
              src={fileUrl}
              alt="file-image"
            />
          </div>
          <div className="flex flex-col gap-y-1 items-start">
            <p className="text-white">
              <span className="text-neutral-400 pr-2">name:</span>
              <span>
                {defaultName.length > 20
                  ? `${defaultName.slice(0, 20)}...`
                  : defaultName}
              </span>
            </p>
            <p className="text-white">
              <span className="text-neutral-400 pr-2">type:</span>
              <span>{fileType}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileInformation;
