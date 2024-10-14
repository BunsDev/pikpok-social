import { getCurrentUser } from "./authFirebase";

export async function getJwt() {
  try {
    const user = getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const token = await user.getIdToken();
    const jwtRes = await fetch(
      "https://generatesignedjwt-oaqex6hz3a-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const JWT = await jwtRes.text();
    return JWT;
  } catch (error) {
    console.error("JWT ERROR: ", error);
  }
}

export function generatePinataFileUrl(cid: string): string {
  const data = {
    url: `https://example.mypinata.cloud/files/${cid}`,
    expires: 500000,
    date: 1724875300,
    method: "GET",
  };

  return JSON.stringify(data);
}
