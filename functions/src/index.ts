import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { logger } from "firebase-functions/v2";
import * as functions from "firebase-functions/v1";
import { PinataSDK } from "pinata";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { randomUUID } from "crypto";
import * as cors from "cors";

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({ origin: "https://pikpok-8e666.web.app" });

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

type ContentType = {
  posterId: string;
  posterName: string;
  title: string;
  description: string;
  likes: number;
  views: number;
  coinsEarned: number;
  cid: string;
  isPublic: boolean;
  contentType: string;
  signedUrl: string;
};

type FormData = {
  posterId: string;
  posterName: string;
  description: string;
  isPublic: boolean;
  contentType: "images" | "videos" | "documents"; // Assuming "contentType" has specific options
  cid: string;
  mime_type: string;
  title: string;
};

type UserData = {
  uid: string;
  name: string;
  email: string;
  profilePicture: string;
  points: number;
  unlockedContents: Array<string>;
};

const validateUser = async (
  req: Request,
  cb: (error?: string, uid?: string) => void
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  try {
    if (!idToken) {
      return cb("No token provided");
    }

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Pass the UID to the callback
    cb(undefined, decodedToken.uid);
  } catch (error) {
    // Catch and pass the error to the callback
    cb(`Invalid token: ${error}`);
  }
};

const validataFormData = (body: FormData, user: UserData) => {
  const acceptedContentTypes = [
    "image",
    "video",
    "document",
    "audio",
    "application",
  ];

  const isIdEqual = user.uid === body.posterId;
  const isTitleNotEmpty = !!body.title;
  const isDescriptionNotEmpty = !!body.description;
  const isContentTypeAccepted = acceptedContentTypes.includes(body.mime_type);

  logger.info(body, user);
  logger.info(
    "isIdEqual: ",
    isIdEqual,
    "isTitleNotEmpty: ",
    isTitleNotEmpty,
    "isDescriptionNotEmpty: ",
    isDescriptionNotEmpty,
    "isContentTypeAccepted: ",
    isContentTypeAccepted
  );
  return (
    isIdEqual &&
    isTitleNotEmpty &&
    isDescriptionNotEmpty &&
    isContentTypeAccepted
  );
};

export const addUserOnCreate = functions.auth.user().onCreate(async (user) => {
  const userDocRef = db.collection("users").doc(user.uid);

  try {
    // Use Firestore transaction for atomic operation
    await db.runTransaction(async (transaction) => {
      transaction.set(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        points: 1000,
        profilePicture: user.photoURL,
        status: "active", // Status field to track user's state
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp for user creation
      });
    });

    console.log(`User document created successfully for UID: ${user.uid}`);
  } catch (error) {
    console.error("Error creating user document: ", error);
  }
});

export const generateSignedJwt = onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      // Call validateUser and handle the error
      validateUser(req, async (error) => {
        if (error) {
          return res.status(401).json({ message: "Unauthorized", error });
        }

        try {
          const keyRestrictions = {
            keyName: `SignedUrlKey${randomUUID()}`,
            maxUses: 1,
            permissions: {
              endpoints: {
                data: {
                  pinList: false,
                  userPinnedDataTotal: false,
                },
                pinning: {
                  pinFileToIPFS: true,
                  pinJSONToIPFS: false,
                  pinJobs: false,
                  unpin: false,
                  userPinPolicy: false,
                },
              },
            },
          };

          const options = {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              authorization: `Bearer ${process.env.PINATA_JWT}`, // Ensure the JWT is defined in your environment variables
            },
            body: JSON.stringify(keyRestrictions),
          };

          // Fetching the signed JWT from Pinata
          const jwtResponse = await fetch(
            "https://api.pinata.cloud/users/generateApiKey",
            options
          );

          // Check if the request was successful
          if (!jwtResponse.ok) {
            throw new Error(
              `Failed to generate JWT: ${jwtResponse.statusText}`
            );
          }

          const json = await jwtResponse.json();
          const { JWT } = json;

          res.status(200).send(JWT);
        } catch (error) {
          res.status(500).json({ message: "Failed to generate JWT", error });
        }
      });
    });
  }
);

