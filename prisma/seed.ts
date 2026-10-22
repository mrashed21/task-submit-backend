import { PrismaClient, Role, SubmissionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[seed]: Starting database seeding...");

  const adminPassword = await bcrypt.hash("admin1234", 10);
  const mentorPassword = await bcrypt.hash("mentor1234", 10);
  const studentPassword = await bcrypt.hash("student1234", 10);

  // Seed Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin Moderator",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Seed Mentor user
  const mentor = await prisma.user.upsert({
    where: { email: "mentor@example.com" },
    update: {},
    create: {
      email: "mentor@example.com",
      name: "Senior Mentor",
      password: mentorPassword,
      role: Role.MENTOR,
    },
  });

  // Seed Student user
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Alex Johnson",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  // Seed Demo Submissions
  const submission1 = await prisma.submission.upsert({
    where: { submission_id: "demo-submission-uuid-001" },
    update: {},
    create: {
      submission_id: "demo-submission-uuid-001",
      project_name: "E-Commerce Microservices Platform",
      repo_url: "https://github.com/student/ecom-microservices",
      live_link: "https://ecom-demo.example.com",
      description:
        "Full-stack scalable e-commerce application built with Next.js, Express, PostgreSQL, and Redis caching. Includes cart, payments, and inventory management.",
      status: SubmissionStatus.PENDING,
      user_id: student.user_id,
    },
  });

  const submission2 = await prisma.submission.upsert({
    where: { submission_id: "demo-submission-uuid-002" },
    update: {},
    create: {
      submission_id: "demo-submission-uuid-002",
      project_name: "Realtime Collaboration Whiteboard",
      repo_url: "https://github.com/student/collab-whiteboard",
      live_link: "https://whiteboard.example.com",
      description:
        "Multiplayer collaborative canvas with WebSocket synchronization, room isolation, and SVG export capabilities.",
      status: SubmissionStatus.APPROVED,
      user_id: student.user_id,
    },
  });

  // Seed Review for approved submission
  await prisma.review.upsert({
    where: { review_id: "demo-review-uuid-001" },
    update: {},
    create: {
      review_id: "demo-review-uuid-001",
      submission_id: submission2.submission_id,
      user_id: mentor.user_id,
      status: SubmissionStatus.APPROVED,
      feedback:
        "Outstanding code structure, well-thought-out WebSocket architecture, and clean error handling. Approved!",
      review_date: new Date(),
    },
  });

  console.log("[seed]: Seed completed successfully!");
  console.log("[seed]: Seeded Admin:", admin.email);
  console.log("[seed]: Seeded Mentor:", mentor.email);
  console.log("[seed]: Seeded Student:", student.email);
  console.log("[seed]: Seeded Sample Submissions:", submission1.project_name, submission2.project_name);
}

main()
  .catch((e) => {
    console.error("[seed]: Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
