import { SubmissionStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";

export const getDashboardStatistics = async () => {
  const [totalSubmissions, totalPending, totalApproved, totalRejected, totalStudents] =
    await Promise.all([
      prisma.submission.count(),
      prisma.submission.count({
        where: { status: SubmissionStatus.PENDING },
      }),
      prisma.submission.count({
        where: { status: SubmissionStatus.APPROVED },
      }),
      prisma.submission.count({
        where: { status: SubmissionStatus.REJECTED },
      }),
      prisma.user.count({
        where: { role: "STUDENT" },
      }),
    ]);

  const reviewedCount = totalApproved + totalRejected;
  const approvalRate =
    reviewedCount > 0 ? Number(((totalApproved / reviewedCount) * 100).toFixed(1)) : 0;

  return {
    totalSubmissions,
    totalPending,
    totalApproved,
    totalRejected,
    totalStudents,
    approvalRate,
  };
};
