"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTodoAction } from "@/features/todos/actions/todo.actions";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/features/todos/schemas/create-todo.schema";
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

export function CreateTodoDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateTodoInput) {
    setFormMessage(null);

    const result = await createTodoAction(values);

    if (!result.ok) {
      setFormMessage(result.message);
      toast.error("Todo was not created", {
        description: result.message,
      });

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof CreateTodoInput, { message });
      }

      return;
    }

    form.reset();
    setOpen(false);
    router.refresh();
    toast.success("Todo created");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          New todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create todo</DialogTitle>
          <DialogDescription>
            Add a task to your private dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="todo-title">Title</FieldLabel>
              <Input
                id="todo-title"
                type="text"
                autoComplete="off"
                aria-invalid={!!form.formState.errors.title}
                disabled={form.formState.isSubmitting}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="todo-description">Description</FieldLabel>
              <Textarea
                id="todo-description"
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
                {form.formState.isSubmitting ? "Creating..." : "Create todo"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
