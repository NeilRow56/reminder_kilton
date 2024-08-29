import { CollectionColors } from "@/lib/constants";
import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string().min(4, {
    message: "Collection name must be at least 4 characters",
  }),
  color: z.string().refine((color) => Object.keys(CollectionColors)),
});

export const CreateCollectionSchema = CollectionSchema.omit({ id: true });
export const UpdateCollectionSchema = CollectionSchema;
export const DeleteCollectionSchema = CollectionSchema.pick({ id: true });

export type CreateCollectionSchemaType = z.infer<typeof CreateCollectionSchema>;
export type UpdateCollectionSchemaType = z.infer<typeof UpdateCollectionSchema>;
export type DeleteCollectionSchemaType = z.infer<typeof DeleteCollectionSchema>;
