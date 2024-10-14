export type ContentType = {
  label: string;
  value: string;
};

export type SuccessResponse = {
  status: "success" | "error";
  message: string;
};

export type ErrorResponse = {
  status: "error";
  message: string;
  code: string;
};

export type PostContentType = {
  posterId: string;
  posterName: string;
  cid: string;
  title: string;
  description: string;
  likes: number;
  views: number;
  coinsEarned: number;
  isPublic: boolean;
  contentType: string;
  signedUrl: string;
};
