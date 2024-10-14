import { db } from "@services/authFirebase";
import { PostContentType } from "@src/types";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  updateDoc,
} from "firebase/firestore";

//paginate it and get 10 items at a time

type LastVisibleType = {
  type: string;
  queryDocSnap: QueryDocumentSnapshot<DocumentData, DocumentData>;
};

let lastVisible: LastVisibleType[] = [];

export async function getContentsByType(type: string, userId?: string) {
  try {
    const lastVisibleByType = lastVisible?.find(
      (lastVisible) => lastVisible?.type === type
    );

    let contentsQuery;

    if (!lastVisibleByType) {
      contentsQuery = query(
        collection(db, "contents"),
        where("contentType", "==", type),
        orderBy("views"),
        limit(10)
      );
    } else if (lastVisibleByType?.queryDocSnap) {
      contentsQuery = query(
        collection(db, "contents"),
        where("contentType", "==", type),
        orderBy("views"),
        startAfter(lastVisibleByType.queryDocSnap),
        limit(10)
      );
    } else {
      // Handle case where queryDocSnap is undefined
      console.warn("No valid last document found to paginate from");
      return [];
    }

    const documentSnapshots = await getDocs(contentsQuery);

    if (documentSnapshots.empty) {
      console.warn("No documents found for the specified query");
      return [];
    }

    const types = lastVisible.map((lastVisible) => lastVisible.type);

    if (lastVisible.length === 0 || !types.includes(type)) {
      lastVisible.push({
        type: type,
        queryDocSnap: documentSnapshots.docs[documentSnapshots.docs.length - 1],
      });
    } else {
      lastVisible = lastVisible.map((lastVisible) => {
        if (lastVisible.type === type) {
          return {
            type: type,
            queryDocSnap:
              documentSnapshots.docs[documentSnapshots.docs.length - 1],
          };
        }
        return lastVisible;
      });
    }

    const documents = documentSnapshots.docs.map((doc) =>
      doc.data()
    ) as PostContentType[];

    const paidContents = documents.filter((content) => !content.isPublic);

    if (paidContents.length === 0 || !userId) {
      return documents;
    }

    const paidCids = paidContents.map((content) => content.cid);

    // Get the user document reference
    const userDocRef = doc(db, "users", userId);
    const unlockedContentsRef = collection(userDocRef, "unlockedContents");

    // Query the unlockedContents subcollection only for relevant CIDs
    const unlockedContentsQuery = query(
      unlockedContentsRef,
      where("contentId", "in", paidCids)
    );

    // Fetch the matching documents from unlockedContents subcollection
    const unlockedContentsSnapshots = await getDocs(unlockedContentsQuery);

    // Map unlocked content CIDs to their signed URLs for faster lookup
    const unlockedContentMap = new Map(
      unlockedContentsSnapshots.docs.map((doc) => [
        doc.id,
        doc.data().signedUrl,
      ])
    );

    // Update the paidContents to set signedUrl and isPublic for unlocked contents
    const updatedContents = documents.map((content) => {
      if (!content.isPublic && unlockedContentMap.has(content.cid)) {
        // Unlock paid content by updating its signedUrl and isPublic
        return {
          ...content,
          signedUrl: unlockedContentMap.get(content.cid),
          isPublic: true,
        };
      }
      return content;
    });

    return updatedContents;
  } catch (error) {
    console.error("Error fetching contents:", error);
    return [];
  }
}

export async function getContentsByUser(userId: string) {
  try {
    const contentsQuery = query(
      collection(db, "contents"),
      where("posterId", "==", userId),
      orderBy("views"),
      limit(10)
    );

    const documentSnapshots = await getDocs(contentsQuery);

    if (documentSnapshots.empty) {
      return [];
    }

    const documents = documentSnapshots.docs.map((doc) =>
      doc.data()
    ) as PostContentType[];

    const paidContents = documents.filter((content) => !content.isPublic);

    if (paidContents.length === 0) {
      return documents;
    }

    const paidCids = paidContents.map((content) => content.cid);
    const userDocRef = doc(db, "users", userId);
    const unlockedContentsRef = collection(userDocRef, "unlockedContents");
    const unlockedContentsQuery = query(
      unlockedContentsRef,
      where("contentId", "in", paidCids)
    );

    const unlockedContentsSnapshots = await getDocs(unlockedContentsQuery);

    const unlockedContentMap = new Map(
      unlockedContentsSnapshots.docs.map((doc) => [
        doc.id,
        doc.data().signedUrl,
      ])
    );

    const updatedContents = documents.map((content) => {
      if (!content.isPublic && unlockedContentMap.has(content.cid)) {
        // Unlock paid content by updating its signedUrl and isPublic
        return {
          ...content,
          signedUrl: unlockedContentMap.get(content.cid),
          isPublic: true,
        };
      }
      return content;
    });

    return updatedContents;
  } catch (error) {
    console.error("Error fetching contents:", error);
    return [];
  }
}

export async function updateAccessControl(
  contentId: string,
  isPublic: boolean
) {
  try {
    await updateDoc(doc(db, "contents", contentId), {
      isPublic: isPublic,
    });
  } catch (error) {
    console.error(error);
  }
}
