import { z } from "zod";

export const updateTodoSchema = z.object({
  todoId: z.string().min(1, "Todo id is required."),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer."),
});

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
