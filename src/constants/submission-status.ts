export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type SubmissionStatusType =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];
