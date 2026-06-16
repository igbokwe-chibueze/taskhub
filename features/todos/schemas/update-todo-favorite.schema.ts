import { z } from "zod";

export const updateTodoFavoriteSchema = z.object({
  todoId: z.string().min(1, "Todo id is required."),
  favorite: z.boolean(),
});

export type UpdateTodoFavoriteInput = z.infer<typeof updateTodoFavoriteSchema>;
