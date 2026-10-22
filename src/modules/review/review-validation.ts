import { z } from "zod";

export const reviewSubmissionValidationSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      required_error: "Status must be either APPROVED or REJECTED",
    }),
    feedback: z
      .string({ required_error: "Feedback is required" })
      .trim()
      .min(5, "Feedback must be at least 5 characters long")
      .max(1500, "Feedback cannot exceed 1500 characters"),
  }),
});
