import { z } from "zod";

export const deleteTodoSchema = z.object({
  todoId: z.string().min(1, "Todo id is required."),
});

export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
