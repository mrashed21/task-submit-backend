import { PrismaClient, Role, SubmissionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[seed]: Starting database cleaning and seeding...");

  // Clean all existing data
  console.log("[seed]: Deleting existing reviews, submissions, and users...");
  await prisma.review.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("[seed]: Database cleared successfully!");

  const defaultPassword = await bcrypt.hash("123456", 10);

  // Seed Admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin Moderator",
      password: defaultPassword,
      role: Role.ADMIN,
    },
  });

  // Seed Mentor user
  const mentor = await prisma.user.create({
    data: {
      email: "mentor@gmail.com",
      name: "Senior Mentor",
      password: defaultPassword,
      role: Role.MENTOR,
    },
  });

  // Seed Student user
  const student = await prisma.user.create({
    data: {
      email: "student@gmail.com",
      name: "Student",
      password: defaultPassword,
      role: Role.STUDENT,
    },
  });

  console.log("[seed]: Seed completed successfully!");
  console.log("[seed]: Seeded Admin:", admin.email, "Password: 123456");
  console.log("[seed]: Seeded Mentor:", mentor.email, "Password: 123456");
  console.log("[seed]: Seeded Student:", student.email, "Password: 123456");
}

main()
  .catch((e) => {
    console.error("[seed]: Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
