import { z } from "zod";

// Helper schemas for reusability and better organization
export const socialMediaHandlesSchema = z.map(
  z.string(), // key type
  z.string().url("Invalid social media URL") // value type
);
