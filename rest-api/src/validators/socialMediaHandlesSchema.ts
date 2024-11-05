import { z } from "zod";

// Helper schemas for reusability and better organization
export const socialMediaHandlesSchema = z.record(
  z.string().url("Invalid social media URL")
);
