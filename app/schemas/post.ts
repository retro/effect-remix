import { z } from "zod";

export const Post = z.object({
  title: z.string(),
  lead: z.string().min(10),
});

export type Post = z.infer<typeof Post>;
