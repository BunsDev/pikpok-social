import { H1, Paragraph } from "@components/atoms/typography";
import ErrorContent from "@components/molecules/ErrorContent";
import LoadingContent from "@components/molecules/LoadingContent";
import { getContentsByUser } from "@src/services/api/contentApi";
import { getCurrentUser } from "@src/services/authFirebase";
import { PostContentType } from "@src/types";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const currentUser = getCurrentUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile-contents"],
    queryFn: () =>
      getContentsByUser(currentUser?.uid || "") as Promise<PostContentType[]>,
    staleTime: Infinity,
  });

  if (isLoading) {
    return <LoadingContent />;
  }


  if (isError) {
    return <ErrorContent />;
  }

  return (
    <div className="overflow-auto no-scrollbar h-[calc(100vh-72px)]">
      <div className="m-8 overflow-hidden transition-all duration-300 relative w-[60%] mx-auto rounded-md bg-[#1A1A1A] flex flex-col items-center justify-center gap-y-8 p-8">
        <div className="h-56 w-56 bg-slate-400 rounded-full flex items-center justify-center">
          <img
            src={
              currentUser?.photoURL ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <H1>{currentUser?.displayName || currentUser?.email}</H1>
        <div className="grid grid-cols-3 gap-2">
          {data?.map((content, index) => (
            <div key={index} className="rounded-lg overflow-hidden h-96">
              {content.contentType === "image" && (
                <img
                  src={content.signedUrl}
                  alt={content.title}
                  className="w-full h-full object-fill"
                />
              )}
              {content.contentType === "video" && (
                <video
                  src={content.signedUrl}
                  className="w-full h-full object-fill"
                />
              )}
              {content.contentType === "application" && (
                <div className="flex items-center justify-center flex-col h-full gap-y-2 border-4 border-[#e2e8f0] rounded-lg">
                  <div className="w-[60%]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="100%"
                      height="100%"
                      color={"#e2e8f0"}
                      fill={"none"}
                    >
                      <path
                        d="M8 7L16 7"
                        stroke="currentColor"
                        strokeWidth=".8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 11L12 11"
                        stroke="currentColor"
                        strokeWidth=".8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13 21.5V21C13 18.1716 13 16.7574 13.8787 15.8787C14.7574 15 16.1716 15 19 15H19.5M20 13.3431V10C20 6.22876 20 4.34315 18.8284 3.17157C17.6569 2 15.7712 2 12 2C8.22877 2 6.34315 2 5.17157 3.17157C4 4.34314 4 6.22876 4 10L4 14.5442C4 17.7892 4 19.4117 4.88607 20.5107C5.06508 20.7327 5.26731 20.9349 5.48933 21.1139C6.58831 22 8.21082 22 11.4558 22C12.1614 22 12.5141 22 12.8372 21.886C12.9044 21.8623 12.9702 21.835 13.0345 21.8043C13.3436 21.6564 13.593 21.407 14.0919 20.9081L18.8284 16.1716C19.4065 15.5935 19.6955 15.3045 19.8478 14.9369C20 14.5694 20 14.1606 20 13.3431Z"
                        stroke="currentColor"
                        strokeWidth=".8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Paragraph>
                    {content.title.length > 50
                      ? content.title.substring(0, 50) + "..."
                      : content.title}
                  </Paragraph>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
