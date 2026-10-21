import { Prisma } from "@prisma/client";

export interface FormattedDatabaseError {
  statusCode: number;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
}

export const handlePostgresPrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): FormattedDatabaseError => {
  switch (error.code) {
    case "P2002": {
      const target = (error.meta?.target as string[]) || ["field"];
      const fieldName = Array.isArray(target) ? target.join(", ") : String(target);
      return {
        statusCode: 409,
        message: `Duplicate entry error: A record with this ${fieldName} already exists`,
        errorSources: [
          {
            path: fieldName,
            message: `Unique constraint violated on ${fieldName}`,
          },
        ],
      };
    }
    case "P2025": {
      const cause = (error.meta?.cause as string) || "Record to update/delete does not exist";
      return {
        statusCode: 404,
        message: cause,
      };
    }
    case "P2003": {
      const fieldName = (error.meta?.field_name as string) || "foreign key";
      return {
        statusCode: 400,
        message: `Foreign key constraint failed on field: ${fieldName}`,
      };
    }
    case "P2000": {
      return {
        statusCode: 400,
        message: "Provided value for one or more fields exceeds column length limit",
      };
    }
    case "P2014": {
      return {
        statusCode: 400,
        message: "Relation constraint violated between related database records",
      };
    }
    default: {
      return {
        statusCode: 500,
        message: `Database error occurred (Code: ${error.code})`,
      };
    }
  }
};
