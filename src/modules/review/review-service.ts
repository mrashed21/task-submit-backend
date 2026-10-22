import { SubmissionStatus } from "@prisma/client";
import { AppError } from "../../utils/app-error.js";
import { prisma } from "../../utils/prisma.js";

interface ReviewInput {
  status: "APPROVED" | "REJECTED";
  feedback: string;
}

export const createReview = async (
  mentorId: string,
  submissionId: string,
  payload: ReviewInput
) => {
  const existingSubmission = await prisma.submission.findUnique({
    where: { submission_id: submissionId },
  });

  if (!existingSubmission) {
    throw new AppError(404, "Submission not found to review");
  }

  // Execute review creation and submission status update inside an atomic transaction
  const [createdReview, updatedSubmission] = await prisma.$transaction([
    prisma.review.create({
      data: {
        submission_id: submissionId,
        user_id: mentorId,
        status: payload.status as SubmissionStatus,
        feedback: payload.feedback.trim(),
        review_date: new Date(),
      },
      include: {
        mentor: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.submission.update({
      where: { submission_id: submissionId },
      data: {
        status: payload.status as SubmissionStatus,
      },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    review: createdReview,
    submission: updatedSubmission,
  };
};

export const getReviewsBySubmissionId = async (submissionId: string) => {
  const reviews = await prisma.review.findMany({
    where: { submission_id: submissionId },
    include: {
      mentor: {
        select: {
          user_id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { review_date: "desc" },
  });

  return reviews;
};