export const uploadData = onRequest(async (req: Request, res: Response) => {
  corsHandler(req, res, async () => {
    validateUser(req, async (error, uid) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized", error });
      }

      // The user is authenticated, proceed with the rest of the function
      try {
        const body = req.body as FormData;

        const contentData: ContentType = {
          posterId: body.posterId,
          posterName: body.posterName,
          title: body.title.slice(0, 100),
          description: body.description.slice(0, 300),
          cid: body.cid,
          likes: 0,
          views: 0,
          coinsEarned: 0,
          isPublic: body.isPublic,
          contentType: body.mime_type,
          signedUrl: "",
        };

        // Validate if the user exists in Firestore
        const userDoc = await db.collection("users").doc(uid!).get();
        if (!userDoc.exists) {
          return res.status(404).send({ error: "User not found" });
        }

        const user = userDoc.data() as UserData;

        if (!validataFormData(body, user)) {
          logger.error("Invalid request data");
          return res.status(400).send({ error: "Invalid request data" });
        }

        try {
          const signedUrl = await pinata.gateways.createSignedURL({
            cid: contentData.cid,
            expires: 864000,
          });

          if (contentData.isPublic) {
            contentData.signedUrl = signedUrl;
          }

          const unlockedContentsRef = db
            .collection("users")
            .doc(uid!)
            .collection("unlockedContents");

          await unlockedContentsRef.doc(contentData.cid).set({
            contentId: contentData.cid,
            signedUrl: signedUrl,
            onUrlCreation: Timestamp.now(),
          });
        } catch (error) {
          logger.error("Error generating signed URL from Pinata:", error);
          return res
            .status(500)
            .send({ error: "Failed to generate signed URL from Pinata" });
        }

        await db.collection("contents").add(contentData);

        res
          .status(200)
          .send({ message: "Files successfully uploaded to Pinata!" });
      } catch (error) {
        logger.error("Error processing files:", error);
        res.status(500).send({ error: "Failed to upload files" });
      }
    });
  });
});

export const unlockContent = onRequest(async (req: Request, res: Response) => {
  corsHandler(req, res, async () => {
    validateUser(req, async (error, uid) => {
      if (error) {
        return res.status(401).json({
          message: "Unauthorized: ${error}",
          signedUrl: null,
        });
      }

      const { contentId } = req.body;
      const staticPoints = 100;

      try {
        // Start a transaction
        await db.runTransaction(async (transaction) => {
          // Get the viewer's document
          const viewerDocRef = db.collection("users").doc(uid!);
          const viewerDoc = await transaction.get(viewerDocRef);

          const contentInfoWhereCid = await db
            .collection("contents")
            .where("cid", "==", contentId)
            .get();

          if (contentInfoWhereCid.empty) {
            logger.error("Content not found");
            throw new Error("Content not found");
          }

          const contentInfo = contentInfoWhereCid.docs[0].data() as ContentType;

          //find the content poster's document
          const posterDocRef = db.collection("users").doc(contentInfo.posterId);
          const posterDoc = await transaction.get(posterDocRef);
          const posterInfo = posterDoc.data() as UserData;

          // Ensure the viewer exists
          if (!viewerDoc.exists) {
            logger.error("Viewer not found");
            throw new Error("Viewer not found");
          }

          // Get data from viewer
          const viewer = viewerDoc.data() as UserData;

          // Check if the viewer has enough points
          if (viewer.points < staticPoints) {
            logger.error("Insufficient points to unlock content");
            throw new Error("Insufficient points to unlock content");
          }

          // Update viewer points
          const viewerPoints = viewer.points - staticPoints;

          //Update poster points
          const posterPoints = posterInfo.points + staticPoints;

          // Generate the signed URL for the content
          const signedUrl = await pinata.gateways.createSignedURL({
            cid: contentId,
            expires: 864000,
          });

          // Create a reference for the unlocked content in the subcollection
          const unlockedContentDocRef = viewerDocRef
            .collection("unlockedContents")
            .doc(contentId);

          // Add the unlocked content to the subcollection
          transaction.set(unlockedContentDocRef, {
            contentId,
            signedUrl,
            onUrlCreation: Timestamp.now(),
          });

          // Update the viewer's points
          transaction.update(viewerDocRef, {
            points: viewerPoints,
          });

          // Update the poster's points
          transaction.update(posterDocRef, {
            points: posterPoints,
          });

          // Success response
          res.status(200).send({
            signedUrl: signedUrl,
            message: "Content unlocked successfully",
          });
        });
      } catch (error) {
        // Generic error handler
        logger.error("ERROR:", error);
        res.status(400).send({
          message: error,
          signedUrl: null,
        });
      }
    });
  });
});
