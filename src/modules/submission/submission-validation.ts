import { z } from "zod";

export const createSubmissionValidationSchema = z.object({
  body: z.object({
    project_name: z
      .string({ required_error: "Project name is required" })
      .trim()
      .min(3, "Project name must be at least 3 characters long")
      .max(100, "Project name cannot exceed 100 characters"),
    repo_url: z
      .string({ required_error: "Repository URL is required" })
      .trim()
      .url("Repository URL must be a valid URL")
      .refine(
        (url) =>
          url.includes("github.com") ||
          url.includes("gitlab.com") ||
          url.includes("bitbucket.org"),
        "Repository URL must be a valid GitHub, GitLab, or Bitbucket link"
      ),
    live_link: z
      .string({ required_error: "Live demo link is required" })
      .trim()
      .url("Live demo link must be a valid URL"),
    description: z
      .string({ required_error: "Project description is required" })
      .trim()
      .min(20, "Description must be at least 20 characters to explain the project adequately")
      .max(2000, "Description cannot exceed 2000 characters"),
  }),
});

export const getSubmissionsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["ALL", "PENDING", "APPROVED", "REJECTED"]).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["created_at", "project_name", "status"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
