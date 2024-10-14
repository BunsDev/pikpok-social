import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  browserLocalPersistence,
  User,
  confirmPasswordReset,
  verifyPasswordResetCode,
  // connectAuthEmulator,
} from "firebase/auth";
import { ErrorResponse, SuccessResponse } from "@src/types";
import { initializeApp, FirebaseError } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@config/firebase-config";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");
export const storage = getStorage(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");

export const getUserAuthInfo = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserCollectionInfo = async (uid: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    return userDocSnap.data();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // Handle the error by returning null or throw the error based on the requirement
  }
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("user", user);

    return {
      status: "success",
      message: "user created successfully",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("sign up error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred.",
      };
    }
  }
};

export const verifyEmail = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  const currentUser = auth.currentUser;

  console.log("currentUser", currentUser);
  if (currentUser) {
    try {
      await sendEmailVerification(currentUser);
      return {
        status: "success",
        message: "email verification sent",
      };
    } catch (error) {
      return {
        status: `error`,
        message: `email verification error ${error}`,
      };
    }
  }

  return {
    status: "error",
    message: "no user found",
  };
};

export const forgotPassword = async (
  email: string
): Promise<SuccessResponse | ErrorResponse> => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:5173/reset-password",
    });
    return {
      status: "success",
      message: "password reset email sent",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("password reset error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred during password reset.",
      };
    }
  }
};

export const verifyCode = async (
  code: string
): Promise<SuccessResponse | ErrorResponse> => {
  try {
    await verifyPasswordResetCode(auth, code);
    return {
      status: "success",
      message: "verification successful",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("verification error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred during code verification.",
      };
    }
  }
};

export const resetPasswordConfirmation = async (
  code: string,
  newPassword: string
): Promise<SuccessResponse | ErrorResponse> => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return {
      status: "success",
      message: "password reset successful",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("password reset error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred during password reset.",
      };
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    console.log("user", user);

    return {
      status: "success",
      message: "sign in successful",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("sign in error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred.",
      };
    }
  }
};

export const signIn = async (
  email: string,
  password: string,
  keepLogin: boolean
): Promise<SuccessResponse | ErrorResponse> => {
  console.log("keepLogin", keepLogin);

  try {
    const resp = await auth.setPersistence(browserLocalPersistence);
    console.log("resp", resp);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("user data", user);

    return {
      status: "success",
      message: "sign in successful",
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("sign in error", errorCode, errorMessage);

      return {
        status: "error",
        code: errorCode,
        message: errorMessage,
      };
    } else {
      return {
        status: "error",
        code: "unknown_error",
        message: "An unknown error occurred.",
      };
    }
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {
      status: "success",
      message: "sign out successful",
    };
  } catch (error) {
    return {
      status: `Error: ${error}`,
      message: "sign out error",
    };
  }
};
