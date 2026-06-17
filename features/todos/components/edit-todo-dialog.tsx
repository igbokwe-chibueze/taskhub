"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateTodoAction } from "@/features/todos/actions/todo.actions";
import {
  updateTodoSchema,
  type UpdateTodoInput,
} from "@/features/todos/schemas/update-todo.schema";
import type { Todo } from "@/features/todos/types/todo";

export function EditTodoDialog({
  todo,
  open,
  onOpenChange,
}: {
  todo: Todo;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;
  const form = useForm<UpdateTodoInput>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      todoId: todo.id,
      title: todo.title,
      description: todo.description,
    },
  });

  async function onSubmit(values: UpdateTodoInput) {
    setFormMessage(null);

    const result = await updateTodoAction(values);

    if (!result.ok) {
      setFormMessage(result.message);
      toast.error("Todo was not updated", {
        description: result.message,
      });

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof UpdateTodoInput, { message });
      }

      return;
    }

    setDialogOpen(false);
    router.refresh();
    toast.success("Todo updated");
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {open === undefined ? (
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Pencil aria-hidden="true" />
            Edit
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription>
            Update the title or description for this private todo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          aria-busy={form.formState.isSubmitting}
        >
          <FieldGroup>
            <input type="hidden" {...form.register("todoId")} />

            <Field>
              <FieldLabel htmlFor={`todo-title-${todo.id}`}>Title</FieldLabel>
              <Input
                id={`todo-title-${todo.id}`}
                type="text"
                autoComplete="off"
                aria-invalid={!!form.formState.errors.title}
                disabled={form.formState.isSubmitting}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor={`todo-description-${todo.id}`}>
                Description
              </FieldLabel>
              <Textarea
                id={`todo-description-${todo.id}`}
                rows={4}
                aria-invalid={!!form.formState.errors.description}
                disabled={form.formState.isSubmitting}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            {formMessage ? <FieldError>{formMessage}</FieldError> : null}

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
