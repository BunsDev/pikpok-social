import { getCurrentUser } from "@src/services/authFirebase";
import { PostContentType } from "@src/types";
import { QueryClient } from "@tanstack/react-query";

// Define the types for the props and the response
interface UnlockedContentResponse {
  signedUrl: string | null;
  message: string;
}

const useUnlockContent = (
  userData: { uid: string; points: number },
  queryClient: QueryClient
) => {
  const unlockContentAndUpdateObject = async (
    cost: number,
    cid: string,
    contentKey: string // dynamic content key like "clips", "images", "videos"
  ) => {
    return new Promise<void>((resolve, reject) => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        return reject("User not found");
      }

      if (!userData?.uid || userData.points < cost) {
        return reject("Insufficient points");
      }
      const contentData = queryClient.getQueryData<PostContentType[]>([
        contentKey,
      ]);

      if (!contentData) {
        throw new Error(`No content type found for key: ${contentKey}`);
      }

      currentUser.getIdToken().then((token) => {
        fetch("https://unlockcontent-oaqex6hz3a-uc.a.run.app", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentId: cid,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to unlock content");
            }
            return response.json();
          })
          .then((data: UnlockedContentResponse) => {
            const updatedContent = contentData.map((item) =>
              item.cid === cid
                ? { ...item, isPublic: true, signedUrl: data.signedUrl }
                : item
            );

            queryClient.setQueryData([contentKey], updatedContent);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  };

  return { unlockContentAndUpdateObject };
};

export default useUnlockContent;
