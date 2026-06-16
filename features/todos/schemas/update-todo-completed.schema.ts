import { z } from "zod";

export const updateTodoCompletedSchema = z.object({
  todoId: z.string().min(1, "Todo id is required."),
  completed: z.boolean(),
});

export type UpdateTodoCompletedInput = z.infer<typeof updateTodoCompletedSchema>;
