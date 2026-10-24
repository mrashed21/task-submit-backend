import { Role, SubmissionStatus } from "@prisma/client";
import { AppError } from "../../utils/app-error.js";
import { hashPassword } from "../../utils/password-helpers.js";
import { prisma } from "../../utils/prisma.js";

interface CreateMentorPayload {
  name: string;
  email: string;
  password: string;
}

export const createMentor = async (payload: CreateMentorPayload) => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError(409, "A user with this email address already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const mentor = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: Role.MENTOR,
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  return mentor;
};

export const getAllMentors = async () => {
  const mentors = await prisma.user.findMany({
    where: { role: Role.MENTOR },
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return mentors.map((m) => ({
    user_id: m.user_id,
    name: m.name,
    email: m.email,
    role: m.role,
    created_at: m.created_at,
    updated_at: m.updated_at,
    reviewCount: m._count.reviews,
  }));
};

export const deleteMentor = async (mentorId: string) => {
  const mentor = await prisma.user.findUnique({
    where: { user_id: mentorId },
  });

  if (!mentor || mentor.role !== Role.MENTOR) {
    throw new AppError(404, "Mentor not found or user is not a mentor");
  }

  await prisma.user.delete({
    where: { user_id: mentorId },
  });

  return { message: "Mentor deleted successfully" };
};

export const getAdminStats = async () => {
  const [
    totalMentors,
    totalStudents,
    totalAdmins,
    totalSubmissions,
    totalPending,
    totalApproved,
    totalRejected,
    totalReviews,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.MENTOR } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.submission.count(),
    prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
    prisma.submission.count({ where: { status: SubmissionStatus.APPROVED } }),
    prisma.submission.count({ where: { status: SubmissionStatus.REJECTED } }),
    prisma.review.count(),
  ]);

  const reviewedCount = totalApproved + totalRejected;
  const approvalRate =
    reviewedCount > 0 ? Number(((totalApproved / reviewedCount) * 100).toFixed(1)) : 0;

  return {
    totalMentors,
    totalStudents,
    totalAdmins,
    totalSubmissions,
    totalPending,
    totalApproved,
    totalRejected,
    totalReviews,
    approvalRate,
  };
};

export const getAllUsers = async (role?: string) => {
  const whereClause: Record<string, unknown> = {};
  if (role && (role === "STUDENT" || role === "MENTOR" || role === "ADMIN")) {
    whereClause.role = role as Role;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      _count: {
        select: {
          submissions: true,
          reviews: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return users;
};
