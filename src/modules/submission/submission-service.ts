import { Prisma, SubmissionStatus } from "@prisma/client";
import { AppError } from "../../utils/app-error.js";
import { prisma } from "../../utils/prisma.js";

interface CreateSubmissionInput {
  project_name: string;
  repo_url: string;
  live_link: string;
  description: string;
}

interface QueryFilterOptions {
  page?: string;
  limit?: string;
  status?: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  sortBy?: "created_at" | "project_name" | "status";
  sortOrder?: "asc" | "desc";
}

export const createSubmission = async (
  userId: string,
  payload: CreateSubmissionInput
) => {
  const normalizedRepoUrl = payload.repo_url.toLowerCase().trim().replace(/\/+$/, "");

  // Duplicate submission check: check if user already submitted with identical repo URL
  const existingRepoSubmission = await prisma.submission.findFirst({
    where: {
      user_id: userId,
      repo_url: {
        mode: "insensitive",
        equals: normalizedRepoUrl,
      },
    },
  });

  if (existingRepoSubmission) {
    throw new AppError(
      409,
      "Duplicate submission: You have already submitted a project with this repository URL"
    );
  }

  // Also check if there is an active pending submission with the same project name
  const existingPendingProject = await prisma.submission.findFirst({
    where: {
      user_id: userId,
      project_name: {
        mode: "insensitive",
        equals: payload.project_name.trim(),
      },
      status: SubmissionStatus.PENDING,
    },
  });

  if (existingPendingProject) {
    throw new AppError(
      409,
      "Duplicate submission: You already have a pending review for a project with this name"
    );
  }

  const submission = await prisma.submission.create({
    data: {
      user_id: userId,
      project_name: payload.project_name.trim(),
      repo_url: normalizedRepoUrl,
      live_link: payload.live_link.trim(),
      description: payload.description.trim(),
      status: SubmissionStatus.PENDING,
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
  });

  return submission;
};

export const getMySubmissions = async (userId: string) => {
  const submissions = await prisma.submission.findMany({
    where: { user_id: userId },
    include: {
      reviews: {
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
      },
    },
    orderBy: { created_at: "desc" },
  });

  return submissions;
};

export const getAllSubmissions = async (query: QueryFilterOptions) => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.SubmissionWhereInput = {};

  // Server-side status filter
  if (query.status && query.status !== "ALL") {
    whereClause.status = query.status as SubmissionStatus;
  }

  // Server-side search filter
  if (query.search && query.search.trim() !== "") {
    const searchTerm = query.search.trim();
    whereClause.OR = [
      {
        project_name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        repo_url: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const sortBy = query.sortBy || "created_at";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const [total, submissions] = await Promise.all([
    prisma.submission.count({ where: whereClause }),
    prisma.submission.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
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
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    submissions,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getSubmissionById = async (submissionId: string) => {
  const submission = await prisma.submission.findUnique({
    where: { submission_id: submissionId },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
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
      },
    },
  });

  if (!submission) {
    throw new AppError(404, "Project submission not found");
  }

  return submission;
};
