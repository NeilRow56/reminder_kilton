import { z } from "zod";

export const TaskSchema = z.object({
  collectionId: z.string(),
  id: z.string(),
  content: z.string().min(8, {
    message: "Task content must be at least 8 characters",
  }),
  expiresAt: z.date().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true });
export const UpdateTaskSchema = TaskSchema;
export const DeleteTaskSchema = TaskSchema.pick({ id: true });

export type CreateTaskSchemaType = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskSchemaType = z.infer<typeof UpdateTaskSchema>;
export type DeleteTaskSchemaType = z.infer<typeof DeleteTaskSchema>;
